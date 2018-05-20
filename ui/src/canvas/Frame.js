import * as PIXI from 'pixi.js'
import {DEBUG} from '../Config'
import {
    PuzzleHeight,
    PuzzleWidth
} from '../constants'
import {getEdgeOrBoundry} from '../utils'

import {TextTag} from './TextTag'
import * as DonorLoader from '../DonorLoader'


export default class Frame {
    constructor(container, zerox, zeroy, numRows, numCols, topLeft, boundries) {
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
        this.load()

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

    load() {
        return DonorLoader.fetchDonors(
            this._getLeftCoord(),
            this._getRightCoord(),
            this._getTopCoord(),
            this._getBottomCoord()
        ).then(donors => this.render(donors))
    }

    render(donors) {

    }
}
