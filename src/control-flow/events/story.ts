import type { GameEvent } from "../events";

export type ShowStoryEvent = {
    type: GameEvent.SHOW_STORY_EVENT;
    event: string;
};
