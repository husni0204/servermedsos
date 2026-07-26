# server-medsos — agent instructions

## Stack
- Express 5 (ESM, `"type": "module"`) + Prisma 6 (postgresql) + JWT auth
- Image hosting: Cloudinary (upload via multer memoryStorage → base64)
- Validation: Zod (v4.x — uses `z.email()` not `z.string().email()`)

## Commands
| Command | What it does |
|---|---|
| `yarn dev` | Start dev server with `node --watch src/server.js` on port 3000 |
| `npx prisma generate` | Regenerate Prisma client after schema changes |
| `npx prisma migrate dev` | Apply schema migrations |

No test/lint/typecheck scripts exist — do not rely on them.

## Project structure
```
src/
├── server.js              # Entrypoint — mounts all routers
├── prismadb/prisma.js     # Singleton PrismaClient instance
├── middleware/
│   ├── auth.middleware.js # JWT verification (`Authorization: Bearer <token>`)
│   └── upload.middleware.js # Multer (memoryStorage, .jpg/.jpeg/.png only)
├── routes/                # 7 routers: auth, user, follow, feed, comment, like, bookmark
├── controller/            # One file per router
└── utils/cloudinary.js    # Cloudinary config (CLOUDNAME/CLOUDKEY/CLOUDPASSWORD from .env)
```

## API overview (all routes documented in `auth.http`)
- `POST /api/auth/register` — register (fullname≥6, username≥6, email, password≥8)
- `POST /api/auth/login` — login (email+password → JWT, expires 1d)
- `GET /api/auth/me` — current user (auth required)
- `GET /api/user/:username` — public profile (includes posts + bookmarks)
- `GET /api/user/search?username=` — search users (case-insensitive contains)
- `PUT /api/user/update-user` — update bio/fullname/username (Zod validated, auth required)
- `PUT /api/user/update-photo-profile` — upload avatar (multipart, auth required)
- `POST /api/follow` — follow user (`{ followUserId }` body)
- `DELETE /api/follow/:unfollowUserId` — unfollow
- `GET /api/follow/user` — 5 suggested users not yet followed
- `GET /api/follow/:followUserId` — check if following (returns `{ data: true/false }`)
- `POST /api/feed` — create post (multipart: image + caption, auth required)
- `GET /api/feed?page=&limit=` — paginated feed from followers + self (default limit=3)
- `GET /api/feed/:id` — post detail with comments
- `DELETE /api/feed/:id` — delete own post (owner check, also deletes from Cloudinary)
- `POST /api/comment` — create comment (`{ postId, content }`)
- `DELETE /api/comment/:id` — delete own comment
- `POST /api/like/:postId` — toggle like
- `GET /api/like/:postId` — check if liked (`{ data: true/false }`)
- `POST /api/bookmark/:postId` — toggle bookmark
- `GET /api/bookmark/:postId` — check if bookmarked (`{ data: true/false }`)

## Key conventions
- **Auth middleware**: `AuthMiddleware` on all protected routes. Reads `Authorization: Bearer <token>`, verifies JWT, attaches `req.user`. JWT payload: `{ id }`.
- **Error messages**: Mix of Indonesian and English. 500 errors are consistently `"Servernya ngambek coy"`. Match the surrounding controller style.
- **Validation**: Zod in auth & user controllers only. Feed/comment/follow/like/bookmark controllers use manual checks.
- **Counters**: `postCount`, `followingCount`, `followerCount`, `likeCount`, `commentCount` are maintained manually via `increment`/`decrement` — not Prisma triggers.
- **Image upload**: Buffer → base64 data URI → Cloudinary. Feed images → `feeds/`, avatars → `avatar/`. Old `imageId` is destroyed on Cloudinary before upload.
- **Route param style**: `followUserId` in body (POST) vs `unfollowUserId`/`followUserId` in params (DELETE/GET) — match existing per-controller pattern.
- **Follow model semantics (gotcha)**: In the `Follow` model, `followerId` stores the person **being followed**, `followingId` stores the **follower** doing the following. This is inverted from what the field names suggest.

## Prisma
- Generator: `prisma-client-js` (not `prisma-client`)
- Config: `prisma.config.ts` loads `dotenv/config` automatically
- VS Code: `"prisma.pinToPrisma6": true` in `.vscode/settings.json`
- Generated client: default location (gitignored `/src/generated/prisma` is commented out in schema)
- Models: User, Post, Comment, Bookmark, Likes, Follow (composite PKs on Bookmark/Likes/Follow)
- Schema at `prisma/schema.prisma`

## Response

- Gunakan Bahasa Indonesia dan berikan emoticon