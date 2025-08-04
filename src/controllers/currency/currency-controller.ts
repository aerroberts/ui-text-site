import { GameEvent } from "../../control-flow/events";
import type {
    CurrencyDefinition,
    GainCurrencyEvent,
    IncreaseCurrencyMaxEvent,
    SpendCurrencyEvent,
} from "../../control-flow/events/currency";
import { BaseController } from "../base-controller";

interface CurrencyTracked {
    currency: CurrencyDefinition;
    currentValue: number;
    maxValue: number;
    container: HTMLDivElement;
    valueTextDisplay: HTMLDivElement;
    valueBarDisplay: HTMLDivElement;
}

export class CurrencyController extends BaseController {
    private currencies: Map<string, CurrencyTracked> = new Map();

    constructor() {
        super("currency");
    }

    initialize(): void {
        this.log.info("CurrencyController initialized");

        // Listen for currency events
        this.events.on(GameEvent.CURRENCY_GAIN, this.onCurrencyGained.bind(this));
        this.events.on(GameEvent.CURRENCY_SPEND, this.onCurrencySpent.bind(this));
        this.events.on(GameEvent.CURRENCY_INCREASE_MAX, this.onCurrencyMaxIncreased.bind(this));

        // Emit currency value every second for other controllers to listen to
        setInterval(() => this.emitCurrencyValue(), 1000);
    }

    // State control

    private isCurrencyKnown(name: string): boolean {
        return !!this.currencies.get(name);
    }

    private getCurrency(name: string): CurrencyTracked {
        const currency = this.currencies.get(name);
        if (!currency) {
            throw new Error(`Currency ${name} not found`);
        }
        return currency;
    }

    private updateCurrencyValue(name: string, value: number): void {
        const currency = this.getCurrency(name);
        const oldValue = currency.currentValue;
        const newValue = Math.max(0, Math.min(value, currency.maxValue));
        const percentage = (newValue / currency.maxValue) * 100;

        currency.currentValue = newValue;
        currency.valueTextDisplay.textContent = newValue.toString();
        currency.valueBarDisplay.style.width = `${percentage}%`;

        // Emit min/max reached events
        this.checkForMinMaxEvents(currency, oldValue, newValue);
    }

    private updateCurrencyMax(name: string, newMax: number): void {
        const currency = this.getCurrency(name);
        currency.maxValue = Math.max(newMax, 0);

        // Clamp current value to new max
        if (currency.currentValue > currency.maxValue) {
            this.updateCurrencyValue(name, currency.maxValue);
        } else {
            // Just update the display to show new max
            const percentage = (currency.currentValue / currency.maxValue) * 100;
            currency.valueBarDisplay.style.width = `${percentage}%`;
        }
    }

    private checkForMinMaxEvents(currency: CurrencyTracked, oldValue: number, newValue: number): void {
        // Check for max reached
        if (newValue >= currency.maxValue && oldValue < currency.maxValue) {
            this.events.emit(GameEvent.CURRENCY_MAX_REACHED, {
                currency: currency.currency.name,
                value: newValue,
                maxValue: currency.maxValue,
            });
        }

        // Check for min reached
        if (newValue <= 0 && oldValue > 0) {
            this.events.emit(GameEvent.CURRENCY_MIN_REACHED, {
                currency: currency.currency.name,
                value: newValue,
            });
        }
    }

    private emitCurrencyValue(): void {
        for (const currency of this.currencies.values()) {
            this.events.emit(GameEvent.CURRENCY_EMIT_VALUE, {
                currency: currency.currency,
                value: currency.currentValue,
            });
        }
    }

    // Ui Control

    private createCurrencyDisplayElement(currency: CurrencyDefinition): CurrencyTracked {
        const element = document.createElement("div");
        element.innerHTML = `
            <div class="currency-container">
                <div class="currency-display">
                    <div class="currency-value-bar" style="background-color: ${currency.color}; width: 0%;"></div>
                </div>
                <div class="currency-symbol">${currency.symbol}</div>
                <div class="currency-value">0</div>
            </div>
        `;

        const container = element.querySelector(".currency-container") as HTMLDivElement;
        const valueTextDisplay = element.querySelector(".currency-value") as HTMLDivElement;
        const valueBarDisplay = element.querySelector(".currency-value-bar") as HTMLDivElement;

        this.baseElement.appendChild(element);

        return {
            currency,
            currentValue: 0,
            maxValue: currency.initialMaxValue,
            container,
            valueTextDisplay,
            valueBarDisplay,
        };
    }

    // Event Handlers

    onCurrencyGained(event: GainCurrencyEvent): void {
        if (!this.isCurrencyKnown(event.currency.name)) {
            const currency = this.createCurrencyDisplayElement(event.currency);
            this.currencies.set(event.currency.name, currency);
        }

        const currentValue = this.getCurrency(event.currency.name).currentValue;
        this.updateCurrencyValue(event.currency.name, currentValue + event.amount);

        this.log.info(`Gained ${event.amount} ${event.currency.name}`);
    }

    onCurrencySpent(event: SpendCurrencyEvent): void {
        if (!this.isCurrencyKnown(event.currency)) {
            this.log.warn(`Cannot spend ${event.currency}: currency not found`);
            return;
        }

        const currency = this.getCurrency(event.currency);
        if (currency.currentValue < event.amount) {
            this.log.warn(
                `Cannot spend ${event.amount} ${event.currency}: insufficient funds (have ${currency.currentValue})`,
            );
            return;
        }

        this.updateCurrencyValue(event.currency, currency.currentValue - event.amount);
        this.log.info(`Spent ${event.amount} ${event.currency}`);
    }

    onCurrencyMaxIncreased(event: IncreaseCurrencyMaxEvent): void {
        if (!this.isCurrencyKnown(event.currency.name)) {
            const currency = this.createCurrencyDisplayElement(event.currency);
            this.currencies.set(event.currency.name, currency);
        }

        const currency = this.getCurrency(event.currency.name);
        this.updateCurrencyMax(event.currency.name, currency.maxValue + event.amount);

        this.log.info(`Increased ${event.currency.name} max by ${event.amount} to ${currency.maxValue}`);
    }
}
