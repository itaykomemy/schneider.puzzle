import * as PIXI from 'pixi.js'
import * as api from '../api'
import {DEBUG} from '../Config'
import {
    PuzzleHeight,
    PuzzleWidth
} from '../constants'
import Matrix from './Matrix'

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
                const d = initialData.find(d => d.x === j + topLeft.x && d.y === i + topLeft.y)
                const tag = new TextTag(
                    this.zerox + j * PuzzleWidth, //+ PuzzleWidth / 2,
                    this.zeroy + i * PuzzleHeight, //+ PuzzleHeight / 2,
                    this.container
                )
                tag.setDonor(d)
                return tag
            }
        )

        if (DEBUG) {
            this.debugt = new TextTag(this.zerox, this.zeroy, this.container)
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
            this.debugt.setText(`${this.topLeft.x}, ${this.topLeft.y}`)
            this.debugt.changePositionBy(-dx, -dy)
        }
    }

    populateCol(col, colNum) {
        api.fetchDonors(colNum, colNum, this.topLeft.y, this.topLeft.y + this.numRows)
            .then(donors => {
                    col.forEach(
                        (tag, index) => {
                            const donor = donors.find(d => d.y === this.topLeft.y + index)
                            tag.setDonor(donor)
                        }
                    )
                }
            )
    }

    populateRow(row, rowNum) {
        api.fetchDonors(this.topLeft.x, this.topLeft.x + this.numCols, rowNum, rowNum)
            .then(donors => {
                row.forEach(
                    (tag, index) => {
                        const donor = donors.find(d => d.x === this.topLeft.x + index)
                        tag.setDonor(donor)
                    }
                )
            })
    }

    _addTopLeft(dx, dy) {
        this.topLeft.x += dx
        this.topLeft.y += dy

        if (dx !== 0) {
            if (dx > 0) {
                const cols = this.matrix.onScrollRight(dx)
                cols.forEach((col, index) => this.populateCol(col, this.topLeft.x + this.numCols + index))

            } else {
                const cols = this.matrix.onScrollLeft(-dx)
                cols.forEach((col, index) => this.populateCol(col, this.topLeft.x - index))
            }
        }

        if (dy !== 0) {
            if (dy > 0) {
                const rows = this.matrix.onScrollDown(dy)
                rows.forEach((row, index) => this.populateRow(row, this.topLeft.y + this.numRows + index))
            } else {
                const rows = this.matrix.onScrollUp(-dy)
                rows.forEach((row, index) => this.populateRow(row, this.topLeft.y + index))
            }
        }
    }
}
