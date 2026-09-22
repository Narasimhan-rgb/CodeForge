# Repository status — 22 September 2026

## Role

React/Vite workspace with Express, JWT sessions, SQLite/sql.js persistence, per-user pages, demo requests and optional external summarization.

## Reproduction

Copy `.env.example` to `.env`; set a random JWT_SECRET (at least 32 characters). Run `npm ci` and `npm run dev`. For a single long-running server, run `npm run build` then `npm start`.

## Outstanding work

Use a persistent writable disk and one backend process for sql.js. Vercel /tmp storage is ephemeral and is not durable multi-instance storage. Without external AI configuration the summary is an explicitly labelled local fallback. Public production use requires rate limiting and a durable shared database.

Build or unit-test success is not evidence of a deployed service or a completed research evaluation. See the pull request for checks executed for this revision.

## Checks executed in this pass

Production build, signed-token tampering regression and live local signup/login/page API smoke checks passed. Multi-instance persistence and deployed-service behavior were not tested.
