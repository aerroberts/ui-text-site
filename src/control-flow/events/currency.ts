import type { GameEvent } from "../events";

export interface CurrencyDefinition {
    name: string;
    symbol: string;
    color: string;
    initialMaxValue: number;
}

// When currency is gained
export type GainCurrencyEvent = {
    type: GameEvent.CURRENCY_GAIN;
    currency: CurrencyDefinition;
    amount: number;
};

// When currency max is increased
export type IncreaseCurrencyMaxEvent = {
    type: GameEvent.CURRENCY_INCREASE_MAX;
    currency: CurrencyDefinition;
    amount: number;
};

// When something needs to emit the currency value this is the event that is emitted
export type EmitCurrencyValueEvent = {
    type: GameEvent.CURRENCY_EMIT_VALUE;
    currency: CurrencyDefinition;
    value: number;
};

// When currency is spent
export type SpendCurrencyEvent = {
    type: GameEvent.CURRENCY_SPEND;
    currency: string;
    amount: number;
};

// When currency max is reached
export type CurrencyMaxReachedEvent = {
    type: GameEvent.CURRENCY_MAX_REACHED;
    currency: string;
    value: number;
    maxValue: number;
};

// When currency min is reached
export type CurrencyMinReachedEvent = {
    type: GameEvent.CURRENCY_MIN_REACHED;
    currency: string;
    value: number;
};
