/**
 * Stops the propagation of event
 *
 * @param event
 */
export function stopEvent(event?: Event): void {
    if (event) {
        event.stopPropagation();
    }
}

/**
 * Stops the propagation of event and it’s default handling by the browser (like typing into input, following the link etc.)
 *
 * @param event
 */
export function gobbleEvent(event?: Event): void {
    if (event) {
        event.preventDefault();
        stopEvent(event);
    }
}

/**
 * Totally stops the propagation of event and it’s default handling by the browser (like typing into input, following the link etc.)
 *
 * @param event
 */
export function killEvent(event?: Event): void {
    if (event) {
        event.stopImmediatePropagation();
        gobbleEvent(event);
    }
}
