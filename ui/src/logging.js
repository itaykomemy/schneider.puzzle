import {DEBUG} from './Config'

export const logdebug = (...args) => {
    if (DEBUG) {
        console.debug(...args)
    }
}
