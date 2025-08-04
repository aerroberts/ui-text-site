import { GameEvent } from "../../control-flow/events";
import type { Choice, ProposeChoiceEvent } from "../../control-flow/events/choice";
import type { EmitCurrencyValueEvent } from "../../control-flow/events/currency";
import { BaseController } from "../base-controller";

export class ChoiceController extends BaseController {
    private choices: Choice[] = [];
    private currentChoice: Choice | null = null;
    private choiceDisplay: HTMLElement | null = null;
    private currencyOptions: { element: HTMLElement; currency: string; requiredAmount: number }[] = [];
    private choiseDisabled: boolean = false;

    constructor() {
        super("choice");
    }

    initialize(): void {
        this.events.on(GameEvent.CHOICE_PROPOSE, this.onChoiceProposed.bind(this));
        this.events.on(GameEvent.CURRENCY_EMIT_VALUE, this.onCurrencyValueEmitted.bind(this));
    }

    // Choice Ui

    private createChoiceDisplayElement(choice: Choice) {
        const element = document.createElement("div");
        element.className = "choice-display";
        element.innerHTML = `
            <div class="choice-content">
                <div class="choice-header">
                    <span class="choice-description">${choice.description}</span>
                </div>
                <div class="choice-options" style="opacity: 0;">
                ${choice.options
                    .map(
                        (option) => `
                    <button class="choice-option" data-option-id="${option.id}">
                        <div class="option-text">${option.text}</div>
                        ${
                            option.cost
                                ? `
                            <div class="option-cost" style="background-color: ${option.cost.currency.color};">
                                ${option.cost.amount} ${option.cost.currency.symbol}
                            </div>
                        `
                                : ""
                        }
                    </button>
                `,
                    )
                    .join("")}
                </div>
            </div>
        `;
        this.choiceDisplay = element;
        this.baseElement.appendChild(element);
        const choiceDisplayHeader = element.querySelector(".choice-description") as HTMLElement;
        const choiceDisplayOptions = element.querySelector(".choice-options") as HTMLElement;
        const choiceDisplayOptionsButtons = choiceDisplayOptions.querySelectorAll(
            ".choice-option",
        ) as NodeListOf<HTMLButtonElement>;

        // Do a little animation for the choice description
        let currentText = "";
        const typeEffect = setInterval(() => {
            currentText += choice.description[currentText.length];
            if (choiceDisplayHeader) {
                choiceDisplayHeader.textContent = currentText;
            }
            if (currentText.length >= choice.description.length) {
                clearInterval(typeEffect);
                choiceDisplayOptions.style.opacity = "1";
            }
        }, 30);

        // Check if any options are disabled
        for (const button of choiceDisplayOptionsButtons) {
            const option = choice.options.find((option) => option.id === button.dataset.optionId);
            if (!option) continue;
            if (option.disableFlags) {
                for (const flag of option.disableFlags) {
                    if (this.save.getFlag(flag)) {
                        button.setAttribute("disabled", "");
                        button.style.opacity = "0.5";
                        button.style.cursor = "not-allowed";
                    }
                }
            }
        }

        // Capture the options to listen for currency value changes
        for (const button of choiceDisplayOptionsButtons) {
            const option = choice.options.find((option) => option.id === button.dataset.optionId);
            if (!option) continue;
            this.currencyOptions.push({
                element: button,
                currency: option.cost?.currency.name || "",
                requiredAmount: option.cost?.amount || 0,
            });
            button.addEventListener("click", () => {
                if (!this.choiseDisabled) {
                    this.choiseDisabled = true;
                    element.style.opacity = "0";
                    if (option.cost) {
                        this.events.emit(GameEvent.CURRENCY_SPEND, {
                            currency: option.cost.currency.name,
                            amount: option.cost.amount,
                        });
                    }
                    setTimeout(() => {
                        this.events.emit(GameEvent.CHOICE_SELECTED, {
                            choiceId: choice.id,
                            optionId: option.id,
                            option: choice,
                        });
                        this.destroyChoiceDisplayElement();
                        this.attemptProgressChoice();
                    }, 1000);
                }
            });
        }
    }

    private destroyChoiceDisplayElement(): void {
        if (this.choiceDisplay) {
            this.choiceDisplay.remove();
            this.choiceDisplay = null;
            this.currentChoice = null;
        }
        this.attemptProgressChoice();
    }

    // State control

    private attemptProgressChoice(): void {
        if (this.choices.length === 0) {
            this.log.info("No choices to progress");
            return;
        }
        if (this.currentChoice) {
            this.log.info("Already have a current choice");
            return;
        }

        this.currentChoice = this.choices.shift() || null;

        if (!this.currentChoice) {
            this.log.error("No current choice to progress");
            return;
        }

        this.choiseDisabled = false;
        this.createChoiceDisplayElement(this.currentChoice);
    }

    private onCurrencyValueEmitted(event: EmitCurrencyValueEvent): void {
        this.currencyOptions.forEach((option) => {
            if (option.currency === event.currency.name) {
                if (event.value >= option.requiredAmount) {
                    option.element.style.opacity = "1";
                    option.element.removeAttribute("disabled");
                    option.element.style.cursor = "pointer";
                } else {
                    option.element.style.opacity = "0.5";
                    option.element.setAttribute("disabled", "");
                    option.element.style.cursor = "not-allowed";
                }
            }
        });
    }

    // Event Handlers

    onChoiceProposed(event: ProposeChoiceEvent): void {
        this.choices.push(event.choice);
        this.attemptProgressChoice();
    }
}
