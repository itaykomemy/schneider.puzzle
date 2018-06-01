import {
    PuzzleHeight,
    PuzzleWidth
} from "../constants"

export default class Matrix {

    constructor(colsCount, rowsCount, generator) {
        this.colsCount = colsCount
        this.rowsCount = rowsCount
        this.rows = []
        this.cols = []
        this.firstRowPointer = 0
        this.firstColPointer = 0

        for (let i = 0; i < rowsCount; i++) {
            this.rows[i] = []
            for (let j = 0; j < colsCount; j++) {
                const item = generator(i, j)
                this.rows[i].push(item)
            }
        }

        for (let j = 0; j < colsCount; j++) {
            this.cols[j] = []
            for (let i = 0; i < rowsCount; i++) {
                this.cols[j].push(this.rows[i][j])
            }
        }
    }

    _move(dx, dy) {
        this.firstRowPointer = (this.firstRowPointer + this.rowsCount + dy) % this.rowsCount
        this.firstColPointer = (this.firstColPointer + this.colsCount + dx) % this.colsCount
    }

    onScrollUp(steps) {
        const lastRows = []
        for (let i of range(this.rowsCount - steps, this.rowsCount)) {
            lastRows.unshift(this.getRow(i))
        }
        const {y} = this.getRow(0)[0].getPosition()
        this._move(0, -steps)
        lastRows.forEach(
            (row, index) => row.forEach(tag =>
                tag.setPosition(undefined, y - PuzzleHeight * (index + 1))
            )
        )
        return lastRows
    }

    onScrollRight(steps) {
        const firstColumns = []
        for (let j of range(0, steps)) {
            firstColumns.push(this.getColumn(j))
        }
        const {x} = this.getColumn(this.colsCount - 1)[0].getPosition()
        this._move(steps, 0)
        firstColumns.forEach(
            (col, index) => col.forEach(tag =>
                tag.setPosition(x + PuzzleWidth * (index + 1))
            )
        )
        return firstColumns
    }

    onScrollDown(steps) {
        const firstRows = []
        for (let j of range(0, steps)) {
            firstRows.push(this.getRow(j))
        }
        const {y} = this.getRow(this.rowsCount - 1)[0].getPosition()
        this._move(0, steps)
        firstRows.forEach(
            (row, index) => row.forEach(tag =>
                tag.setPosition(undefined, y + PuzzleHeight * (index + 1))
            )
        )
        return firstRows
    }

    onScrollLeft(steps) {
        const lastColumns = []
        for (let j of range(this.colsCount - steps, this.colsCount)) {
            lastColumns.unshift(this.getColumn(j))
        }
        const {x} = this.getColumn(0)[0].getPosition()
        this._move(-steps, 0)
        lastColumns.forEach(
            (col, index) => col.forEach(tag =>
                tag.setPosition(x - PuzzleWidth * (index + 1))
            )
        )
        return lastColumns
    }

    getRow(i) {
        return this.rows[(this.firstRowPointer + i) % this.rowsCount]
    }

    getColumn(j) {
        return this.cols[(this.firstColPointer + j) % this.colsCount]
    }
}

export const range = function* (start, end) {
    for (let i = start; i < end; i++) {
        yield i
    }
}
