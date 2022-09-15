export const debounce = (func: () => void, wait: number = 1000) => {
    let timeoutId: number | null = null;
    return () => {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        timeoutId = window.setTimeout(func, wait);
    };
};
