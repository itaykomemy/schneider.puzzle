import {PuzzleWidth, PuzzleHeight} from './constants'

export const calcScreenCapacity = () => {
    const h = window.innerHeight,
        w = window.innerWidth

    const vertical = Math.ceil(h / PuzzleHeight),
        horizontal = Math.ceil(w / PuzzleWidth)

    return vertical * horizontal
}

const limit = calcScreenCapacity()

export const getPage = page => fetch(`/donors/?limit=${limit}&offset=${page * limit}`)
    .then(res => res.json())
