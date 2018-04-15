import {PuzzleHeight, PuzzleWidth} from '../constants'

const context = {
    app: null,
    grid: null,
}

export function init(app) {
    context.app = app
    calcScreenCapacity()
}

export const calcScreenCapacity = () => {
    const {width, height} = getScreenSize()

    verticalCapacity = Math.ceil(height / PuzzleHeight)
    horizontalCapacity = Math.ceil(width / PuzzleWidth)
    frameWidth = PuzzleWidth * horizontalCapacity
    frameHeight = PuzzleHeight * verticalCapacity
}

export function getStage() {
    return context.app.stage
}

export function getScreenSize() {
    return {
        width: window.screen.width,
        height: window.screen.height
    }
}

export let
    verticalCapacity,
    horizontalCapacity,
    frameWidth,
    frameHeight

// to each side
export const GRID_RANK = 5

export const setGrid = grid => {
    context.grid = grid
}

export const getGrid = () => context.grid
