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

async function FetchUserData(UserList: types.UserList[], chunkSize: number): Promise<types.Player[]> {
    const playerData: types.Player[] = [];

    for (let i = 0; i < UserList.length; i += chunkSize) {
        const userBatch = UserList.slice(i, i + chunkSize);

        const requests = userBatch.map(user =>
            fetch(`https://api.earthmc.net/v3/aurora/players/${user.name}`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
                }
            )
            .then(res => {
                    if (!res.ok) {
                        throw new Error(`Failed to fetch data for user: ${user.name}, status: ${res.status}`);
                    }
                    return res.json();
                })
        );

        try {
            const responses = await Promise.all(requests);
            playerData.push(...responses as types.Player[]);
        } catch (error) {
            console.error('Error fetching player data:', error);
        }
    }

    return playerData;
}

self.onmessage = async (event) => {
    const { UserList, chunkSize } = event.data;

    try {
        const result = await FetchUserData(UserList, chunkSize);
        self.postMessage(result);
    } catch (error) {
        console.error('Error in worker:', error);
        self.postMessage({ error: 'Error fetching user data' });
    }
};

