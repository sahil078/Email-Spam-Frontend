# Email-Span Frontend (Next.js)

A Next.js (App Router) frontend for the Email-Span project. Built with TypeScript and structured around an `app/` directory with colocated routes and layouts.

- Project root: [/Users/mdsahil/Documents/email-span/frontend](./)
- Key configs:
  - [package.json](/Users/mdsahil/Documents/email-span/frontend/package.json)
  - [next.config.ts](/Users/mdsahil/Documents/email-span/frontend/next.config.ts)
  - [tsconfig.json](/Users/mdsahil/Documents/email-span/frontend/tsconfig.json)
  - [eslint.config.mjs](/Users/mdsahil/Documents/email-span/frontend/eslint.config.mjs)
  - [.env.local](/Users/mdsahil/Documents/email-span/frontend/.env.local)

## Quickstart

- Install dependencies:
  ```bash
  npm install
  ```
- Run the dev server:
  ```bash
  npm run dev
  ```
- Build for production:
  ```bash
  npm run build
  ```
- Start the production server:
  ```bash
  npm run start
  ```
- Lint:
  ```bash
  npm run lint
  ```

Open http://localhost:3000 to view the app.

## Project Structure

- `app/` — App Router pages, layouts, and route handlers
  - Entry page: [app/page.tsx](/Users/mdsahil/Documents/email-span/frontend/app/page.tsx) (auto-reloads on save)
- `components/` — Reusable UI components
- `lib/` — Utilities, helpers, and service clients
- `types/` — Shared TypeScript types
- `public/` — Static assets served from the root (`/`)
- `.next/` — Build output (generated)

## Environment Variables

- Local development variables live in [.env.local](/Users/mdsahil/Documents/email-span/frontend/.env.local) (not committed).
- Variables exposed to the browser must be prefixed with `NEXT_PUBLIC_`.
  - Example:
    ```
    NEXT_PUBLIC_API_BASE_URL=https://api.example.com
    ```
- Server-only variables should not use the `NEXT_PUBLIC_` prefix and are only available in server components or route handlers.

## Scripts (from package.json)

Common scripts expected in [package.json](/Users/mdsahil/Documents/email-span/frontend/package.json):
- `dev` — start the Next.js dev server
- `build` — compile the production build
- `start` — run the compiled production server
- `lint` — run ESLint using [eslint.config.mjs](/Users/mdsahil/Documents/email-span/frontend/eslint.config.mjs)

Run any script with:
```bash
npm run <script>
```

## Configuration

- Next.js config: [next.config.ts](/Users/mdsahil/Documents/email-span/frontend/next.config.ts)
  - Typical uses: image domains, redirects/rewrites, headers, experimental flags.
- TypeScript config: [tsconfig.json](/Users/mdsahil/Documents/email-span/frontend/tsconfig.json)
  - Controls compiler options and path aliases (if defined).
- ESLint config: [eslint.config.mjs](/Users/mdsahil/Documents/email-span/frontend/eslint.config.mjs)
  - Centralized linter rules.

## Development Notes

- This project uses the App Router (the `app/` directory).
- Pages and components can be Server Components by default; mark Client Components with `"use client"` at the top of the file if you need browser-only APIs or stateful hooks.
- Place shared UI in `components/` and shared logic in `lib/` for reuse.

## Building and Deployment

- Production build:
  ```bash
  npm run build
  npm run start
  ```
- Deploy on any Node.js host by running the production server, or use Vercel for zero‑config deployments.
- Ensure all required environment variables are set in the host environment (mirror what you use in [.env.local](/Users/mdsahil/Documents/email-span/frontend/.env.local), without committing secrets).

## Troubleshooting

- Port already in use: stop the existing process or change the port, e.g. `PORT=3001 npm run dev`.
- Stale build artifacts: remove `.next/` and rebuild.
- Env not picked up: restart the dev server after editing [.env.local](/Users/mdsahil/Documents/email-span/frontend/.env.local).

## Learn More

- Next.js docs: https://nextjs.org/docs
- App Router overview: https://nextjs.org/docs/app
