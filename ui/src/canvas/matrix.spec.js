import {PuzzleHeight, PuzzleWidth} from "../constants"
import Matrix from "./Matrix"
import MockTextTag from "./MockTextTag"

const MAT_H = 5,
    MAT_W = 5

describe('matrix', function() {
    const getTopLeftPosition = () => {
        return {
            x: this.matrix.getColumn(0)[0].getPosition().x,
            y: this.matrix.getRow(0)[0].getPosition().y
        }
    }

    // const getBottomRightPosition = () => {
    //     const lastRow = this.matrix.rowsCount - 1
    //     const lastCol = this.matrix.colsCount-1
    //     return this.matrix.getRow(lastRow)[lastCol].getPosition()
    // }

    beforeEach(() => {
        this.container = {addChild: () => {}}
        this.matrix =
            new Matrix(MAT_W, MAT_H, (i, j) =>
                new MockTextTag(
                    j * PuzzleWidth,
                    i * PuzzleHeight,
                    this.container,
                    ""
                )
            )
    })

    test('assert the initial state', () => {
        expect(this.matrix.firstRowPointer).toEqual(0)
        expect(this.matrix.firstColPointer).toEqual(0)
        expect(this.matrix.rowsCount).toEqual(MAT_W)
        expect(this.matrix.colsCount).toEqual(MAT_H)

        const topLeftEl = getTopLeftPosition()
        expect(topLeftEl.x).toEqual(0)
        expect(topLeftEl.y).toEqual(0)
    })

    describe('_move', () => {
        test('add few steps', () => {
            this.matrix._move(2, 1)

            expect(this.matrix.firstColPointer).toEqual(2)
            expect(this.matrix.firstRowPointer).toEqual(1)
        })

        test('more than a few steps', () => {
            expect(this.matrix.firstColPointer).toEqual(0)
            expect(this.matrix.firstRowPointer).toEqual(0)

            this.matrix._move(5, 0)
            expect(this.matrix.firstColPointer).toEqual(0)
            expect(this.matrix.firstRowPointer).toEqual(0)

            this.matrix._move(-15, 0)
            expect(this.matrix.firstColPointer).toEqual(-0)
            expect(this.matrix.firstRowPointer).toEqual(0)

            this.matrix._move(4, 4)
            expect(this.matrix.firstColPointer).toEqual(4)
            expect(this.matrix.firstRowPointer).toEqual(4)
        })

        test('negative amount of steps', () => {
            this.matrix._move(-1, -1)
            expect(this.matrix.firstColPointer).toEqual(4)
            expect(this.matrix.firstRowPointer).toEqual(4)
        })
    })

    describe('on scroll up', () => {
        test('scroll one', () => {
            this.matrix.onScrollUp(1)

            expect(this.matrix.firstColPointer).toEqual(0)
            expect(this.matrix.firstRowPointer).toEqual(4)

            const {x, y} = getTopLeftPosition()
            expect(x).toEqual(0)
            expect(y).toEqual(-PuzzleHeight)
        })

        test('scroll two', () => {
            this.matrix.onScrollUp(2)
            expect(this.matrix.firstColPointer).toEqual(0)
            expect(this.matrix.firstRowPointer).toEqual(3)
        })
    })

    describe('on scroll right', () => {
        test('scroll one', () => {
            this.matrix.onScrollRight(1)

            expect(this.matrix.firstColPointer).toEqual(1)
            expect(this.matrix.firstRowPointer).toEqual(0)

            const {x, y} = getTopLeftPosition()
            expect(x).toEqual(PuzzleWidth)
            expect(y).toEqual(0)
        })

        test('scroll two', () => {
            this.matrix.onScrollDown(2)
            expect(this.matrix.firstColPointer).toEqual(0)
            expect(this.matrix.firstRowPointer).toEqual(2)
        })
    })

    describe('on scroll down', () => {
        test('scroll one', () => {
            this.matrix.onScrollDown(1)

            expect(this.matrix.firstColPointer).toEqual(0)
            expect(this.matrix.firstRowPointer).toEqual(1)

            expect(getTopLeftPosition().y).toEqual(PuzzleHeight)
        })

        test('scroll two', () => {
            this.matrix.onScrollDown(2)
            expect(this.matrix.firstColPointer).toEqual(0)
            expect(this.matrix.firstRowPointer).toEqual(2)
        })
    })

    describe('on scroll left', () => {
        test('scroll one', () => {
            this.matrix.onScrollLeft(1)

            expect(this.matrix.firstColPointer).toEqual(4)
            expect(this.matrix.firstRowPointer).toEqual(0)

            expect(getTopLeftPosition().x).toEqual(-PuzzleWidth)
        })

        test('scroll two', () => {
            this.matrix.onScrollDown(2)
            expect(this.matrix.firstColPointer).toEqual(0)
            expect(this.matrix.firstRowPointer).toEqual(2)
        })
    })
})
