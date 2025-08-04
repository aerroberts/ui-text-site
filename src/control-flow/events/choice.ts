import type { GameEvent } from "../events";
import { CurrencyDefinition } from "./currency";

export interface ChoiceOption {
    id: string;
    text: string;
    disableFlags?: string[];
    cost?: {
        currency: CurrencyDefinition;
        amount: number;
    };
}

export interface Choice {
    id: string;
    description: string;
    options: ChoiceOption[];
}

export type ProposeChoiceEvent = {
    type: GameEvent.CHOICE_PROPOSE;
    choice: Choice;
};

export type ChoiceSelectedEvent = {
    type: GameEvent.CHOICE_SELECTED;
    choiceId: string;
    optionId: string;
    option: Choice;
};
