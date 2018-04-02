import * as Context from './Context'
import {frameHeight, frameWidth} from './Context'
import Frame from './Frame'


export default class Grid {
    constructor() {
        console.debug('frame width', frameWidth, 'frame height', frameHeight)
        this._frames = []
        for (let i = 0; i < Context.GRID_RANK; i++) {
            this._frames.push([])
            for (let j = 0; j < Context.GRID_RANK; j++) {
                this._frames[i].push(
                    new Frame(
                        frameWidth * j,
                        frameHeight * i
                    )
                )
            }
        }
    }

    render(i, j, donors) {
        this._frames[i][j].render(donors)
    }
}