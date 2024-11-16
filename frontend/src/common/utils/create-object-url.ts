export function createObjectURL(object: File) {
    return window.URL ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object);
}