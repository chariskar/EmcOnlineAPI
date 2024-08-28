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
import type * as types from '../Types';
import { Emitter } from './Emitter';

export class Fetch {
    public static UserList: types.UserList[] = [];
    
    constructor() {
        // Set up the event listener only once
        Emitter.on('Judged', this.handleJudgedEvent);
    }

    private handleJudgedEvent() {
        try {
            Fetch.FetchUserList().then(
                async (data)=>{
                    Fetch.UserList = data
                }
            )
        } catch (error) {
            console.error('Error handling judged event:', error);
        }
    }

    /**
     * This fetches all of the users, not their data.
     */
    public static async FetchUserList(): Promise<types.UserList[]> {
        try {
            const response = await fetch('https://api.earthmc.net/v3/aurora/players',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
                });
            
            if (!response.ok) {
                console.error('API response error:', response.status);
                Emitter.emit('API error')
                Emitter.emittedEvents.add('API error')
                return [];
            }

            // Check if the response is in JSON format
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json() as types.UserList[];
                console.log('User List Finished');
                Emitter.emit('User List Finished Fetching');
                return data;
            } else {
                console.error('Expected JSON but got:', contentType);
                return [];
            }
        } catch (error) {
            console.error('Unable to reach API:', error);
            return [];
        }
    }

    /**
     * Fetches detailed data for each user.
     */
    public FetchUserData(): void {
        const chunkSize = 100;

        if (Fetch.UserList.length === 0) {
            console.error('User List is empty');
            return;
        }

        try {
            const worker = new Worker(new URL('../Workers/FetchWorker.ts', import.meta.url).href);
            worker.postMessage([Fetch.UserList, chunkSize]);
            
            worker.onmessage = (e: MessageEvent) => {
                const data = e.data as types.Player[];
                return data
            };

            worker.onerror = (error) => {
                console.error("Error fetching user data:", error);
                Emitter.emit('API error');
                global.API_Error = error.error
            };
        } catch (error) {
            console.error("Error creating worker:", error);
        }
    }
}
