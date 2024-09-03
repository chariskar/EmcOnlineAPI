import * as types from '../Types/Types';

async function FetchUserData(UserList: types.UserList[], chunkSize: number): Promise<types.TemplateReturn[]> {
    const playerData: types.TemplateReturn[] = [];

    // Ensure UserList is defined and valid
    if (!UserList || !Array.isArray(UserList) || UserList.length === 0) {
        throw new Error("Invalid or empty UserList received");
    }

    for (let i = 0; i < UserList.length; i += chunkSize) {
        const userBatch = UserList.slice(i, i + chunkSize);
        const queries = userBatch.map(user => user.name); // Collecting user names into an array for the query

        const url = `https://api.earthmc.net/v3/aurora/players`;

        try {
            const requestBody = {
                query: queries,
                template: {
                    name: true,
                    uuid: true,
                    status: true
                }
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                console.error(`HTTP error! Status: ${response.status}`);
                continue; 
            }

            const data = await response.json();
            playerData.push(...data);
            if (i + chunkSize < UserList.length) {
                const delay = (60 * 1000) /  180;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        } catch (error) {
            console.error('Error fetching player data:', error);
        }

        
    }

    return playerData;
}

self.onmessage = async (event) => {
    try {
        const { userList, chunkSize } = event.data;

        // Validate that userList is not null or undefined
        if (!userList || !Array.isArray(userList)) {
            throw new Error("Invalid userList data passed to worker");
        }

        const data = await FetchUserData(userList, chunkSize)
        self.postMessage(data)
    } catch (error) {
        self.postMessage({ error: error });
    }
};
