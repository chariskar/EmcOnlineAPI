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
import type * as types from '../Types/Types';

export class Fetch {
    private static UserList: types.UserList[] = [];

    constructor() {}

    /**
     * Fetches the list of users (not their detailed data).
     */
    public static async FetchUserList(): Promise<types.UserList[]> {
        try {
            const response = await fetch('https://api.earthmc.net/v3/aurora/players');
    
            if (!response.ok) {
                console.error('API response error:', response.status);
                return [];
            }
    
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
    
                if (!Array.isArray(data)) {
                    console.error('Expected an array but got:', typeof data);
                    return [];
                }
    
                // Check the length of data to handle large responses
                if (JSON.stringify(data).length > 10_000_000) { // Example limit: 10MB
                    console.error('Received data is too large');
                    return [];
                }
    
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
    public async FetchUserData(): Promise<void | types.TemplateReturn[]> {
        const chunkSize = 100;
    
        if (Fetch.UserList.length === 0) {
            console.log("Fetching user list because it's empty.");
            const data = await Fetch.FetchUserList();
            if (data.length === 0) {
                console.error("Failed to fetch UserList.");
                return; 
            }
            Fetch.UserList = data;
        }
        const data = this.startWorker(Fetch.UserList, chunkSize)as unknown as types.TemplateReturn[];
        return data
    }
    
    private startWorker(userList: types.UserList[], chunkSize: number): types.TemplateReturn[]  | void {
        try {
            const worker = new Worker(new URL('../Workers/FetchWorker.ts', import.meta.url).href);
            worker.postMessage({ userList, chunkSize });
            
            worker.onmessage = (e: MessageEvent) => {
                const data = e.data as types.TemplateReturn[];
                global.lastUpdate = Date.now()
                global.fetched = data
                return data
            };
    
            worker.onerror = (error) => {
                console.error("Error fetching user data:", error);
            };
        } catch (error) {
            console.error("Error creating worker:", error);
        }
    }
    
    
}
