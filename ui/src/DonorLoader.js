import * as api from './api'
import {MOCK} from './Config'

let lastLoaded = 0
let totalCount = null

export const fetchDonors = (count) => {
    const startAt = lastLoaded
    lastLoaded += count
    if (lastLoaded > totalCount) {
        lastLoaded = 0
    }
    const p = api.fetchDonors(startAt, count)
    p.then(({count}) => {
        totalCount = count
    })

    return p
}