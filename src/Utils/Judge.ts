/*
 * This file is part of the EmcOnlineAPI project.
 *
 * RTC is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * RTC is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with EmcOnlineAPI.  If not, see <http://www.gnu.org/licenses/>.
*/
import { Emitter } from "./Emitter";
import type * as types from '../Types'

const FetchWorker = new Worker(new URL('../Workers/FetchWorker.ts', import.meta.url).href);

export class Judge {
    public static onlinePlayers: types.UserList[]
    constructor() {
        Emitter.on('Started Fetching',() => {
            FetchWorker.onmessage = (e: MessageEvent) => {
                const data = e.data as types.Player[]
                
                for (let i in data){
                    if (data[i].status.isOnline){
                        const player: types.UserList = {
                            name: data[i].name,
                            uuid: data[i].uuid
                        }
                        Judge.onlinePlayers.push(player)
                    }
                    Number(i) + 1
                }
    
                console.log('Judged')
                Emitter.emit('Finished')
    
            }
        })
    }
}
