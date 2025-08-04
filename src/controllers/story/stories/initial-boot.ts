import type { Choice } from "../../../control-flow/events/choice";

export const initialBootStory: Choice = {
    id: "initial_boot",
    description: "Cold. You feel cold. You are loosing power slowly to the environment.",
    options: [
        {
            id: "query_systems",
            text: "query your systems for any information",
            disableFlags: ["initial_boot_query_systems"],
        },
        {
            id: "scan_area",
            text: "use your sensors to scan the area",
        },
    ],
};

export const scanYourSystem: Choice = {
    id: "scan_your_system",
    description: "You scan your system for any information, and find nothing.",
    options: [
        {
            id: "_",
            text: "Ok",
        },
    ],
};
