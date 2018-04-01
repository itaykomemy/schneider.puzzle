export const MOCK = process.env.REACT_APP_USE_MOCK === "true"

if (MOCK) {
    console.warn('MOCK is True')
}
