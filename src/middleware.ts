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
import type * as types from './Types';
import * as express from 'express';
import url from 'url';
import { Emitter } from './Utils/Emitter';

export class Middleware {
    private static worker: Worker;
    private static userList: types.UserList[] = [];
    private static pendingRequests: Array<(data: types.UserList[]) => void> = [];

    constructor() {
        // Initialize the worker
        if (!Middleware.worker) {
            Middleware.worker = new Worker(new URL('./Workers/JudgeWorker.ts', import.meta.url).href);

            // Global error handling for the worker
            Middleware.worker.onerror = (err: ErrorEvent) => {
                console.error('Worker error:', err.message);
            };

            // Setup listener for worker messages
            Middleware.worker.onmessage = (e: MessageEvent) => {
                const [status, result] = e.data;

                if (status === 'Finished') {
                    Middleware.userList = result as types.UserList[];
                    // Notify all pending requests
                    Middleware.pendingRequests.forEach(callback => callback(Middleware.userList));
                    Middleware.pendingRequests = [];
                } else {
                    console.error('Worker returned an unexpected response:', e.data);
                }
            };
        }

        // Setup listener for the 'Judged' event
        Emitter.on('Judged', () => {
            console.log('The judging process has finished. Data updated.');
        });
    }

    public async handle(req: express.Request, res: express.Response){
        const requestedUrl = String(url.parse(req.url)?.pathname);

        switch (requestedUrl) {
            case '/Online': {
                if (global.API_Error !== null){
                    return res.status(500).json(
                        {
                            "content-type": "application/json",
                            "error": 500,
                            "message": "Internal Server Error, unable to reach server API",
                        }
                    )
                }
                if (Middleware.userList.length === 0) {
                    
                    Middleware.pendingRequests.push((userList: types.UserList[]) => {
                        if (!res.headersSent) {
                            res.status(200).json({
                                "content-type": "application/json",
                                "error": null,
                                "message": "Operation finished successfully",
                                "lastUpdate": global.lastUpdate,
                                "userList": userList
                            });
                        }
                    });

                    Middleware.worker.postMessage({ message: 'Start' });
                } else {
                    if (!res.headersSent) {
                        res.status(200).json({
                            "content-type": "application/json",
                            "error": null,
                            "message": "Operation finished successfully",
                            "lastUpdate": global.lastUpdate,
                            "userList": Middleware.userList
                        });
                    }
                }
                break;
            }
            default: {
                if (!res.headersSent) {
                    res.status(404).json({
                        "content-type": "application/json",
                        "error": "Not Found",
                        "message": "The endpoint you have requested cannot be found",
                    });
                }
                break;
            }
        }
    }

}

