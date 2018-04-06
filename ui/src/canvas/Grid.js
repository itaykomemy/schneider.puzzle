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

    traverse(fn) {
        this.traverseWithinBoundaries(0, Context.GRID_RANK, 0, Context.GRID_RANK, fn)
    }

    traverseWithinBoundaries(fromRow, toRow, fromColumn, toColumn, fn) {
        if (!(fn && fn.apply)) return

        for (let i = fromRow; i < toRow; i++)
            for (let j = fromColumn; j < toColumn; j++)
                fn(this._frames[i][j], i, j)
    }

    resetRight() {
        for (let i = 0; i < Context.GRID_RANK; i++) {
            for (let j = 0; j < Context.GRID_RANK - 2; j++) {
                const frame = this._frames[i][j]
                const f2 = this._frames[i][j + 2]
                f2.moveDonorsToFrame(frame)
                f2.loadNext()
            }
        }
    }

    resetLeft() {
        for (let i = 0; i < Context.GRID_RANK; i++) {
            for (let j = Context.GRID_RANK - 1; j > 1; j--) {
                const frame = this._frames[i][j]
                const f2 = this._frames[i][j - 2]
                f2.moveDonorsToFrame(frame)
                f2.loadNext()
            }
        }
    }

    resetUp() {
        for (let i = Context.GRID_RANK - 1; i > 1; i--) {
            for (let j = 0; j < Context.GRID_RANK; j++) {
                const frame = this._frames[i][j]
                const f2 = this._frames[i - 2][j]
                f2.moveDonorsToFrame(frame)
                f2.loadNext()
            }
        }
    }

    resetDown() {
        for (let i = 0; i < Context.GRID_RANK - 2; i++) {
            for (let j = 0; j < Context.GRID_RANK; j++) {
                const frame = this._frames[i][j]
                const f2 = this._frames[i + 2][j]
                f2.moveDonorsToFrame(frame)
                f2.loadNext()
            }
        }
    }
}
