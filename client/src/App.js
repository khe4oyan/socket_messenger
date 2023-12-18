import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";

import Message, { messageTypes } from "./components/Message/Message";

const socket = io.connect("http://localhost:3001");

function App() {
  //Room State
  const [room, setRoom] = useState("");

  // Messages States
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState([]);

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  const sendMessage = () => {
    socket.emit("send_message", { message, room });
    setMessageReceived(prev => [...prev, { messageType: messageTypes.ME, message: message }]);
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log('#1', data);
      setMessageReceived(prev => [...prev, { messageType: messageTypes.FRIEND, message: data.message }]);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("joinMessage", (data) => {
      console.log('#1', data);
      setMessageReceived(prev => [...prev, { messageType: messageTypes.JOIN, message: data.message }]);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("leaveMessage", (data) => {
      console.log('#1', data);
      setMessageReceived(prev => [...prev, { messageType: messageTypes.LEAVE, message: data.message }]);
    });
  }, [socket]);

  return (
    <div className="App">
      <div className="inputBox">
        <input
          placeholder="Room Number..."
          onChange={(event) => {
            setRoom(event.target.value);
          }}
        />
        <button onClick={joinRoom}> Join Room</button>
      </div>

      <div className="inputBox">
        <input
          placeholder="Message..."
          onChange={(event) => {
            setMessage(event.target.value);
          }}
        />
        <button onClick={sendMessage}> Send Message</button>
      </div>

      <div className="messages">
        <h1>=====================</h1>
        {
          messageReceived.map((item, i) =>
            <Message
              key={i}
              data={item}
            />
          )
        }
      </div>
    </div>
  );
}

export default App;
