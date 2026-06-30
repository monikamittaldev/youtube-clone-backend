# 🎬 YouTube Clone Backend API

> RESTful API for a YouTube Clone built with Node.js, Express.js, MongoDB Atlas, JWT Authentication, and Multer for file uploads.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![ES Modules](https://img.shields.io/badge/Modules-ES%20Modules-yellow)

---

## 📁 Folder Structure

```
youtube-clone-backend/
├── server.js                    ← Express app entry point
├── seed.js                      ← Database seeder (12 sample videos)
├── package.json                 ← Dependencies + "type": "module"
├── .env.example                 ← Environment variable template
├── .gitignore
│
├── models/
│   ├── user.model.js            ← User schema with bcrypt hashing
│   ├── video.model.js           ← Video schema with embedded comments
│   └── channel.model.js         ← Channel schema (1 per user)
│
├── controllers/
│   ├── auth.controller.js       ← Register, Login, GetMe
│   ├── video.controller.js      ← Video CRUD + like/dislike
│   ├── channel.controller.js    ← Channel create/get/update
│   └── comment.controller.js    ← Add/edit/delete comments
│
├── routes/
│   ├── auth.routes.js
│   ├── video.routes.js
│   ├── channel.routes.js
│   └── comment.routes.js
│
├── middleware/
│   ├── authMiddleware.js        ← JWT authentication middleware
│   └── upload.js                ← Multer configuration for file uploads
│
└── uploads/
    └── avatars/                 ← Uploaded user & channel avatars
```

---

## ⚙️ Tech Stack

| Package | Purpose |
|---------|---------|
| express | Web framework and routing |
| mongoose | MongoDB ODM and schema validation |
| jsonwebtoken | JWT token generation and verification |
| bcryptjs | Password hashing |
| multer | Handles avatar image uploads |
| dotenv | Environment variable management |
| cors | Cross-origin resource sharing |
| nodemon | Auto-restart during development |

---

## 📁 File Uploads

This project uses **Multer** middleware to handle `multipart/form-data` uploads.

Supported uploads include:

- User avatar during registration
- Channel avatar during channel creation
- Channel avatar updates

Uploaded files are stored locally inside the `uploads/` directory.

---

## 🚀 Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/monikamittal-1728/youtube-clone-backend
cd youtube-clone-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create .env file

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/youtube-clone?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
```

### 4. Seed the database

```bash
node seed.js
```

**Test credentials after seeding:**

| Field | Value |
|-------|-------|
| Email | monika@example.com |
| Password | monika123 |

### 5. Start the server

```bash
# Development
npm run dev

# Production
npm start
```

> Server runs at **http://localhost:5000**

---

## 📡 API Endpoints

### 🔐 Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user with avatar upload |
| POST | `/api/auth/login` | Public | Login and get JWT token |
| GET | `/api/auth/me` | Protected | Get current user |

### 🎬 Videos — `/api/videos`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/videos` | Public | Get all videos (`?search=` or `?category=`) |
| GET | `/api/videos/:id` | Public | Get single video (increments views) |
| POST | `/api/videos` | Protected | Upload new video |
| PUT | `/api/videos/:id` | Protected | Update video (owner only) |
| DELETE | `/api/videos/:id` | Protected | Delete video (owner only) |
| POST | `/api/videos/:id/like` | Protected | Toggle like |
| POST | `/api/videos/:id/dislike` | Protected | Toggle dislike |

### 📺 Channels — `/api/channel`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/channel` | Protected | Create channel with avatar upload |
| GET | `/api/channel/:id` | Public | Get channel with videos |
| PUT | `/api/channel/:id` | Protected | Update channel details and avatar |

### 💬 Comments — `/api/comments`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/comments/:videoId` | Protected | Add comment |
| PUT | `/api/comments/:videoId/:commentId` | Protected | Edit comment (owner only) |
| DELETE | `/api/comments/:videoId/:commentId` | Protected | Delete comment (owner only) |

---

## 📝 Request Examples

### Register

```text
POST /api/auth/register
Content-Type: multipart/form-data

username: Monika
email: monika@example.com
password: monika123
avatar: profile.jpg
```

### Login

```json
POST /api/auth/login
{
  "email": "monika@example.com",
  "password": "monika123"
}
```

### Upload Video

```json
POST /api/videos
Authorization: Bearer <token>

{
  "title": "React Hooks Tutorial",
  "description": "Learn useState and useEffect",
  "videoUrl": "https://www.youtube.com/watch?v=Tn6-PIqc4UM",
  "thumbnailUrl": "https://img.youtube.com/vi/Tn6-PIqc4UM/hqdefault.jpg",
  "channelId": "<your channel id>",
  "category": "React"
}
```

### Add Comment

```json
POST /api/comments/:videoId
Authorization: Bearer <token>

{
  "text": "Amazing tutorial!"
}
```

---

## 🗄️ Database Models

### User

| Field | Type | Details |
|-------|------|---------|
| username | String | Required, unique, min 5 chars |
| email | String | Required, unique, validated |
| password | String | Required, bcrypt hashed |
| avatar | String | Optional |
| channel | ObjectId | Ref to Channel |

### Video

| Field | Type | Details |
|-------|------|---------|
| title | String | Required |
| videoUrl | String | Required — YouTube URL |
| thumbnailUrl | String | Optional |
| channelId | ObjectId | Ref to Channel |
| uploader | ObjectId | Ref to User |
| category | String | Enum — 14 categories |
| views | Number | Auto-increments on GET |
| likes | [ObjectId] | Array of User IDs |
| dislikes | [ObjectId] | Array of User IDs |
| comments | [SubDoc] | Embedded comments |

### Channel

| Field | Type | Details |
|-------|------|---------|
| channelName | String | Required |
| handle | String | Unique, auto-generated |
| description | String | Optional |
| channelAvatar | String | Optional |
| owner | ObjectId | Unique — 1 channel per user |
| videos | [ObjectId] | Array of Video IDs |

---

## 🎯 Supported Video Categories

`All` `Web Development` `JavaScript` `React` `Node.js` `Data Structures` `Python` `CSS` `Database` `DevOps` `Music` `Gaming` `News` `Sports`

---

## 🔒 Security

- Passwords hashed with **bcryptjs** (12 salt rounds)
- JWT tokens expire after **7 days**
- All protected routes require a valid JWT token
- Ownership verified before update/delete operations
- Avatar uploads handled securely using **Multer**
- `.env` never committed to GitHub

---

## 📜 Scripts

```bash
npm run dev     # Development with nodemon
npm start       # Production
node seed.js    # Seed database
```

---

*Built with ❤️ by Monika — Internshala Full Stack Web Development Capstone Project*