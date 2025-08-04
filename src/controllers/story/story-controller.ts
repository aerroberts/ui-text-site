import { GameEvent } from "../../control-flow/events";
import type { Choice, ChoiceSelectedEvent } from "../../control-flow/events/choice";
import type { ShowStoryEvent } from "../../control-flow/events/story";
import { BaseController } from "../base-controller";
import { Currency } from "../currency/currencies";
import { initialBootStory, scanYourSystem } from "./stories/initial-boot";

enum StoryEvent {
    CRASH_LANDING = "story_crash_landing",
}

export class StoryController extends BaseController {
    constructor() {
        super("story");
    }

    initialize(): void {
        this.log.info("MachineController initialized - Cyberpunk Machine Assembly");

        this.events.on(GameEvent.SHOW_STORY_EVENT, this.onStoryEvent.bind(this));
        this.events.on(GameEvent.CHOICE_SELECTED, this.onStoryChoiceSelected.bind(this));

        setTimeout(() => {
            this.events.emit(GameEvent.SHOW_STORY_EVENT, {
                event: StoryEvent.CRASH_LANDING,
            });
        }, 1000);
    }

    private choice(choice: Choice) {
        this.events.emit(GameEvent.CHOICE_PROPOSE, { choice });
    }

    // Handle story events
    private onStoryEvent(event: ShowStoryEvent): void {
        if (event.event === StoryEvent.CRASH_LANDING) {
            this.choice(initialBootStory);
        }
    }

    private onStoryChoiceSelected(event: ChoiceSelectedEvent): void {
        if (event.choiceId === "initial_boot") {
            if (event.optionId === "query_systems") {
                this.save.setFlag("initial_boot_query_systems");
                this.choice(scanYourSystem);
                this.choice(initialBootStory);
            } else if (event.optionId === "scan_area") {
                this.events.emit(GameEvent.CURRENCY_GAIN, {
                    currency: Currency.heat,
                    amount: 10,
                });
                this.choice(initialBootStory);
            }
        }
    }
}
