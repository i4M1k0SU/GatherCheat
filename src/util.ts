export const debounce = (func: () => void, wait: number = 1000) => {
    let timeoutId: number | null = null;
    return () => {
        if (timeoutId !== null) {
            window.clearTimeout(timeoutId);
            timeoutId = null;
        }
        timeoutId = window.setTimeout(func, wait);
    };
};

export const sleep = (ms: number) => new Promise<void>(resolve => window.setTimeout(resolve, ms));
