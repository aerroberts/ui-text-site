import { BaseController } from "../base-controller";
import { createMainBodyPart, type MachinePart } from "./parts";

export class MachineController extends BaseController {
    private machineParts: Map<string, MachinePart> = new Map();

    constructor() {
        super("machine");
    }

    private registerMachinePart(part: MachinePart): void {
        this.machineParts.set(part.id, part);
        const container = document.createElement("div");
        container.className = "machine-part-container";
        container.appendChild(part.element);
        this.baseElement.appendChild(container);
    }

    initialize(): void {
        this.log.info("MachineController initialized - Cyberpunk Machine Assembly");

        // Not sure i like this? Not goot at art
        // Register all machine parts
        // this.registerMachinePart(createMainBodyPart());
    }
}
