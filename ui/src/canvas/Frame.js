import * as PIXI from 'pixi.js'
import {DEBUG} from '../Config'
import {PuzzleHeight, PuzzleWidth} from '../constants'
import * as Context from './Context'
import {horizontalCapacity, verticalCapacity} from './Context'
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

    clear() {
        this.tags.forEach(t => t.clear())
    }

    loadNext() {
        DonorLoader.fetchDonors(horizontalCapacity * verticalCapacity).then(
            ({results}) => this.render(results)
        )
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
