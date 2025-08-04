export enum GameEvent {
    // Currency events
    CURRENCY_GAIN = "gain_currency",
    CURRENCY_SPEND = "spend_currency",
    CURRENCY_MAX_REACHED = "currency_max_reached",
    CURRENCY_MIN_REACHED = "currency_min_reached",
    CURRENCY_INCREASE_MAX = "increase_currency_max",
    CURRENCY_EMIT_VALUE = "emit_currency_value",

    // Choice events
    CHOICE_PROPOSE = "propose_choice",
    CHOICE_SELECTED = "choice_selected",

    // Game events
    GAME_START = "game_start",

    // Story events
    SHOW_STORY_EVENT = "show_story_event",
}
