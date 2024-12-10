import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [socket, setSocket] = useState(null);
  const [latestMessage, setLastestMessage] = useState("");
  const [sendMessage, setSendMessage] = useState("");
  useEffect(() => {
    const socket = new WebSocket("http://localhost:2000");
    socket.onopen = (data) => {
      console.log("Connected");
      setSocket(socket);
    };
    
    socket.onmessage = (message) =>{
      console.log(message);
      console.log("Receivd message", message.data);
      setLastestMessage(message.data);
    } 

  },[]);

  if(!socket){
    return <div>
      Loading...
    </div>
  }
  return (
    <>
      Connected to Socket
      <br />
      <input type='text' onChange={(e) => setSendMessage(e.target.value)} />
      <button onClick={() => {
        socket.send(sendMessage)
      }}>Send Message</button>
      <br />
      {latestMessage}
    </>
  )
}

export default App
