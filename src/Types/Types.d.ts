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
export declare interface UserList{
    name: string;
    uuid: string;
}

export interface TemplateReturn{
	name: string;
	uuid: string;
	status: {
		isOnline: boolean;
		isNPC: boolean;
		isMayor: boolean;
		isKing: boolean;
		hasTown: boolean;
		hasNation: boolean;
	};
}
export interface Template{
	name: booleam = true,
	uuid: boolean = true,
	status: boolean = true,
	query: Array
}
export declare interface request{
	processing: boolean;
	finished: boolean
	error: boolean
}
  
declare global{
	var error: any | null
	var lastUpdate: number | null
	var OnlineUsers: UserList[] | null = null
	var fetched: TemplateReturn[] | null = null
}