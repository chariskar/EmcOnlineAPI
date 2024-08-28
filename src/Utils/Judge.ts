/*
 * This file is part of the EmcOnlineAPI project.
 *
 * RTC is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * RTC is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with EmcOnlineAPI.  If not, see <http://www.gnu.org/licenses/>.
*/
import { Emitter } from "./Emitter";
import type * as types from '../Types'
import { Fetch } from "./Fetch";

export class Judge {
    public onlinePlayers: types.UserList[] | null
    constructor() {
        this.onlinePlayers = []
        const fetch = new Fetch()
        let data = fetch.FetchUserData() as unknown as types.Player[]
        
        
        for (let i in data as types.Player[]){
            if (data){
                if (data[Number(i)].status.isOnline){
                
                    const player: types.UserList = {
                        name: data[Number(i)].name,
                        uuid: data[Number(i)].uuid
                    }
                    this.onlinePlayers.push(player)
                    delete data[Number(i)]
                }
                Number(i)+1
            }
            
        }
        Emitter.emit('Judged')
    }
}
