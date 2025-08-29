# Commently (Next.js + Tailwind + Socket.IO)

A colorful, modern frontend for your NestJS comment system.

## Quickstart

1. Copy `.env.local.example` to `.env.local` and set:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```
(Use the port where your Nest backend runs.)

2. Install & run:
```bash
npm install
npm run dev
```

## Features
- JWT auth (login, signup, logout)
- Follow/unfollow
- Comments with replies and likes
- Real-time updates (Socket.IO) for comments, likes, followers, unread count
- Notifications (read, read all, delete)
- Profile management (upload picture)
- Light/Dark mode
- Fully responsive UI
