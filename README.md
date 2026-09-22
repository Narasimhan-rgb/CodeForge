# CodeForge — productivity workspace

React/Vite workspace with Express, JWT sessions, SQLite/sql.js persistence, per-user pages, demo requests and optional external summarization.

## Run locally

Copy `.env.example` to `.env`; set a random JWT_SECRET (at least 32 characters). Run `npm ci` and `npm run dev`. For a single long-running server, run `npm run build` then `npm start`.

## Status and limits

Use a persistent writable disk and one backend process for sql.js. Vercel /tmp storage is ephemeral and is not durable multi-instance storage. Without external AI configuration the summary is an explicitly labelled local fallback. Public production use requires rate limiting and a durable shared database.

See [REPOSITORY_STATUS.md](REPOSITORY_STATUS.md) for the verification scope and remaining work.
