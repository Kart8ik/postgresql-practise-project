## Anime Tracker (Supabase + Postgres Practice)

A small, fun practice project to learn Postgres using Supabase. Track your anime list, experiment with database schemas and RLS, and practice building a React + TypeScript app.

the styling is very basic cus that wasn't the focus here (might come back to fix it tho)

### Stack
- React + TypeScript + Vite
- Supabase (Auth, Postgres, RLS)
- Tailwind CSS (with Radix UI primitives (basically ShadCN))
- Sonner (toasts)
- React Router

### Features
- Email/password auth via Supabase
- Public users table mirrored from `auth.users` (via app logic) with RLS
- Add/remove anime with fields: title, genre, status, personal rating
- Minimal client-side validation (required fields, rating 0–10)
- Dashboard and Leaderboard pages
- Toast feedback for common actions

### Database (suggested)
You can adapt this to your needs, but the app assumes something like:

```sql
-- public.users
user_id uuid primary key references auth.users(id) on delete cascade,
username text not null

-- public.anime_list
id uuid primary key default gen_random_uuid(),
user_id uuid not null references auth.users(id) on delete cascade,
title text not null,
genre text not null,
personal_rating int not null check (personal_rating between 0 and 10),
status text not null,
created_at timestamptz not null default now()
```

RLS (example):
- Enable RLS on both tables.
- `public.users`: insert/select/update/delete where `auth.uid() = user_id`.
- `public.anime_list`: all operations where `auth.uid() = user_id`.

### How the mirror works
- On sign-up, the app waits for an authenticated session (or the subsequent sign-in event) and upserts a row into `public.users` with `user_id` and `username`.

### Setup
1) Create a Supabase project and get your URL and anon key.
2) Create tables and RLS policies (example above).
3) Copy env and run the dev server.

Env vars (create `.env.local`):
```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Scripts
```bash
npm install       # install deps
npm run dev       # start dev server
npm run build     # type-check and build
npm run preview   # preview production build
```

### Notes
- Toaster is mounted in `src/App.tsx`.
- Auth context is provided by `src/Context.tsx`.
- Client-side validation is minimal by design to keep focus on Postgres/Supabase learning.

### Folder highlights
- `src/pages/login.tsx`: sign up / sign in and user mirroring logic
- `src/pages/dashboard.tsx`: fetch and display your anime, upsert user at mount
- `src/components/anime-form.tsx`: validated form to add anime
- `src/components/anime-card.tsx`: delete anime items

---

This project is intentionally lightweight so I could iterate quickly and focus on learning Postgres, RLS, and Supabase in a realistic app.
