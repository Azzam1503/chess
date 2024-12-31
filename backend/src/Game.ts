import { WebSocket } from "ws";
import {Chess} from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game{
    public player1: WebSocket;
    public player2: WebSocket;
    private board: Chess; 
    private moves: string[];
    private startTime: Date;
    private moveCount;

    constructor(player1: WebSocket, player2: WebSocket){
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.moves = [];
        this.startTime = new Date();
        this.moveCount = 0;
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload:{
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload:{
                color: "black"
            }
        }));
    };
    
    makeMove(socket: WebSocket, move: {
        from: string,
        to: string
    }){
        console.log("First here----------------");
        //validate the type of move using zod
        if(this.moveCount % 2 === 0 && socket !== this.player1){
            return;
        };
        if(this.moveCount % 2 !== 0 && socket !== this.player2){
            return;
        };
        
        try {
            const curr = this.board.move(move);
            console.log(curr);
            this.moveCount++;
        } catch (error) {
            console.log("error int board.move", error);    
        }
        
        console.log("Second here----------------");
        if(this.board.isGameOver()){
            this.player1.emit(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            
            this.player2.emit(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            return;
        };
        console.log("-------------");
        console.log(move);
        
        if(this.moveCount % 2 === 0){
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        }else{
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        }
        
        
        
        console.log("last here----------------");
    }
}
