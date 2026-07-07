# SETUP-KEYS — ✅ COMPLETE (2026-07-07) — build in progress

All decisions locked:

| Decision | Value |
|---|---|
| OpenRouter monthly cap | **$10/month** |
| Free-tier models | **Allowed** when quality suffices |
| Scope | **Defaults accepted** — no auth, `*.vercel.app`, goal as written below |
| Vercel ↔ GitHub auto-deploy | ✅ Connected (`dclawstack/dclaw-wiki`), root directory set to `frontend` |
| Neon API key | Skipped (not needed — schema managed via `DATABASE_URL`) |

Claude reads this file at the start of the autonomous build. Only the items
marked **FILL IN** need your input — everything else is already verified working.

## Already verified — no action needed

| Item | Status |
|---|---|
| Neon Postgres | ✅ DB exists; `DATABASE_URL` set locally (`frontend/.env.local`) and on Vercel (Dev + Preview + Production via Neon integration) |
| OpenRouter API key | ✅ Set locally and on Vercel (Dev + Production) |
| Vercel CLI | ✅ Logged in as `tharuni-01`, linked to project `dclaw-trust-wiki` |
| GitHub push access | ✅ `git push` to `dclawstack/dclaw-wiki` works from this machine |

## 1. Vercel ↔ GitHub auto-deploy — FILL IN (one click, maybe)

The Vercel project is not yet connected to the GitHub repo, so pushes don't
auto-deploy. Claude will run `vercel git connect` — but if the Vercel GitHub App
isn't installed on the `dclawstack` org, that command fails and you must
install it once:

- Go to <https://vercel.com/tharuni-01s-projects/dclaw-trust-wiki/settings/git>
  and connect `dclawstack/dclaw-wiki` (install the GitHub App on the org if prompted).

- [ ] Done / already installed
- [ ] Skip auto-deploy — Claude deploys via `vercel deploy` from the CLI instead

> Note: the Next.js app lives in `frontend/`, so the Vercel project's
> **Root Directory** must be set to `frontend` for git deploys to build.
> Claude will set this via the API/CLI if the connection exists.

## 2. OpenRouter budget — FILL IN

> Key received ✅ (verified working, paid tier) — stored in `frontend/.env.local`,
> removed from this file so it can't be committed to git.

Consensus calls fan one question out to 2–3 models. To pick models responsibly
Claude needs a ceiling:

- Monthly spend cap (USD): `____`  (e.g. 5, 10, 25)
- OK to use free-tier models (`:free` variants) when quality allows? yes / no: `____`

## 3. Neon API key — OPTIONAL

Only needed if you want Claude to manage Neon itself (create DB branches for
preview deploys, resize, metrics). Schema migrations already work through
`DATABASE_URL` without it.

- `NEON_API_KEY`: `____`  (from <https://console.neon.tech/app/settings/api-keys>, or leave blank)

## 4. Scope decisions — FILL IN (or leave blank to accept defaults)

Claude's default goal, unless you override it here:

> **Goal:** Ship dclaw-trust-wiki v1.0 to production on Vercel — a trust-loop
> wiki where every page has a freshness/verification state, AI copilot answers
> are backed by multi-model consensus with cited sources, and the roadmap +
> progress metrics live in the Neon DB itself (visible in the app's dashboard).
> Done = all roadmap items in the DB marked shipped, e2e smoke tests green
> against the production URL.

- Override / extra requirements: `____`
- Auth (login) in v1.0? Default: **no** — public read, open edit, like the current app. Override: `____`
- Custom domain? Default: **no** — use `*.vercel.app`. Override: `____`

---

When you've filled this in, just say **"go"** and Claude builds autonomously:
roadmap seeded into the Neon `roadmap` table → implement → test → push →
deploy → verify production → repeat until done.
