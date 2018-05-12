import * as PIXI from 'pixi.js'
import React from 'react'
import {render} from 'react-dom'
import {injectGlobal} from 'styled-components'
import App from './App'
import * as Context from './canvas/Context'
import {
    frameHeight,
    frameWidth,
    GRID_RANK,
    horizontalCapacity,
    verticalCapacity
} from './canvas/Context'
import Grid from './canvas/Grid'
import {
    JigsawWidth,
    PuzzleHeight,
    PuzzleWidth
} from './constants'
import * as DonorLoader from './DonorLoader'
import Vincent from "./canvas/Vincent";

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

Context.init(app)

document.body.insertBefore(app.view, document.body.firstChild)
app.renderer.view.style.position = "absolute"
app.renderer.view.style.display = "block"
app.renderer.autoResize = true
window.addEventListener('resize', () => app.renderer.resize(window.innerWidth, window.innerHeight))

function onDragStart(event) {
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

        const mouseDistanceX = this.startX - x
        const mouseDistanceY = this.startY - y
        this.startX = x
        this.startY = y

        // const newstagex = tsprite.tilePosition.x - mouseDistanceX
        // const newstagey = tsprite.tilePosition.y - mouseDistanceY
        //
        // tsprite.tilePosition.x = newstagex
        // tsprite.tilePosition.y = newstagey

    }
}

const
    TotalHorizCount = horizontalCapacity * 5,
    TotalVertCount = verticalCapacity * 5

// for (let i = 0; i < TotalVertCount; i++) {
//     drawRows(i * PuzzleHeight, TotalHorizCount, app.stage)
// }
//
// for (let i = 0; i < TotalHorizCount; i++) {
//     drawColumns(i * PuzzleWidth, TotalVertCount, app.stage)
// }

app.stage.x = 0
app.stage.y = 0
app.stage.interactive = true

const {x: xZero, y: yZero} = app.stage
console.debug('stage zero x,y:', xZero, yZero)

render(
    <App/>,
    document.getElementById('app'),
)

let x1 = verticalCapacity * horizontalCapacity * GRID_RANK * GRID_RANK
// const grid = new Grid()
// Context.setGrid(grid)


// const texture = app.renderer.generateTexture(c)
// const tsprite = new PIXI.extras.TilingSprite(texture)
//
// app.stage.addChild(tsprite)

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

app.stage.hitArea = new PIXI.Rectangle(0, 0, app.stage.width, app.stage.height)

const v = new Vincent(PuzzleWidth, PuzzleHeight, JigsawWidth)

v.drawPiece(app.stage, 20, 20)
