import express from 'express'
import * as path from 'path'
import { Middleware } from './src/middleware'


try {
	const app = express()
	const middleware = new Middleware()

	app.use(middleware.handle)

	const PORT = process.env.PORT || 3000

	
	app.listen(PORT, () => {
		console.log('Started on port',PORT)
	})
} catch (e) {
	throw new Error(`Unexpected error ${e}`)
}