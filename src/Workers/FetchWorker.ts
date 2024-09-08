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
import * as types from '../Types/Types'

async function FetchUserData(UserList: types.UserList[], chunkSize: number): Promise<types.TemplateReturn[]> {
	const playerData: types.TemplateReturn[] = []

	// Ensure UserList is defined and valid
	if (!UserList || !Array.isArray(UserList) || UserList.length === 0) {
		throw new Error('Invalid or empty UserList received')
	}

	console.log(`Starting to fetch data for ${UserList.length} users, chunkSize: ${chunkSize}`)

	for (let i = 0; i < UserList.length; i += chunkSize) {
		const userBatch = UserList.slice(i, i + chunkSize)
		const queries = userBatch.map(user => user.name)

		const url = 'https://api.earthmc.net/v3/aurora/players'

		try {
			const requestBody = {
				query: queries,
				template: {
					name: true,
					uuid: true,
					status: true
				}
			}


			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(requestBody)
			})

			if (!response.ok) {
				console.error(`HTTP error! Status: ${response.status}`)
				continue 
			}

			const data = await response.json()
			playerData.push(...data)

			if (i + chunkSize < UserList.length) {
				const delay = (60 * 1000) / 180 
				await new Promise(resolve => setTimeout(resolve, delay))
			}
		} catch (error) {
			console.error('Error fetching player data:', error)
		}
	}

	return playerData
}


self.onmessage = async (event) => {
	try {
		const { userList, chunkSize } = event.data

		// Validate that userList is not null or undefined
		if (!userList || !Array.isArray(userList)) {
			throw new Error('Invalid userList data passed to worker')
		}

        
		const data = await FetchUserData(userList, chunkSize)

		if (data && data.length > 0) {
			self.postMessage(data)
		} else {
			console.log('Worker fetched no data.')
			self.postMessage([]) // Send empty array if no data is fetched
		}
	} catch (error) {
		console.error('Error inside worker:', error)
		self.postMessage({ error: error})
	}
}
