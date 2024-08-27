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
import { isEnumMember } from 'typescript';
import type * as types from '../Types';
import { Emitter } from './Emitter';

export class Fetch {
    public static UserList: types.UserList[] = [];

    constructor() {
        console.log('Started')
        Emitter.on(
            'Finished',
            () => {
                this.FetchUserList().then(data => {
                    Fetch.UserList = data;
                    this.FetchUserData()
                }).catch(error => {
                    console.error("Error fetching user list:", error);
                });
            }
        )
    }

    /**
     * This fetches all of the users, not their data.
     */
    public async FetchUserList(): Promise<types.UserList[]> {
        try {
            const response = await fetch('https://api.earthmc.net/v3/aurora/players');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json() as types.UserList[];
            console.log('User List Finished')
            return data;
        } catch (error) {
            console.error('Unable to reach API:', error);
            return [];
        }
    }

    /**
     * Fetches detailed data for each user.
     */
    public async FetchUserData(): Promise<types.Player[]> {
        const chunkSize = 100;
        const playerData: types.Player[] = [];
        Emitter.emit('Started Fetching')
        try {
            for (let i = 0; i < Fetch.UserList.length; i += chunkSize) {
                const userBatch = Fetch.UserList.slice(i, i + chunkSize);

                const requests = userBatch.map(user =>
                    fetch(`https://api.earthmc.net/v3/aurora/players/${user.name}`).then(res => res.json())
                );

                const responses = await Promise.all(requests);
                playerData.push(...responses as types.Player[]);
            }
            console.log('Player Data finished')
    
            return playerData;
        } catch (error) {
            console.error("Error fetching user data:", error);
            return [];
        }
    }
}
