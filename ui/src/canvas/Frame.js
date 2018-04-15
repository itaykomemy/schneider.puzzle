import * as PIXI from 'pixi.js'
import {DEBUG} from '../Config'
import {
    PuzzleHeight,
    PuzzleWidth
} from '../constants'
import * as Context from './Context'
import {
    horizontalCapacity,
    verticalCapacity
} from './Context'
import {TextTag} from './TextTag'
import * as DonorLoader from '../DonorLoader'

export default class Frame {
    constructor(zerox, zeroy) {
        this.zerox = zerox
        this.zeroy = zeroy
        this.container = new PIXI.Container()
        this.container.x = zerox
        this.container.y = zeroy
        this.tags = []
        const stage = Context.getStage()
        for (let i = 0; i < horizontalCapacity; i++) {
            for (let j = 0; j < verticalCapacity; j++) {
                this.tags.push(
                    new TextTag(
                        PuzzleWidth * i + PuzzleWidth / 2,
                        PuzzleHeight * j + PuzzleHeight / 2,
                        this.container
                    ))
            }
        }
        stage.addChild(this.container)

        if (DEBUG) {
            const t = new TextTag(0, 0, this.container)
            t.setText(`Frame ${this.zerox} ${this.zeroy}`)
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

    moveDonorsToFrame(recepientFrame) {
        recepientFrame.render(this.data)
        this.clear()
    }

    selectDonor(donor) {
        const baseIndex = verticalCapacity * horizontalCapacity / 2
        const vrand = Math.ceil(4 * Math.random() - 2)
        const hrand = Math.ceil(4 * Math.random() - 2)
        const index = Math.floor(baseIndex + vrand + (verticalCapacity * hrand))
        const tag = this.tags[index]

        return this.loadNext().then(() => {
            tag.setDonor(donor, true)
            return {x: tag._x, y: tag._y}
        })
    }

    clear() {
        this.tags.forEach(t => t.clear())
    }

    loadNext() {
        return DonorLoader.fetchDonors(horizontalCapacity * verticalCapacity)
            .then(({results}) => this.render(results))
    }

    render(donors) {
        this.data = donors
        donors.forEach((donor, i) => {
            const tag = this.tags[i]
            if (tag) {
                tag.setDonor(donor)
            }
        })
    }
}
