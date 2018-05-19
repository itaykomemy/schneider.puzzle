import * as PIXI from "pixi.js"
import {randValue} from "../utils";

export const DIRECTION = {
    INWARDS: -1,
    OUTWARDS: 1
}

export const COLORS = [
    0x898DBA,
    0x7EC397,
    0xBEACC4,
    0xFBCACE,
    0xE08187,
    0xFDE88D,
]

export class VanGauche {
    constructor(pw, ph, jigsaw) {
        this.pw = pw
        this.ph = ph
        this.jigsaw = jigsaw
        this.hLineLength = pw / 2 - jigsaw / 2
        this.vLineLength = ph / 2 - jigsaw / 2

        const Q_BEND = 15;
        const J_GRAV = 30;

        //
        // instruction is [toX. toY, drawing function: (PIXI.Graphics, fromX, fromY, toX, toY, direction of the tooth) => nothing]
        const inst = [
            [this.hLineLength, 0,
                (g, fromx, fromy, tox, toy, direction) =>
                    g.quadraticCurveTo(this.hLineLength, direction * Q_BEND, this.hLineLength, 0)
            ],

            [this.jigsaw, 0,
                (g, fromx, fromy, tox, toy, direction) =>
                    g.bezierCurveTo(fromx - J_GRAV, fromy - direction * J_GRAV, tox + J_GRAV, toy - direction * J_GRAV, tox, toy)
            ],

            [this.hLineLength, 0,
                (g, fromx, fromy, tox, toy, direction) =>
                    g.quadraticCurveTo(fromx, fromy + direction * Q_BEND, tox, toy)
            ],


            [0, this.vLineLength, (g, fromx, fromy, tox, toy, direction) =>
                g.quadraticCurveTo(tox - direction * Q_BEND, toy, tox, toy)],

            [0, this.jigsaw, (g, fromx, fromy, tox, toy, direction) =>
                g.bezierCurveTo(fromx + direction * J_GRAV, fromy - J_GRAV, tox + direction * J_GRAV, toy + J_GRAV, tox, toy)],

            [0, this.vLineLength, (g, fromx, fromy, tox, toy, direction) =>
                g.quadraticCurveTo(fromx - direction * Q_BEND, fromy, tox, toy)],


            [-this.hLineLength, 0, (g, fromx, fromy, tox, toy, direction) =>
                g.quadraticCurveTo(tox, toy - direction * Q_BEND, tox, toy)],
            [-this.jigsaw, 0, (g, fromx, fromy, tox, toy, direction) =>
                g.bezierCurveTo(fromx + J_GRAV, fromy + direction * J_GRAV, tox - J_GRAV, toy + direction * J_GRAV, tox, toy)],
            [-this.hLineLength, 0, (g, fromx, fromy, tox, toy, direction) =>
                g.quadraticCurveTo(fromx, fromy - direction * Q_BEND, tox, toy)],

            [0, -this.vLineLength, (g, fromx, fromy, tox, toy, direction) =>
                g.quadraticCurveTo(tox + direction * Q_BEND, toy, tox, toy)
            ],
            [0, -this.jigsaw, (g, fromx, fromy, tox, toy, direction) =>
                g.bezierCurveTo(fromx - direction * J_GRAV, fromy + J_GRAV, tox - direction * J_GRAV, toy - J_GRAV, tox, toy)],
            [0, -this.vLineLength, (g, fromx, fromy, tox, toy, direction) =>
                g.quadraticCurveTo(fromx + direction * Q_BEND, fromy, tox, toy)]
        ]

        // converting the instructions coordinates to be continuous
        this.instructions = inst.reduce(
            (acc, cur, index) => {
                const [x, y] = acc[index - 1] || [0, 0]
                acc.push([x + cur[0], y + cur[1], cur[2]])
                return acc
            }, [])
    }

    // Draws a puzzle piece at x, y filled with colors
    drawPiece(container, x, y, color, directions) {
        const g = new PIXI.Graphics()
        g.lineStyle(2.5, 0xFFFFFF, 1.0)
        g.moveTo(0, 0)
        g.beginFill(color)

        this.instructions.forEach(([tox, toy, func], index) => {
            const [fromx, fromy] = this.instructions[index - 1] || [0, 0]
            const direction = directions[Math.floor(index / 3)];
            func(g, fromx, fromy, tox, toy, direction)
        })

        g.endFill()

        g.x = x
        g.y = y

        container.addChild(g)
    }

    drawPuzzle(container, x, y, width, height, space = 0) {
        for (let j = 0; j < height; j++) {
            for (let i = 0; i < width; i++) {
                const x1 = x + i * this.pw + space * i;
                const top = i % 2 ? DIRECTION.INWARDS : DIRECTION.OUTWARDS,
                    bottom = i % 2 ? DIRECTION.OUTWARDS : DIRECTION.INWARDS,
                    right = j % 2 ? DIRECTION.OUTWARDS : DIRECTION.INWARDS,
                    left = j % 2 ? DIRECTION.INWARDS : DIRECTION.OUTWARDS

                let color
                const y1 = y + j * this.ph + space * j;
                if (j === 0 && i === 0 || // top left
                    j === height - 1 && i === width - 1 || // bottom right
                    i === 0 && j === height - 1 || // top right
                    i === width - 1 && j === 0) { // bottom left
                    color = COLORS[0]
                } else if (j === 0 || j === height - 1) {
                    color = COLORS[i % COLORS.length]
                } else if (i === 0 || i === width - 1) {
                    color = COLORS[j % COLORS.length]
                } else {
                    color = randValue(COLORS);
                }

                this.drawPiece(container, x1, y1, color, [
                    top, right, bottom, left
                ])
            }
        }
    }
}


const randDirection = () => randValue([DIRECTION.INWARDS, DIRECTION.OUTWARDS])
