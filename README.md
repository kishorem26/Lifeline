# Lifeline: Life & Health Dashboard

React 19 + TypeScript + Vite, Tailwind CSS v4, Framer Motion, Zustand, TanStack Query, Recharts, date-fns, Zod.

## Run

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## What works now

- **Home**: score ring, mood picker, quick-add, colorful metric cards (sample data for now)
- **Habits**: real calendar months, add / rename / recolor / delete habits, tap days to log, live stats and chart
  (saved in your browser's localStorage until Supabase arrives in Step 4)

## Next steps

Copy `.env.example` to `.env.local` and fill in your Supabase keys before Step 2.
Never commit `.env.local`.
