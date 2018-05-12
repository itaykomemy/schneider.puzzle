import * as PIXI from "pixi.js"
import {
    JigsawWidth,
    PuzzleHeight,
    PuzzleWidth
} from '../constants'

const COLORS = [
    "#BEACC4",
    0x898DBA,
    "#7EC397",
    "#FBCACE",
    "#E08187",
    "#FDE88D",
]

const G = PIXI.Graphics

const Rect = new G().drawRect(0, 0, 10, 10)

class Bezier {

}

class Quad {

}

export default class Vincent {
    constructor(pw, ph, jigsaw) {
        this.pw = pw
        this.ph = ph
        this.jigsaw = jigsaw
        this.hLineLength = pw / 2 - jigsaw / 2
        this.vLineLength = ph / 2 - jigsaw / 2

        const inst = [
            [this.hLineLength, 0],
            [this.jigsaw, 0],
            [this.hLineLength, 0],

            [0, this.vLineLength],
            [0, this.jigsaw],
            [0, this.vLineLength],

            [-this.hLineLength, 0],
            [-this.jigsaw, 0],
            [-this.hLineLength, 0],

            [0, -this.vLineLength],
            [0, -this.jigsaw],
            [0, -this.vLineLength],
        ]

        this.instructions = inst.reduce(
            (acc, cur, index) => {
                const [x, y] = acc[index - 1] || [0, 0]
                acc.push([x + cur[0], y + cur[1]])
                return acc
            }, [])
    }


    drawPuzzle(container, x, y, pconfig) {
        const [top, right, bottom, left] = pconfig

    }

    drawPiece(container, x, y) {
        const {pw, ph, jigsaw} = this


        const g = new G()

        const direction = 1
        g.moveTo(x, y)
        g.beginFill(COLORS[1])
        this.instructions.forEach(([x, y], index) => {

        })
        g.endFill()

        // g.quadraticCurveTo(x + hLineLength, y + direction *  20, x + hLineLength, y)
        // g.bezierCurveTo(x + hLineLength + direction * 30)


        container.addChild(g)
    }
}

const style = (g) => g.lineStyle(2.5, lineColor, 1.0)

const drawPuzzleSide = (length, jigsawWidth) => {
    // X coordinate is constant 0
    const lineLength = length / 2 - jigsawWidth / 2
    const cYOffset = 30, cXOffset = 30

    const g = new G()
    style(g)

    g.moveTo(0, 0)

    let currentY = 0,
        nextY = currentY + lineLength

    g.quadraticCurveTo(-20, nextY, 0, nextY)

    currentY = nextY
    nextY = currentY + jigsawWidth
    g.bezierCurveTo(cXOffset, currentY - cYOffset, cXOffset, nextY + cYOffset, 0, nextY)

    currentY = nextY
    nextY = currentY + lineLength
    g.quadraticCurveTo(-20, currentY, 0, nextY)

    return g
}

const lineColor = 0xccccb3

const verticalPzSize = drawPuzzleSide(PuzzleHeight, JigsawWidth)
const horizontalPzSide = drawPuzzleSide(PuzzleWidth, JigsawWidth)
