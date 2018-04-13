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

const G = PIXI.Graphics

const lineColor = 0xccccb3
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

const verticalPzSize = drawPuzzleSide(PuzzleHeight, JigsawWidth)
const horizontalPzSide = drawPuzzleSide(PuzzleWidth, JigsawWidth)

const drawColumns = (x, count, container) => {
    for (let i = 0; i < count; i++) {
        const p = verticalPzSize.clone()
        p.pivot = new PIXI.Point(0, 0)
        p.y = PuzzleHeight * i
        p.x = x
        const direction = Math.round(Math.random())
        p.rotation = direction ? Math.PI : 0

        if (direction) {
            p.y += PuzzleHeight
        }

        container.addChild(p)
    }
}

const drawRows = (y, count, container) => {
    for (let i = 0; i < count; i++) {
        const p = horizontalPzSide.clone()
        p.pivot = new PIXI.Point(0, 0)
        p.rotation = -Math.PI / 2
        p.y = y
        p.x = PuzzleWidth * i
        container.addChild(p)
    }
}

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

        const newstagex = app.stage.localTransform.tx - mouseDistanceX
        const newstagey = app.stage.localTransform.ty - mouseDistanceY

        if (xZero - newstagex > frameWidth * 2) {
            app.stage.setTransform(newstagex + frameWidth * 2, newstagey)
            grid.resetRight()
        } else if (xZero - newstagex < -frameWidth * 2) {
            app.stage.setTransform(newstagex - frameWidth * 2, newstagey)
            grid.resetLeft()
        } else if (yZero - newstagey > frameHeight * 2) {
            app.stage.setTransform(newstagex, newstagey + frameHeight * 2)
            grid.resetDown()
        } else if (yZero - newstagey < -frameHeight * 2) {
            app.stage.setTransform(newstagex, newstagey - frameHeight * 2)
            grid.resetUp()
        } else {
            app.stage.setTransform(newstagex, newstagey)
        }
    }
}

const
    TotalHorizCount = horizontalCapacity * 5,
    TotalVertCount = verticalCapacity * 5

for (let i = 0; i < TotalVertCount; i++) {
    drawRows(i * PuzzleHeight, TotalHorizCount, app.stage)
}

for (let i = 0; i < TotalHorizCount; i++) {
    drawColumns(i * PuzzleWidth, TotalVertCount, app.stage)
}

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

app.stage.x = -2 * frameWidth
app.stage.y = -2 * frameHeight
app.stage.interactive = true
app.stage.hitArea = new PIXI.Rectangle(0, 0, app.stage.width, app.stage.height)

const {x: xZero, y: yZero} = app.stage
console.debug('stage zero x,y:', xZero, yZero)

render(
    <App/>,
    document.getElementById('app'),
)

const donorsPromise = DonorLoader.fetchDonors(verticalCapacity * horizontalCapacity * GRID_RANK * GRID_RANK)
const grid = new Grid()

const size = verticalCapacity * horizontalCapacity
donorsPromise.then(({count, results}) => {
    // reserve the first batch of donors for the center frame
    let start = size
    grid.traverse((frame, i, j) => {
        // put the first batch of the donors on the center frame
        if (i === 2 && j === 2) {
            frame.render(results.slice(0, size))
        } else {
            const end = start + size
            frame.render(results.slice(start, end))
            start = end > count ? 0 : end
        }
    })
})
