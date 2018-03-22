import React from 'react'
import {render} from 'react-dom'
import {injectGlobal} from 'styled-components'
import {getPage} from './api'
import App from './App'
import {JigsawWidth, PuzzleHeight, PuzzleWidth} from './constants'
import registerServiceWorker from './registerServiceWorker';

import * as PIXI from 'pixi.js'

getPage(0).then(({results}) => console.dir(results))

registerServiceWorker();

injectGlobal`
  * {
    margin: 0;
    padding: 0;
  }
  
  canvas {
    cursor: grab !important;
  }
`

const SCREEN_W = screen.width, SCREEN_H = screen.height // eslint-disable-line no-restricted-globals
console.debug('screen size', SCREEN_W, SCREEN_H)

const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: true,
    transparent: false,
    resolution: window.devicePixelRatio,
    backgroundColor: 0xffffff,
})

document.body.insertBefore(app.view, document.body.firstChild)
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
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

const horizCount = Math.ceil(SCREEN_W / PuzzleWidth),
    vertCount = Math.ceil(SCREEN_H / PuzzleHeight)

function onDragStart(event) {
    console.debug(event)
    this.isDragging = true
    this.startX = event.data.originalEvent.screenX
    this.startY = event.data.originalEvent.screenY
}

function onDragEnd(event) {
    console.debug(event)
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

        if (xZero - newstagex > PuzzleWidth * horizCount) {
            app.stage.setTransform(newstagex + PuzzleWidth * horizCount, newstagey)
        } else if (xZero - newstagex < -PuzzleWidth * horizCount) {
            app.stage.setTransform(newstagex - PuzzleWidth * horizCount, newstagey)
        } else if (yZero - newstagey > PuzzleHeight * vertCount) {
            app.stage.setTransform(newstagex, newstagey + PuzzleHeight * vertCount)
        } else if (yZero - newstagey < -PuzzleHeight * vertCount) {
            app.stage.setTransform(newstagex, newstagey - PuzzleHeight * vertCount)
        } else {
            app.stage.setTransform(newstagex, newstagey)
        }

        console.debug(
            'stage offset',
            xZero - app.stage.x,
            yZero - app.stage.y
        )
    }
}

const
    SPARE_PZL_PARTS = 10,
    TotalHorizCount = horizCount * 3 + SPARE_PZL_PARTS,
    TotalVertCount = vertCount * 3 + SPARE_PZL_PARTS

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

app.stage.x = -SCREEN_W - ((SPARE_PZL_PARTS / 2) * PuzzleWidth)
app.stage.y = -SCREEN_H - ((SPARE_PZL_PARTS / 2) * PuzzleHeight)
app.stage.interactive = true
app.stage.hitArea = new PIXI.Rectangle(0, 0, app.stage.width, app.stage.height)

const {x: xZero, y: yZero} = app.stage
console.debug('stage zero x,y:', xZero, yZero)

render(
    <App/>,
    document.getElementById('app'),
)

