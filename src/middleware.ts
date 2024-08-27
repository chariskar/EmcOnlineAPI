import type * as types from './Types'
import * as express from 'express'
import url from 'url'

export class Middleware{
    private static worker: Worker
    constructor(){
        Middleware.worker = new Worker(new URL('./Workers/JudgeWorker.ts', import.meta.url).href);
    }

    public async handle(req: express.Request, res: express.Response){
        const requestedUrl = String(url.parse(req.url)?.pathname)
        switch (requestedUrl){
            case '/Online': {
                if (!Middleware.worker){
                    console.log('Worker is undefined')
                }
                
                Middleware.worker.onmessage = (e: MessageEvent) => {
                    const data = e.data as types.UserList
                    return res.status(200).json({
                        "content-type": "application/json",
                        "error": null,
                        "message": "Operation finished successfuly",
                        

                    }).send(data)
                }
                break
            }
            default: {
                res.status(404).json(
                    {
                        "content-type": "application/json",
                        "error": "Not Found",
                        "message": "The endpoint you have requested can not be found"
                    }
                )
            }
        }
    }
}