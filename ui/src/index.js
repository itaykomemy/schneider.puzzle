import * as PIXI from 'pixi.js'
import React from 'react'
import {render} from 'react-dom'
import {injectGlobal} from 'styled-components'
import {fetchMetaData} from './api'
import App from './App'
import Frame from "./canvas/Frame"
import * as Vincent from "./canvas/Vincent"
import {
    JigsawWidth,
    PuzzleHeight,
    PuzzleWidth
} from './constants'

injectGlobal`
  body {
    font-family: 'Assistant', sans-serif;
  }

  * {
    margin: 0;
    padding: 0;
  }
  
  canvas {
    cursor: grab !important;
  }
  
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}
`

const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: true,
    transparent: false,
    resolution: window.devicePixelRatio,
    backgroundColor: 0xffffff,
})

document.body.insertBefore(app.view, document.body.firstChild)
app.renderer.view.style.position = "absolute"
app.renderer.view.style.display = "block"
app.renderer.autoResize = true
window.addEventListener('resize', () => app.renderer.resize(window.innerWidth, window.innerHeight))

render(
    <App/>,
    document.getElementById('app'),
)

const NUM_ROWS = 21
const NUM_COLS = 21

const v = new Vincent.VanGauche(PuzzleWidth, PuzzleHeight, JigsawWidth)
const c = new PIXI.Container()
v.drawPuzzle(c, 0, 0, NUM_COLS, NUM_ROWS, 0)
const rect = new PIXI.Rectangle(PuzzleWidth, PuzzleHeight, (NUM_COLS - 1) * PuzzleWidth, (NUM_ROWS - 1) * PuzzleHeight)
const texture = app.renderer.generateTexture(c, PIXI.SCALE_MODES.LINEAR, 2)
texture.frame = rect
texture._updateUvs()

const tsprite = new PIXI.extras.TilingSprite(texture, window.screen.width, window.screen.height)
tsprite.x = 0
tsprite.y = 0

app.stage.addChild(tsprite)
app.stage.hitArea = new PIXI.Rectangle(0, 0, app.stage.width, app.stage.height)

async function start() {
    const xspeed = 2
    const yspeed = 1.5
    let animate = true

    const {
        x: {min: minX, max: maxX},
        y: {min: minY, max: maxY}
    } = await fetchMetaData()

    const frame = new Frame(
        app.stage,
        30, 15,
        NUM_ROWS, NUM_COLS,
        [Math.floor((minX + maxX) / 2), Math.floor((minY + maxY) / 2)],
        [minY, maxX, maxY, minX]
    )

    function onDragStart(event) {
        animate = false
        this.isDragging = true
        this.startX = event.data.originalEvent.screenX
        this.startY = event.data.originalEvent.screenY
    }

    function onDragEnd(event) {
        this.isDragging = false
    }

    function onDragMove(event) {
        if (this.isDragging) {
            const x = event.data.originalEvent.screenX,
                y = event.data.originalEvent.screenY

            const dx = this.startX - x
            const dy = this.startY - y
            this.startX = x
            this.startY = y

            tsprite.tilePosition.x -= dx
            tsprite.tilePosition.y -= dy

            frame.addDelta(-dx, -dy)
        }
    }


    app.stage.interactive = true
    app.stage
        .on('mousedown', onDragStart)
        .on('pointerdown', onDragStart)
        .on('touchstart', onDragStart)
        .on('mouseup', onDragEnd)
        .on('mouseupoutside', onDragEnd)
        .on('touchend', onDragEnd)
        .on('touchendoutside', onDragEnd)
        .on('mousemove', onDragMove)
        .on('touchmove', onDragMove)

    app.ticker.add(function (time) {
        if (animate) {
            const dx = time * xspeed
            const dy = time * yspeed
            tsprite.tilePosition.x += dx
            tsprite.tilePosition.y += dy
            frame.addDelta(dx, dy)
        }
    })
}

start()
