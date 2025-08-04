export interface MachinePart {
    id: string;
    element: HTMLElement;
}

// Helper function to create SVG elements
export function createMainBodyPart(): MachinePart {
    const element = document.createElement("div");
    element.innerHTML = `
        <svg width="500" height="300" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
            <rect x="230" y="180" width="40" height="40" stroke="#737373" stroke-width="1" opacity="0.7" fill="none" />
        </svg>
    `;

    return {
        id: "main-body",
        element,
    };
}
