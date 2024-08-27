import * as events from 'events'

class emitter extends events.EventEmitter {}
export const Emitter = new emitter()

