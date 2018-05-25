import * as api from './api'

export const fetchDonors = (rows, cols) => {
    const x0 = Math.max(Math.min(...rows), 0)
    const x1 = Math.min(Math.max(...rows))
    const y0 = Math.max(Math.min(...cols), 0)
    const y1 = Math.min(Math.max(...cols))

    return api.fetchDonors(x0, x1, y0, y1)
}
