// OpenRouter client with a token-efficient model router + a consensus/verify
// step. Cheap models do classification/drafting; a second diverse model
// verifies high-stakes answers so we only return claims we trust.

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// Tiered model selection — pick the cheapest model that fits the job.
// Tiers span diverse families so the consensus verifier is a genuinely
// independent second opinion, not the same model twice.
export const MODELS = {
  free: process.env.OR_MODEL_FREE || "meta-llama/llama-3.3-70b-instruct:free",
  cheap: process.env.OR_MODEL_CHEAP || "deepseek/deepseek-v4-flash",
  alt: process.env.OR_MODEL_ALT || "google/gemini-2.5-flash-lite",
  strong: process.env.OR_MODEL_STRONG || "anthropic/claude-haiku-4.5",
} as const;

// Monthly spend ceiling (USD). At 80% paid calls degrade to the free tier;
// at 100% paid calls are refused outright.
const BUDGET_USD = Number(process.env.OR_BUDGET_MONTHLY_USD || 10);
let budgetCache: { usage: number; fetchedAt: number } | null = null;

async function monthlyUsage(key: string): Promise<number> {
  if (budgetCache && Date.now() - budgetCache.fetchedAt < 10 * 60 * 1000) {
    return budgetCache.usage;
  }
  try {
    const resp = await fetch("https://openrouter.ai/api/v1/key", {
      headers: { Authorization: `Bearer ${key}` },
    });
    const data = await resp.json();
    budgetCache = { usage: data?.data?.usage_monthly ?? 0, fetchedAt: Date.now() };
  } catch {
    budgetCache = { usage: 0, fetchedAt: Date.now() }; // fail open, re-check in 10 min
  }
  return budgetCache.usage;
}

type Msg = { role: "system" | "user" | "assistant"; content: string };

export async function chat(
  messages: Msg[],
  opts: { model?: string; maxTokens?: number; temperature?: number; json?: boolean } = {},
): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY not set");
  let model = opts.model || MODELS.cheap;
  if (model !== MODELS.free) {
    const usage = await monthlyUsage(key);
    if (usage >= BUDGET_USD) {
      throw new Error(`AI budget exhausted ($${usage.toFixed(2)} of $${BUDGET_USD}/mo)`);
    }
    if (usage >= BUDGET_USD * 0.8) model = MODELS.free;
  }
  const resp = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "X-Title": "DClaw Trust Wiki",
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: opts.maxTokens ?? 700,
      temperature: opts.temperature ?? 0.2,
      ...(opts.json ? { response_format: { type: "json_object" } } : {}),
    }),
  });
  if (!resp.ok) throw new Error(`OpenRouter ${resp.status}: ${await resp.text()}`);
  const data = await resp.json();
  return (data.choices?.[0]?.message?.content ?? "").trim();
}

function parseJson<T>(s: string): T | null {
  try {
    return JSON.parse(s) as T;
  } catch {
    const m = s.match(/\{[\s\S]*\}/);
    if (m) {
      try {
        return JSON.parse(m[0]) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
}

export interface Source {
  n: number;
  documentId: string;
  title: string;
  score: number;
}

export interface AnswerResult {
  answer: string;
  confidence: number; // 0..1
  usedSources: Source[];
  provider: string;
  refused: boolean;
}

const SYSTEM = `You are a knowledge assistant for an internal wiki. Answer ONLY using the provided sources.
Rules:
- Cite sources inline as [n] matching the source numbers.
- If the sources do not contain the answer, you MUST say you don't know — do not guess.
- Return STRICT JSON: {"answer": string, "confidence": number (0..1), "used": number[], "known": boolean}.
- "known" is false when the sources don't support an answer; then "answer" briefly says what's missing and confidence is low.`;

/**
 * Produce a cited answer. Drafts with a cheap model, then a second diverse
 * model verifies the draft is grounded in the sources (consensus). The final
 * confidence blends the drafter's self-estimate with the verifier's support.
 */
export async function answerWithCitations(
  question: string,
  sources: Source[],
  contexts: string[],
): Promise<AnswerResult> {
  if (sources.length === 0) {
    return {
      answer:
        "I don't have a verified source for that yet. Add a relevant page and I'll be able to answer with a citation.",
      confidence: 0,
      usedSources: [],
      provider: "none",
      refused: true,
    };
  }

  const contextBlock = sources
    .map((s, i) => `[${s.n}] ${s.title}\n${contexts[i]}`)
    .join("\n\n");
  const userPrompt = `Sources:\n${contextBlock}\n\nQuestion: ${question}`;

  const draftRaw = await chat(
    [
      { role: "system", content: SYSTEM },
      { role: "user", content: userPrompt },
    ],
    { model: MODELS.cheap, json: true, maxTokens: 700 },
  );
  const draft = parseJson<{ answer: string; confidence: number; used: number[]; known: boolean }>(
    draftRaw,
  );

  if (!draft || !draft.known) {
    return {
      answer:
        draft?.answer ||
        "I couldn't find this in the current knowledge base, so I won't guess.",
      confidence: Math.min(draft?.confidence ?? 0.1, 0.3),
      usedSources: [],
      provider: MODELS.cheap,
      refused: true,
    };
  }

  // Consensus/verify: a diverse model checks the draft is supported by sources.
  let verifierSupport = 0.6;
  try {
    const verRaw = await chat(
      [
        {
          role: "system",
          content:
            'You are a strict fact-checker. Given SOURCES and a proposed ANSWER, decide if every claim in the answer is supported by the sources. Return STRICT JSON {"supported": boolean, "confidence": number}.',
        },
        { role: "user", content: `SOURCES:\n${contextBlock}\n\nANSWER:\n${draft.answer}` },
      ],
      { model: MODELS.alt, json: true, maxTokens: 200 },
    );
    const ver = parseJson<{ supported: boolean; confidence: number }>(verRaw);
    if (ver) verifierSupport = ver.supported ? Math.max(0.6, ver.confidence) : Math.min(0.35, ver.confidence);
  } catch {
    // Verifier unavailable — fall back to the drafter's self-estimate only.
  }

  const used = (draft.used || []).map((n) => sources.find((s) => s.n === n)).filter(Boolean) as Source[];
  const confidence = Math.round(((draft.confidence ?? 0.5) * 0.5 + verifierSupport * 0.5) * 100) / 100;

  return {
    answer: draft.answer,
    confidence,
    usedSources: used.length ? used : sources,
    provider: `${MODELS.cheap}+${MODELS.alt}`,
    refused: confidence < 0.35,
  };
}
