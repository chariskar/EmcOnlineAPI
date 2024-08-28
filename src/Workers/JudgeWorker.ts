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
import { Judge } from "../Utils/Judge";

self.onmessage = (event: MessageEvent) => {
    const { data } = event;

    if (data.message === 'Start') {
        const judge = new Judge();
        self.postMessage(['Finished', judge.onlinePlayers]);
    } else {
        self.postMessage(['Error', 'Incorrect message']);
    }
};
