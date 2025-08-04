/** biome-ignore-all lint/suspicious/noExplicitAny: Log any value */
const start = new Date();

const timeSinceStart = () => {
    const now = new Date();
    const ms = now.getTime() - start.getTime();
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const levelStyles: Record<string, string> = {
    info: "color: #2196f3; font-weight: bold", // blue
    warn: "color: #ff9800; font-weight: bold", // orange
    error: "color: #f44336; font-weight: bold", // red
    default: "color: #9e9e9e", // grey
};

const log = (prefix: string, level: string, message: string) => {
    const style = levelStyles[level] || levelStyles.default;
    console.log(
        `%c[${timeSinceStart()}] %c${prefix} %c${level}%c ${message}`,
        "color: #888", // timestamp
        "color: #fff; font-weight: bold", // prefix (white)
        style, // level
        "color: #888", // message gray
    );
};

export const logger = (prefix: string) => {
    return {
        info: (message: string, data?: any) => {
            const fullMessage = data ? `${message} ${JSON.stringify(data)}` : message;
            log(prefix, "info", fullMessage);
        },
        warn: (message: string, data?: any) => {
            const fullMessage = data ? `${message} ${JSON.stringify(data)}` : message;
            log(prefix, "warn", fullMessage);
        },
        error: (message: string, data?: any) => {
            const fullMessage = data ? `${message} ${JSON.stringify(data)}` : message;
            log(prefix, "error", fullMessage);
        },
        debug: (message: string, data?: any) => {
            const fullMessage = data ? `${message} ${JSON.stringify(data)}` : message;
            log(prefix, "debug", fullMessage);
        },
        child: (childPrefix: string) => {
            return logger(`${prefix}:${childPrefix}`);
        },
    };
};
export type Logger = ReturnType<typeof logger>;
