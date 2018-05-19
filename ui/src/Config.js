export const DEBUG = process.env.REACT_APP_DEBUG === "true"

if (DEBUG) {
    console.warn('DEBUG is True')
}