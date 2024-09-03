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
import type * as types from '../Types/Types'
import { Fetch } from "./Fetch";

export class Judge {
    public onlinePlayers: types.UserList[]
    constructor() {
        this.onlinePlayers = []
        if(!global.fetched){
            new Fetch().FetchUserData().then(
                (data)=>{
                    if (data)
                    this.Judge(data)
                }
            )
            

        } else {
            this.Judge(global.fetched)
        }           
        
    }
    private Judge(data: types.TemplateReturn[]){
        for (let i in data as types.TemplateReturn[]){
            if (data){
                if (data[Number(i)].status.isOnline){
                
                    const player: types.UserList = {
                        name: data[Number(i)].name,
                        uuid: data[Number(i)].uuid
                    }
                    if (!this.onlinePlayers){
                        return
                    }
                    this.onlinePlayers.push(player)
                    
                    delete data[Number(i)]
                }
                Number(i)+1
            }
        }
    }
}
