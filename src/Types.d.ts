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
export declare interface UserList{
    name: string;
    uuid: string;
}

export declare interface Player{
	name: string;
	uuid: string;
	title: string | null;
	surname: string | null;
	formattedName: string;
	about: string | null;
	town: {
	  	name: string | null;
	  	uuid: string | null;
	} | null;
	nation: {
		name: string | null;
		uuid: string | null;
	} | null;
	timestamps: {
		registered: number;
		joinedTownAt: number | null;
		lastOnline: number | null;
	};
	status: {
		isOnline: boolean;
		isNPC: boolean;
		isMayor: boolean;
		isKing: boolean;
		hasTown: boolean;
		hasNation: boolean;
	};
	stats: {
		balance: number;
		numFriends: number;
	};
	perms: {
		build: boolean[];
		destroy: boolean[];
		switch: boolean[];
		itemUse: boolean[];
		flags: {
	    	pvp: boolean;
	    	explosion: boolean;
	    	fire: boolean;
	    	mobs: boolean;
	  };
	};
	ranks: {
		townRanks: string[];
		nationRanks: string[];
	};
	friends: {
		name: string;
		uuid: string;
	}[];
  };
  
declare global{
	var API_Error: number | null
}