import type { Logger } from "../utils/logger";
import { logger } from "../utils/logger";
import { GameEvent } from "./events";
import type * as ChoiceEvents from "./events/choice";
import type * as CurrencyEvents from "./events/currency";
import type * as GameEventObj from "./events/game";
import type * as StoryEvents from "./events/story";

export type GameEvents = {
    [GameEvent.GAME_START]: GameEventObj.GameStartEvent;
    [GameEvent.CURRENCY_GAIN]: CurrencyEvents.GainCurrencyEvent;
    [GameEvent.CURRENCY_SPEND]: CurrencyEvents.SpendCurrencyEvent;
    [GameEvent.CURRENCY_INCREASE_MAX]: CurrencyEvents.IncreaseCurrencyMaxEvent;
    [GameEvent.CURRENCY_MAX_REACHED]: CurrencyEvents.CurrencyMaxReachedEvent;
    [GameEvent.CURRENCY_MIN_REACHED]: CurrencyEvents.CurrencyMinReachedEvent;
    [GameEvent.CURRENCY_EMIT_VALUE]: CurrencyEvents.EmitCurrencyValueEvent;
    [GameEvent.CHOICE_PROPOSE]: ChoiceEvents.ProposeChoiceEvent;
    [GameEvent.CHOICE_SELECTED]: ChoiceEvents.ChoiceSelectedEvent;
    [GameEvent.SHOW_STORY_EVENT]: StoryEvents.ShowStoryEvent;
};

export class Events {
    private log: Logger = logger("events");
    private listeners: Map<GameEvent, ((event: GameEvents[GameEvent]) => void)[]> = new Map();

    on<T extends GameEvent>(event: T, listener: (event: GameEvents[T]) => void): void {
        const listeners = this.listeners.get(event) || [];
        listeners.push(listener as unknown as (event: GameEvents[GameEvent]) => void);
        this.listeners.set(event, listeners);
    }

    emit<T extends GameEvent>(type: T, data: Omit<GameEvents[T], "type">): void {
        this.log.info(`Emitting event: ${type}`);
        const event: GameEvents[T] = { type, ...data } as GameEvents[T];
        const listeners = this.listeners.get(type) || [];
        for (const listener of listeners) {
            listener(event);
        }
    }
}
