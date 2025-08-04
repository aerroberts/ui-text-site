import type { Events } from "../control-flow/event-bus";
import type { GameController } from "../game-controller";
import { type Logger, logger } from "../utils/logger";
import type { SaveState } from "../utils/save";

/**
 * Base controller class that all game controllers extend
 */
export abstract class BaseController {
    public readonly name: string = "base";
    protected readonly log: Logger;
    protected readonly baseElement: HTMLElement;

    protected game!: GameController;
    protected events!: Events;
    protected save!: SaveState;

    constructor(name: string) {
        this.name = name;
        this.log = logger(name);
        const app = document.getElementById("app") as HTMLDivElement;
        this.baseElement = document.createElement("div");
        this.baseElement.className = "controller";
        app.appendChild(this.baseElement);
    }

    register(game: GameController): void {
        this.game = game;
        this.events = game.events;
        this.save = game.save;
        this.log.info(`${this.name} controller initializing`);
        this.initialize();
    }

    /**
     * Initialize the controller - called when the game starts
     */
    protected abstract initialize(): void;
}
