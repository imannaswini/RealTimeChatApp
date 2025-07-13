💬 Real-Time Chat App
A full-stack real-time chat application that supports:

✅ Group Chat (room-based)

✅ Private One-on-One Messaging

✅ Real-time message delivery using Socket.IO

✅ Emoji Picker 😄

✅ Online user tracking

✅ Message persistence with MongoDB

🚀 Tech Stack
Frontend	Backend	Real-time	Database
React.js	Node.js + Express	Socket.IO	MongoDB

📁 Folder Structure
/backend
  ├── models/
  ├── routes/
  ├── server.js
/frontend
  ├── components/
  ├── pages/
  ├── ChatRoom.js
  ├── App.js
  
🔧 Features
🔒 User Login & Registration

📢 Group Chat via Room ID

🧑‍🤝‍🧑 Private Chat (1:1)

📦 Messages stored in MongoDB

🔔 Notification sound + tab flash

😎 Emoji Picker (emoji-picker-react)


🛠️ Setup Instructions
1. Clone the repository
git clone https://github.com/yourusername/chat-app.git
cd chat-app
2. Backend Setup (/backend)
cd backend
npm install
Create .env file
PORT=5000
MONGO_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=your-secret-key
Start the backend
npm run dev
4. Frontend Setup (/frontend or /client)
cd ../frontend
npm install
Start the frontend
npm start
App will run at: http://localhost:3000

🔄 Socket.IO Events
Group Chat:
join_room
send_message
receive_message

Private Chat:
register_user
send_private_message
receive_private_message


⚠️ Known Issues
Make sure MongoDB is running locally.
Only users with valid login can access chat.
Private chat depends on both users being online.

✨ Future Improvements
Typing indicators
Unread message count
User presence (online/offline)
Media sharing (images/files)
Push notifications


Feel free to contribute !
