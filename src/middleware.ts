/*
   Copyright (C) 2024  chariskar

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see http://www.gnu.org/licenses/.  
*/
import type * as types from './Types/Types';
import * as express from 'express';
import { URL } from 'url';
import { Fetch } from './Utils/Fetch';

export class Middleware {
    private worker: Worker;
    private static fetchInterval: number = 240_000; // 4 minutes in milliseconds

    constructor(){
        this.worker = new Worker(new URL('../src/Workers/JudgeWorker.ts', import.meta.url).href);
        this.runLoop()
    }
    private async update() {
        const lastUpdate: null | number = global.lastUpdate;
        
        
        if (!lastUpdate || Date.now() - lastUpdate >= Middleware.fetchInterval) {
    
            await new Promise<void>((resolve, reject) => {
                this.worker.postMessage('');
    
                this.worker.onmessage = (e: MessageEvent) => {
                    const userList: types.UserList[] = e.data;
                    global.OnlineUsers = userList;
                    global.lastUpdate = Date.now(); 
                    resolve();  
                };
    
                this.worker.onerror = (error) => {
                    reject(error); 
                };
            });
        }
    }
    
    private async runLoop(){
        while (true){
            await this.update()
            await Promise.resolve(new Promise(resolve => setTimeout(resolve, Middleware.fetchInterval)))
            
        }
    }

    public async handle(req: express.Request, res: express.Response){
        if (req.path == '/Online'){
            return res.status(200).json(
                {
                    "OnlineUsers": global.OnlineUsers,
                    "lastUpdate": global.lastUpdate,
                    "OnlineUsersNum": global.OnlineUsers?.length
                },
            )
        } else {
            return res.status(404)
        }
    }
    
}
