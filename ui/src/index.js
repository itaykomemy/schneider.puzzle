/* global PIXI */
import {injectGlobal} from 'styled-components'
import {PuzzleHeight, PuzzleWidth} from './constants'
import registerServiceWorker from './registerServiceWorker';

require('pixi.js')

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

const pWidth = 100, pHeight = 100,
    jigsawWidth = 20

const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: true,
    transparent: false,
    resolution: 1,
    backgroundColor: 0xffffff,
})

document.body.insertBefore(app.view, document.body.firstChild)
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

const G = PIXI.Graphics

const style = (g) => g.lineStyle(2.5, 0xccccb3, 1.0)

const getSide = (length, jigsawWidth) => {
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

const side = getSide(PuzzleHeight, jigsawWidth)
const top = getSide(PuzzleWidth, jigsawWidth)

const createColumn = (x) => {
    for (let i = 0; i < 10; i++) {
        const p = side.clone()
        p.pivot = new PIXI.Point(0, PuzzleHeight/2)
        p.y = PuzzleHeight * i
        p.x = x
        p.rotation = Math.round(Math.random()) ? Math.PI : 0
        app.stage.addChild(p)
    }
}

const createRow = (y) => {
    for (let i = 0; i < 10; i++) {
        const p = top.clone()
        p.pivot = new PIXI.Point(0, 0)
        p.rotation = -Math.PI / 2
        p.y = y
        p.x = PuzzleWidth * i
        app.stage.addChild(p)
    }
}

for (let i = 0; i < 20; i++) {
    createColumn(i * PuzzleWidth)
}

for (let i = 0; i < 20; i++) {
    createRow(i * PuzzleHeight + PuzzleHeight / 2)
}

app.stage.interactive = true
app.stage.interactiveChildren = false
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

app.stage.setTransform(0, 0)

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

        const offsetX = this.startX - x
        const offsetY = this.startY - y
        this.startX = x
        this.startY = y

        app.stage.setTransform(
            app.stage.localTransform.tx - offsetX,
            app.stage.localTransform.ty - offsetY
        )
    }
}

const hello = new PIXI.Text()

app.stage.addChild(hello)
