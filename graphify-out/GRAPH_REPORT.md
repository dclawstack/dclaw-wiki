# Graph Report - .  (2026-05-20)

## Corpus Check
- Corpus is ~22,251 words - fits in a single context window. You may not need a graph.

## Summary
- 477 nodes · 622 edges · 57 communities (34 shown, 23 thin omitted)
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 79 edges (avg confidence: 0.74)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Wiki Backend Core (Models, Repos, CRUD)|Wiki Backend Core (Models, Repos, CRUD)]]
- [[_COMMUNITY_Frontend Page Editor & Restore UI|Frontend Page Editor & Restore UI]]
- [[_COMMUNITY_Kubernetes & Helm Deployment|Kubernetes & Helm Deployment]]
- [[_COMMUNITY_Page Tree Navigation & Sidebar|Page Tree Navigation & Sidebar]]
- [[_COMMUNITY_Docs — Best Practices & Use Cases|Docs — Best Practices & Use Cases]]
- [[_COMMUNITY_Frontend Layout, Search & Routing|Frontend Layout, Search & Routing]]
- [[_COMMUNITY_Agent Prompts & Architecture Rules|Agent Prompts & Architecture Rules]]
- [[_COMMUNITY_AI Copilot, Search & Schemas|AI Copilot, Search & Schemas]]
- [[_COMMUNITY_Frontend Dependencies & npm|Frontend Dependencies & npm]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Feature Roadmap (PLAN-v1.2)|Feature Roadmap (PLAN-v1.2)]]
- [[_COMMUNITY_DPanel Manifest & App Config|DPanel Manifest & App Config]]
- [[_COMMUNITY_Product Spec (CRM entities — stale)|Product Spec (CRM entities — stale)]]
- [[_COMMUNITY_Alembic Migrations|Alembic Migrations]]
- [[_COMMUNITY_App Configuration & Settings|App Configuration & Settings]]
- [[_COMMUNITY_FastAPI App & Database Init|FastAPI App & Database Init]]
- [[_COMMUNITY_Docs Metadata|Docs Metadata]]
- [[_COMMUNITY_Claude Code Settings|Claude Code Settings]]
- [[_COMMUNITY_Misc 20 helm_deployment_frontend_deplo|Misc 20: helm_deployment_frontend_deplo]]
- [[_COMMUNITY_Misc 23 frontend_next_config_js|Misc 23: frontend_next_config_js]]
- [[_COMMUNITY_Misc 24 frontend_postcss_config_config|Misc 24: frontend_postcss_config_config]]
- [[_COMMUNITY_Misc 25 frontend_tailwind_config_confi|Misc 25: frontend_tailwind_config_confi]]
- [[_COMMUNITY_Misc 26 helm_service_backend_service|Misc 26: helm_service_backend_service]]
- [[_COMMUNITY_Misc 27 helm_service_frontend_service|Misc 27: helm_service_frontend_service]]
- [[_COMMUNITY_Misc 28 root_agents_directory_structur|Misc 28: root_agents_directory_structur]]
- [[_COMMUNITY_Misc 29 root_readme_port_registry|Misc 29: root_readme_port_registry]]
- [[_COMMUNITY_Misc 44 root_settings_local_claude_per|Misc 44: root_settings_local_claude_per]]
- [[_COMMUNITY_Misc 45 root_docs_meta_app_manifest|Misc 45: root_docs_meta_app_manifest]]
- [[_COMMUNITY_Misc 46 root_dclaw_manifest_pwa|Misc 46: root_dclaw_manifest_pwa]]
- [[_COMMUNITY_Misc 47 root_revised_prd_scaffold_chec|Misc 47: root_revised_prd_scaffold_chec]]
- [[_COMMUNITY_Misc 48 root_agent_prompts_feature_dev|Misc 48: root_agent_prompts_feature_dev]]
- [[_COMMUNITY_Misc 49 root_team_onboarding_troublesh|Misc 49: root_team_onboarding_troublesh]]
- [[_COMMUNITY_Misc 50 helm_values_backend_image|Misc 50: helm_values_backend_image]]
- [[_COMMUNITY_Misc 51 helm_notes_notes|Misc 51: helm_notes_notes]]
- [[_COMMUNITY_Misc 52 getting_started_index_prerequi|Misc 52: getting_started_index_prerequi]]
- [[_COMMUNITY_Misc 53 getting_started_quickstart_fir|Misc 53: getting_started_quickstart_fir]]
- [[_COMMUNITY_Misc 54 getting_started_quickstart_con|Misc 54: getting_started_quickstart_con]]
- [[_COMMUNITY_Misc 55 troubleshooting_faq_backup|Misc 55: troubleshooting_faq_backup]]
- [[_COMMUNITY_Misc 56 troubleshooting_faq_no_kuberne|Misc 56: troubleshooting_faq_no_kuberne]]

## God Nodes (most connected - your core abstractions)
1. `WikiRepository` - 25 edges
2. `cn()` - 17 edges
3. `compilerOptions` - 15 edges
4. `WikiAIService` - 14 edges
5. `Technology Stack` - 13 edges
6. `Select` - 12 edges
7. `fetchJson()` - 12 edges
8. `Button` - 10 edges
9. `BaseRepository` - 9 edges
10. `getPage()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Frontend Builder Agent Prompt` --references--> `Frontend Package Dependencies`  [INFERRED]
  AGENT-PROMPTS.md → frontend/package.json
- `CI Frontend Build Job (npm + next build)` --references--> `Frontend Package Dependencies`  [EXTRACTED]
  .github/workflows/ci.yml → frontend/package.json
- `Sacred Architecture & Tech Stack` --references--> `Next.js 14 Frontend Framework`  [EXTRACTED]
  REVISED-PRD.md → frontend/package.json
- `Helm Chart: dclaw-wiki` --references--> `Docker Compose Service Stack`  [INFERRED]
  helm/Chart.yaml → docker-compose.yml
- `Postgres Auto-Init dclaw_* Databases` --references--> `Postgres 16 Docker Service`  [INFERRED]
  PATCH-2026-05-15-shared-hub-postgres.md → docker-compose.yml

## Hyperedges (group relationships)
- **Parallel Agent Build: Backend + Frontend + DevOps simultaneously** — root_agent_prompts_backend_architect, root_agent_prompts_frontend_builder, root_agent_prompts_devops_engineer [EXTRACTED 1.00]
- **Docker Compose Stack: Postgres + Backend + Frontend** — root_docker_compose_postgres_service, root_docker_compose_backend_service, root_docker_compose_frontend_service [EXTRACTED 1.00]
- **CI Pipeline: Backend Tests + Frontend Build** — root_workflows_ci_backend_tests, root_workflows_ci_frontend_build, root_workflows_ci [EXTRACTED 1.00]
- **DClaw Wiki P0 Must-Have Features** — root_plan_v12_ai_wiki_copilot, root_plan_v12_hierarchical_page_tree, root_plan_v12_advanced_search, root_revised_prd_p0_features [EXTRACTED 1.00]
- **CRM Core Data Entities: Customer, Deal, Activity** — root_product_spec_customer_entity, root_product_spec_deal_entity, root_product_spec_activity_entity [EXTRACTED 1.00]
- **GitHub Actions Automation: CI + Claude Review + Claude Action** — root_workflows_ci, root_workflows_claude_code_review, root_workflows_claude_action [EXTRACTED 1.00]
- **Scaffold Agent Constraints: Architecture Lock + Anti-Patterns + Critical Rules** — root_agents_architecture_lock, root_agents_anti_patterns, root_readme_critical_rules, root_scaling_playbook_anti_patterns [EXTRACTED 1.00]
- **DClaw Wiki Helm Chart: Deployment + Service + Ingress + ServiceAccount** — dclaw_wiki_deployment_deployment, dclaw_wiki_service_service, dclaw_wiki_ingress_ingress, dclaw_wiki_serviceaccount_serviceaccount [EXTRACTED 1.00]
- **DClaw App Helm Templates: Frontend Deployment + Frontend Service + Backend Service** — helm_deployment_frontend_deployment, helm_service_frontend_service, helm_service_backend_service [EXTRACTED 1.00]
- **Getting Started Flow: Index → Installation → Quickstart → Configuration** — getting_started_index_overview, getting_started_installation_dpanel, getting_started_quickstart_open_app, getting_started_configuration_backend_env [EXTRACTED 1.00]
- **DClaw Architecture Stack: Frontend + Backend + Infrastructure** — reference_architecture_frontend, reference_architecture_backend, reference_architecture_infrastructure [EXTRACTED 1.00]
- **Troubleshooting Suite: App Start + DB Connection + Frontend-Backend + FAQ** — troubleshooting_common_issues_app_start, troubleshooting_common_issues_db_connection, troubleshooting_common_issues_frontend_backend, troubleshooting_faq_update, troubleshooting_faq_backup, troubleshooting_faq_scale, troubleshooting_faq_no_kubernetes [EXTRACTED 1.00]
- **Frontend Technology Stack: Next.js + React + Tailwind CSS + TypeScript** — reference_stack_nextjs, reference_stack_react, reference_stack_tailwindcss, reference_stack_typescript [EXTRACTED 1.00]
- **Backend Technology Stack: Python + FastAPI + Pydantic + SQLAlchemy** — reference_stack_python, reference_stack_fastapi, reference_stack_pydantic, reference_stack_sqlalchemy [EXTRACTED 1.00]
- **Security Best Practices: PII Shield + API Key Rotation + Network Policies** — guides_best_practices_pii_shield, guides_best_practices_api_key_rotation, guides_best_practices_network_policies [EXTRACTED 1.00]
- **Primary Use Cases: Knowledge Workflows + Team Collaboration + Reporting & Analytics** — guides_use_cases_knowledge_workflows, guides_use_cases_team_collaboration, guides_use_cases_reporting_analytics [EXTRACTED 1.00]
- **Industry Examples: Startups + Enterprise + Agencies** — guides_use_cases_startup_deployment, guides_use_cases_enterprise_onpremise, guides_use_cases_agency_whitelabel [EXTRACTED 1.00]

## Communities (57 total, 23 thin omitted)

### Community 0 - "Wiki Backend Core (Models, Repos, CRUD)"
Cohesion: 0.07
Nodes (22): Base, Return a naive UTC datetime (no tzinfo).      PostgreSQL TIMESTAMP WITHOUT TIME, utc_now(), DeclarativeBase, Base, Base class for all SQLAlchemy models.      ALL models MUST inherit from this cla, PageRevision, WikiPage (+14 more)

### Community 1 - "Frontend Page Editor & Restore UI"
Cohesion: 0.09
Nodes (29): PageEditor(), PageEditorProps, Props, RestoreButton(), EditPage(), Props, HistoryPage(), Props (+21 more)

### Community 2 - "Kubernetes & Helm Deployment"
Cohesion: 0.06
Nodes (39): CloudNativePG (PostgreSQL Operator), DClaw Operator (Kubernetes Operator), DPanel (App Management UI), nginx-ingress + cert-manager, DClaw Wiki Helm Chart (Chart.yaml), DClaw Wiki Deployment Template, DClaw Wiki Ingress Template (nginx), DClaw Wiki Service Template (+31 more)

### Community 3 - "Page Tree Navigation & Sidebar"
Cohesion: 0.07
Nodes (26): PageTreeNav(), PageTreeNode(), PageTreeNodeProps, PageTreeProps, WikiSidebar(), WikiSidebarProps, PageTree, cn() (+18 more)

### Community 4 - "Docs — Best Practices & Use Cases"
Cohesion: 0.07
Nodes (38): API Key Rotation (90-day cycle), Best Practices Guide, Data Management Best Practices, kubectl Monitoring (kubectl top), Kubernetes Network Policies, Performance Best Practices, PII Shield, Redis Caching (+30 more)

### Community 5 - "Frontend Layout, Search & Routing"
Cohesion: 0.11
Nodes (23): inter, metadata, SearchBar(), Message, WikiCopilot(), Dashboard(), listPages(), PageRead (+15 more)

### Community 6 - "Agent Prompts & Architecture Rules"
Cohesion: 0.07
Nodes (37): Backend Architect Agent Prompt, DevOps Engineer Agent Prompt, Frontend Builder Agent Prompt, QA / Code Review Agent Prompt, Agent Anti-Patterns — Never Do, Architecture Lock Constraints, Database Rules for Agents, Pre-Built UI Components (shadcn-free) (+29 more)

### Community 7 - "AI Copilot, Search & Schemas"
Cohesion: 0.09
Nodes (19): BaseModel, RevisionRead, PageCreate, PageRead, PageTree, PageUpdate, Full-text search over page title and content using ILIKE.          Uses PostgreS, SearchService (+11 more)

### Community 8 - "Frontend Dependencies & npm"
Cohesion: 0.08
Nodes (25): dependencies, autoprefixer, class-variance-authority, clsx, lucide-react, next, postcss, react (+17 more)

### Community 9 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "Feature Roadmap (PLAN-v1.2)"
Cohesion: 0.16
Nodes (14): Advanced Search & Discovery, AI Content Generation & Improvement, AI Wiki Copilot (Knowledge Navigator), DClaw Wiki v1.2 Feature Roadmap, Hierarchical Page Tree & Navigation, Knowledge Graph (P2 — v1.3+), Templates & Blueprints, AI Copilot Mandate (YC S25/W26 Requirement) (+6 more)

### Community 12 - "DPanel Manifest & App Config"
Cohesion: 0.17
Nodes (11): app_id, app_name, backend_port, base_api_path, category, color, database, frontend_port (+3 more)

### Community 13 - "Product Spec (CRM entities — stale)"
Cohesion: 0.47
Nodes (6): Activity Entity, CRM AI Features, CRM API Endpoints v1.0, DClaw CRM Product Spec, Customer Entity, Deal Entity

### Community 15 - "App Configuration & Settings"
Cohesion: 0.50
Nodes (4): BaseSettings, Config, get_settings(), Settings

### Community 17 - "Docs Metadata"
Cohesion: 0.40
Nodes (4): app_id, nav, title, version

### Community 20 - "Misc 20: helm_deployment_frontend_deplo"
Cohesion: 0.67
Nodes (3): Frontend Deployment Template (dclaw-app), Frontend Image (ghcr.io/dclawstack/dclaw-wiki-frontend), Replica Count

## Knowledge Gaps
- **163 isolated node(s):** `allow`, `Config`, `app_id`, `version`, `title` (+158 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Select` connect `Wiki Backend Core (Models, Repos, CRUD)` to `Page Tree Navigation & Sidebar`, `AI Copilot, Search & Schemas`?**
  _High betweenness centrality (0.106) - this node is a cross-community bridge._
- **Why does `cn()` connect `Page Tree Navigation & Sidebar` to `Frontend Dependencies & npm`, `Frontend Layout, Search & Routing`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Why does `WikiRepository` connect `Wiki Backend Core (Models, Repos, CRUD)` to `AI Copilot, Search & Schemas`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `WikiRepository` (e.g. with `PageCreate` and `PageUpdate`) actually correct?**
  _`WikiRepository` has 12 INFERRED edges - model-reasoned connections that need verification._
- **Are the 7 inferred relationships involving `WikiAIService` (e.g. with `ChatRequest` and `ChatResponse`) actually correct?**
  _`WikiAIService` has 7 INFERRED edges - model-reasoned connections that need verification._
- **What connects `allow`, `Generic async CRUD repository.      Subclass per entity:         class UserRepos`, `Build a nested tree from a flat list of PageRead objects.` to the rest of the system?**
  _176 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Wiki Backend Core (Models, Repos, CRUD)` be split into smaller, more focused modules?**
  _Cohesion score 0.06560283687943262 - nodes in this community are weakly interconnected._