import {horizontalCapacity, verticalCapacity} from './canvas/Context'

export const getPage = page => {
    const limit = horizontalCapacity * verticalCapacity
    return fetch(`/donors/?limit=${limit}&offset=${page * limit}`)
        .then(res => res.json())
}
