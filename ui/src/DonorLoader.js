import * as api from './api'
import {MOCK} from './Config'

let lastLoaded = 0

export const fetchDonors = (count) => {
    const startAt = lastLoaded
    lastLoaded += count
    return api.fetchDonors(startAt, count)
}
