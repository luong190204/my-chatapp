# 💬 Real-Time ChatApp

A full-stack real-time chat application built with **React**, **Spring Boot**, and **STOMP/WebSocket**, featuring:

- ✅ Real-time messaging
- 😊 Emoji support
- 🖼 Image sending
- 🧑‍🤝‍🧑 Join/Leave notifications
- 🔐 Simple username login
- 🎨 Responsive UI with TailwindCSS

---

## 🚀 Tech Stack

### Frontend
- ⚛️ React + TypeScript
- 💨 TailwindCSS
- 🌐 STOMP.js (WebSocket client)
- 😊 emoji-picker-react

### Backend
- ☕ Spring Boot
- 🔧 Spring WebSocket (STOMP)
- 🧠 Java 17+

---

## 📸 Features

- 🔁 Real-time bi-directional chat via STOMP over WebSocket
- 🧑‍💬 Username join/leave tracking
- 😍 Emoji Picker embedded inside input box
- 🖼 Upload and send image messages (base64-encoded)
- 📅 Timestamp for each message
- 📦 Auto scroll to latest message
- 🖥️ Responsive layout with custom icons

---

## 🧪 How to Run

### Backend (Spring Boot)
```bash
cd chatapp_backend
./mvnw spring-boot:run
```

> Runs on `https://my-chatapp-d4lg.onrender.com`

### Frontend (React)
```bash
cd chatapp_frontend
npm install
npm start
```

> Runs on `http://localhost:3000`

---

## 📂 Project Structure

```
chatapp/
├── chatapp_backend/       # Spring Boot backend
│   ├── model/             # ChatMessage.java
│   ├── controller/        # ChatController.java (MessageMapping / SendTo)
│   └── config/            # WebSocket config
│
└── chatapp_frontend/      # React frontend
    ├── components/
    │   ├── Chat.tsx       # Main chat logic
    │   ├── Message.tsx    # Message UI (text/image)
    └── assets/            # Optional icons/images
    
```

---

## 📥 Image Upload

- Uploads are encoded as base64 and sent as message content
- Preview is shown before sending
- Reset input after sending image

---

## 😊 Emoji Support

- Click emoji icon inside the input to open picker
- Select emoji to append to message text
- Click outside to auto-close picker

---

## 🧠 Future Ideas

- 🧾 Chat history (store messages)
- 👥 Private rooms / group chats
- 🔒 Auth with token
- ☁️ Upload images to cloud instead of base64

---

## 🤝 Contributing

PRs welcome. Bug reports too. Emoji support mandatory 😄.

---

## 🔗 Live Demo

> Coming soon (Deploy with Netlify + Render)

---

## 📄 License

MIT © [luong190204]