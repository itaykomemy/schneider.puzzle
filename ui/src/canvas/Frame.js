import {PuzzleHeight, PuzzleWidth} from '../constants'
import * as Context from './Context'
import {horizontalCapacity, verticalCapacity} from './Context'
import {DonorTag} from './DonorTag'

export default class Frame {
    constructor(zerox, zeroy) {
        this.zerox = zerox
        this.zeroy = zeroy

        this.tags = []
        const stage = Context.getStage()
        for (let i = 0; i < horizontalCapacity; i++) {
            for (let j = 0; j < verticalCapacity; j++) {
                this.tags.push(
                    new DonorTag(
                        -this.zerox + PuzzleWidth * i + PuzzleWidth / 2,
                        -this.zeroy + PuzzleHeight * j + PuzzleHeight / 2,
                        stage
                    ))
            }
        }
    }

    render(donors) {
        donors.forEach((donor, i) => {
            const tag = this.tags[i]
            if (tag) {
                tag.setDonor(donor)
            }
        })
    }
}