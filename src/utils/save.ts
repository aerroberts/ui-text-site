import { logger } from "./logger";

export interface SaveParam<T = unknown> {
    key: string;
    value: T | undefined;
}

const log = logger("save");

export class SaveState {
    private computeKey(key: string) {
        return `savestate:${key}`;
    }

    purge() {
        localStorage.clear();
    }

    save(key: string, value: unknown) {
        log.info(`Saving ${key} to ${this.computeKey(key)}`);
        localStorage.setItem(this.computeKey(key), JSON.stringify(value));
    }

    setFlag(key: string) {
        log.info(`Setting flag ${key}`);
        const flags = this.load<string[]>("flags") || [];
        flags.push(key);
        this.save("flags", flags);
    }

    getFlag(key: string) {
        log.info(`Getting flag ${key}`);
        const flags = this.load<string[]>("flags") || [];
        return flags.includes(key);
    }

    removeFlag(key: string) {
        log.info(`Removing flag ${key}`);
        const flags = this.load<string[]>("flags") || [];
        this.save(
            "flags",
            flags.filter((flag) => flag !== key),
        );
    }

    load<T = unknown>(key: string) {
        const saved = localStorage.getItem(this.computeKey(key));
        return saved ? (JSON.parse(saved) as T) : undefined;
    }
}
