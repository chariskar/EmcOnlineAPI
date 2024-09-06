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

export class Middleware {
    private worker: Worker;
    private static isFetching: boolean = false;
    private static minFetchDelay: number = 60_000; 
    private static errorBackoffDelay: number = 300_000; 

    constructor() {
        this.worker = new Worker(new URL('../src/Workers/JudgeWorker.ts', import.meta.url).href);
        this.startFetchingLoop();
    }

    private async fetchAndUpdate() {
        if (Middleware.isFetching) {
            console.log("Fetch already in progress. Skipping this request.");
            return;
        }

        console.log("Fetching new data...");
        Middleware.isFetching = true;

        try {
            await new Promise<void>((resolve, reject) => {
                if (!global.fetched || global.fetched.length === 0) {
                    console.log("User list is empty. Fetching user list...");
                    this.worker.postMessage('');
                } else {
                    console.log("User list already exists. Skipping fetch.");
                    Middleware.isFetching = false;
                    return;
                }

                this.worker.onmessage = (e: MessageEvent) => {
                    const userList: types.UserList[] = e.data;
                    if (userList && userList.length > 0) {
                        global.OnlineUsers = userList;
                        global.lastUpdate = Date.now();
                        console.log('Online users updated:', global.OnlineUsers.length);
                        setTimeout(() => {
                            this.fetchAndUpdate();

                        }, Middleware.minFetchDelay); 
                    } else if (global.error){
                        setTimeout(() => {
                            this.fetchAndUpdate();
                        }, Middleware.errorBackoffDelay);
                    }else {
                        setTimeout(() => {
                            this.fetchAndUpdate();
                        }, Middleware.errorBackoffDelay);
                    }
                    Middleware.isFetching = false;
                    resolve();
                };

                this.worker.onerror = (error) => {
                    console.error('Worker error:', error);
                    Middleware.isFetching = false;
                    setTimeout(() => {
                        this.fetchAndUpdate();
                    }, Middleware.errorBackoffDelay); 
                    reject(error);
                };
            });
        } catch (error) {
            console.error('Fetch failed:', error);
            Middleware.isFetching = false;
            setTimeout(() => {
                this.fetchAndUpdate();
            }, Middleware.errorBackoffDelay); 
        }
    }

    private startFetchingLoop() {
        this.fetchAndUpdate(); 
    }

    public async handle(req: express.Request, res: express.Response) {
        if (req.path === '/Online') {
            res.status(200).json({
                "OnlineUsers": global.OnlineUsers || [],
                "lastUpdate": global.lastUpdate || null,
                "OnlineUsersNum": global.OnlineUsers?.length || 0,
            });
            
        } else {
            res.status(404).send('Not Found');
        }
    }
}
