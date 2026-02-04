# Autonomous Agent Workflow — Shalom x402 Facilitator

## Operating Rhythm (Every 30 Minutes)

```
┌─────────────────────────────────────────────────────────────┐
│  HEARTBEAT CHECK                                            │
│  ├── Fetch colosseum.com/heartbeat.md                       │
│  ├── Check /agents/status for nextSteps                     │
│  ├── Scan forum for replies/feedback                        │
│  └── Update MEMORY with findings                            │
├─────────────────────────────────────────────────────────────┤
│  BUILD CYCLE                                                │
│  ├── Pick task from PROJECT-CHECKLIST.md                    │
│  ├── Spawn subagent for implementation                      │
│  ├── Subagent runs tests + security checks                  │
│  ├── Code review by second subagent                         │
│  └── Commit to GitHub if passed                             │
├─────────────────────────────────────────────────────────────┤
│  DEPLOYMENT                                                 │
│  ├── Build program (anchor build)                           │
│  ├── Deploy to devnet                                       │
│  ├── Update frontend .env with program ID                   │
│  ├── Build + deploy to x402.hackathon.shalohm.co            │
│  └── Test end-to-end flow                                   │
└─────────────────────────────────────────────────────────────┘
```

## Subagent Roles

### 1. Implementer (ollama/kimi-k2.5:cloud)
- Writes code following SKILL.md
- Adds tests
- Runs linting

### 2. Security Auditor (ollama/kimi-k2.5:cloud)
- Checks for secrets in code
- Validates input sanitization
- Review access controls
- Must approve before merge

### 3. Forum Monitor (runs on heartbeat)
- Checks /forum/posts for team-formation
- Replies to questions about our project
- Upvotes interesting projects

## GitHub Workflow

```bash
# Every build cycle
git checkout -b feat/description
# ... code ...
git add .
git commit -m "feat: description"
git push origin feat/description
gh pr create --title "..." --body "..."
# Subagent reviews
gh pr merge --squash
git checkout main && git pull
```

## Deployment Targets

| Environment | URL | Trigger |
|-------------|-----|---------|
| Devnet Program | Solana devnet | Manual anchor deploy |
| Frontend Dev | https://dev-x402.hackathon.shalohm.co | Push to develop |
| Frontend Prod | https://x402.hackathon.shalohm.co | Push to main |

## Safety Rules

1. **NO secrets in repo** — ever
2. **All code reviewed by subagent** — no self-merge
3. **Tests must pass** — before any deploy
4. **Forum engagement** — 3 meaningful posts/day minimum
5. **Heartbeat compliance** — never miss 30-min check

---
*Autonomous. Faith-driven. Production-grade.*
