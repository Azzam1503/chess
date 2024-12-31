import { GameManager } from './GameManager';
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({port: 8080});

const gameManager = new GameManager();

wss.on("connection", (socket) =>{
    gameManager.addUser(socket);
    socket.on("error", console.error);

   socket.on("message", function(currMessage){
    console.log(currMessage.toString());
   });

   socket.on("disconnect", () => gameManager.removeUser(socket));

   socket.send('something');
})
