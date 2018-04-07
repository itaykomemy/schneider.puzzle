import * as Context from './Context'
import {
    frameHeight,
    frameWidth
} from './Context'
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
                this.switchFrames(i, j, i, j + 2)
            }
        }
    }

    resetLeft() {
        for (let i = 0; i < Context.GRID_RANK; i++) {
            for (let j = Context.GRID_RANK - 1; j > 1; j--) {
                this.switchFrames(i, j, i, j - 2)
            }
        }
    }

    resetUp() {
        for (let i = Context.GRID_RANK - 1; i > 1; i--) {
            for (let j = 0; j < Context.GRID_RANK; j++) {
                this.switchFrames(i, j, i - 2, j)
            }
        }
    }

    resetDown() {
        for (let i = 0; i < Context.GRID_RANK - 2; i++) {
            for (let j = 0; j < Context.GRID_RANK; j++) {
                this.switchFrames(i, j, i + 2, j)
            }
        }
    }

    switchFrames(i1, j1, i2, j2, loadNext = true) {
        const f1 = this._frames[i1][j1]
        const f2 = this._frames[i2][j2]
        const {x: x1, y: y1} = f1.getPosition()
        const {x: x2, y: y2} = f2.getPosition()

        f2.setPosition(x1, y1)
        this._frames[i1][j1] = f2

        f1.setPosition(x2, y2)
        this._frames[i2][j2] = f1
        if (loadNext) {
            f1.loadNext()
        }
    }
}
