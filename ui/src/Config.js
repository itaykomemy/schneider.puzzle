export const MOCK = process.env.REACT_APP_USE_MOCK === "true"
export const DEBUG = process.env.REACT_APP_DEBUG === "true"

if (MOCK) {
    console.warn('MOCK is True')
}

if (DEBUG) {
    console.warn('DEBUG is True')
}