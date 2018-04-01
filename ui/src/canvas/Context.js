import {PuzzleHeight, PuzzleWidth} from '../constants'


let a

export function init(app) {
    a = app
    calcScreenCapacity()
}

export const calcScreenCapacity = () => {
    const {width, height} = getScreenSize()

    verticalCapacity = Math.ceil(height / PuzzleHeight)
    horizontalCapacity = Math.ceil(width / PuzzleWidth)
}

export function getStage() {
    return a.stage
}

export function getScreenSize() {
    return {
        width: window.screen.width,
        height: window.screen.height
    }
}

export let verticalCapacity,
    horizontalCapacity

