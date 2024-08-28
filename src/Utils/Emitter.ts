import * as events from 'events';

class emitter extends events.EventEmitter {
    public emittedEvents: Set<string> = new Set();

    emit(event: string | symbol, ...args: any[]): boolean {
        this.emittedEvents.add(event.toString());
        return super.emit(event, ...args);
    }

    hasEmitted(event: string): boolean {
        return this.emittedEvents.has(event);
    }
}

export const Emitter = new emitter();
