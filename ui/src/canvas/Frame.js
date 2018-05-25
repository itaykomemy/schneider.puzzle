import * as PIXI from 'pixi.js'
import * as api from '../api'
import {DEBUG} from '../Config'
import {
    PuzzleHeight,
    PuzzleWidth
} from '../constants'
import {getEdgeOrBoundry} from '../utils'
import Matrix, {range} from './Matrix'

import {TextTag} from './TextTag'


export default class Frame {
    constructor(container, zerox, zeroy, numRows, numCols, topLeft, boundries, initialData = []) {
        this.parent = container
        this.acc = {dx: 0, dy: 0}
        this.zerox = zerox
        this.zeroy = zeroy
        this.numRows = numRows
        this.numCols = numCols
        this.container = new PIXI.Container()
        this.container.x = zerox
        this.container.y = zeroy
        this.topLeft = topLeft
        this.boundries = boundries
        this.parent.addChild(this.container)
        this.matrix = new Matrix(numCols, numRows,
            (i, j) => {
                const d = initialData.find(d => d.x === j && d.y === i)
                const name = d ? `${d.firstName} ${d.lastName}` : ""
                return new TextTag(
                    this.zerox + j * PuzzleWidth,
                    this.zeroy + i * PuzzleHeight,
                    this.container,
                    name
                )
            }
        )

        this.donors = initialData

        if (DEBUG) {
            this.debugt = new TextTag(0, 0, this.container)
        }
    }

    getPosition() {
        return {
            x: this.container.x,
            y: this.container.y
        }
    }

    setPosition(x, y) {
        this.container.x = x
        this.container.y = y
    }

    addDelta(dx, dy) {
        this.container.x += dx
        this.container.y += dy

        const dxBefore = this.acc.dx
        this.acc.dx -= dx

        const xSignAfter = this.acc.dx / Math.abs(this.acc.dx)
        const xSignBefore = dxBefore / Math.abs(dxBefore)

        if (xSignBefore !== xSignAfter) {
            this._addTopLeft(xSignAfter, 0)
        } else if (Math.abs(this.acc.dx) / PuzzleWidth >= 1) {
            this._addTopLeft(Math.trunc(this.acc.dx / PuzzleWidth), 0)
            this.acc.dx %= PuzzleWidth
        }

        const dyBefore = this.acc.dy
        this.acc.dy -= dy

        const ySignAfter = this.acc.dy / Math.abs(this.acc.dy)
        const ySignBefore = dyBefore / Math.abs(dyBefore)

        if (ySignBefore !== ySignAfter) {
            this._addTopLeft(0, ySignAfter)
        } else if (Math.abs(this.acc.dy) / PuzzleHeight >= 1) {
            this._addTopLeft(0, Math.trunc(this.acc.dy / PuzzleHeight))
            this.acc.dy %= PuzzleHeight
        }

        if (DEBUG) {
            this.debugt.setText(`${this.topLeft[0]}, ${this.topLeft[1]}`)
            this.debugt.textObject.x -= dx
            this.debugt.textObject.y -= dy
        }
    }

    _addTopLeft(dx, dy) {
        this.topLeft[0] += dx
        this.topLeft[1] += dy

        if (dx !== 0) {
            if (dx > 0) {
                this.matrix.onScrollRight(dx)
            } else {
                this.matrix.onScrollLeft(-dx)
            }
        }

        if (dy !== 0) {
            if (dy > 0) {
                this.matrix.onScrollDown(dy)
            } else {
                this.matrix.onScrollUp(-dy)
            }
        }
    }

    clear() {
        this.tags.forEach(t => t.clear())
    }

    _getLeftCoord() {
        return getEdgeOrBoundry(this.topLeft[0], 0, this.boundries[3])
    }

    _getRightCoord() {
        return getEdgeOrBoundry(this.topLeft[0], this.numCols, this.boundries[1])
    }

    _getTopCoord() {
        return getEdgeOrBoundry(this.topLeft[1], 0, this.boundries[0])
    }

    _getBottomCoord() {
        return getEdgeOrBoundry(this.topLeft[1], this.numRows, this.boundries[2])
    }
}
