# ChatNest Real-Time Chat Backend

Backend API and WebSocket server built with **Node.js**, **Express.js**, **Socket.io**, and **MongoDB (Mongoose)**.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables (.env)
The `.env` file is located in the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/chatnest
JWT_SECRET=chatnest_jwt_secret_key_super_secure_2026
CLIENT_URL=http://localhost:5173
```

> **Note on MongoDB**:
> - If you have MongoDB installed locally, ensure the MongoDB service is running.
> - If using **MongoDB Atlas** (cloud), replace `MONGO_URI` with your connection string:
>   `mongodb+srv://<username>:<password>@cluster0.mongodb.net/chatnest?retryWrites=true&w=majority`

### 3. Run Backend Server
- **Development (with hot reload)**:
  ```bash
  npm run dev
  ```
- **Production / Normal**:
  ```bash
  npm start
  ```

---

## 📡 API Endpoints

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login user & return JWT | ❌ |
| `GET` | `/api/auth/me` | Get current logged-in profile | ✅ |

### 👥 Users (`/api/users`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/users` | Get all users for sidebar with last message & unread badge | ✅ |

### 💬 Messages (`/api/messages`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/messages/:id` | Fetch conversation history with a user | ✅ |
| `POST` | `/api/messages/send/:id` | Send a message to a user | ✅ |

---

## ⚡ Socket.io Real-Time Events

- **Connection**: Pass query `userId` on handshake (`io(SOCKET_URL, { query: { userId } })`).
- `getOnlineUsers`: Broadcasts an array of all currently active/online user IDs.
- `newMessage`: Dispatches incoming messages instantly to recipient.
- `typing`: Notifies recipient that user is typing.
- `stopTyping`: Notifies recipient that user stopped typing.
