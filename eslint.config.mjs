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
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
})

export default [
	...compat.extends('eslint:recommended', 'plugin:@typescript-eslint/recommended'),
	{
		plugins: {
			'@typescript-eslint': typescriptEslint,
		},

		languageOptions: {
			globals: {
				...Object.fromEntries(Object.entries(globals.browser).map(([key]) => [key, 'off'])),
			},

			parser: tsParser,
			ecmaVersion: 'latest',
			sourceType: 'script',
		},

		rules: {
			indent: ['error', 'tab'],
			'linebreak-style': ['error', 'windows'],
			quotes: ['error', 'single'],
			semi: ['error', 'never'],
			'@typescript-eslint/no-explicit-any': 'off',
			'no-unused-vars': 'warn',
		},
	},
]