import { Events } from "./control-flow/event-bus";
import { GameEvent } from "./control-flow/events";
import type { BaseController } from "./controllers/base-controller";
import { type Logger, logger } from "./utils/logger";
import { SaveState } from "./utils/save";

export class GameController {
    public readonly log: Logger;
    public readonly save: SaveState;
    public readonly events: Events;

    private controllers: Map<string, BaseController> = new Map();

    constructor() {
        this.log = logger("game");
        this.log.info("Game controller initialized");
        this.events = new Events();
        this.save = new SaveState();
    }

    // Public access

    addController(controller: BaseController): void {
        controller.register(this);
        this.controllers.set(controller.name, controller);
    }

    start(): void {
        this.events.emit(GameEvent.GAME_START, {});
    }
}
