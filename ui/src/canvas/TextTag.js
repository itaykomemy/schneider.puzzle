import * as PIXI from 'pixi.js'
import {DEBUG} from '../Config'
import {FontSize} from '../constants'


const selectedTextStyle = new PIXI.TextStyle({
    fontSize: FontSize + 2,
    stroke: 'blue',
    fontWeight: 'bold',
    align: 'center'
})

const normalTextStyle = new PIXI.TextStyle({
    fontWeight: 'normal',
    align: 'center',
    fontSize: FontSize
})


export class TextTag {
    constructor(x, y, container, text="") {
        this._x = x
        this._y = y

        this.textObject = new PIXI.Text(text)
        this.textObject.x = x
        this.textObject.y = y
        container.addChild(this.textObject)
        this.unselectTimeout = null
    }

    setText(text) {
        this.textObject.text = text
    }

    clear() {
        this.textObject.text = ''
        this.donor = null
    }

    getPosition() {
        return {x: this.textObject.x, y: this.textObject.y}
    }

    getDonor() {
        return this.donor
    }

    setDonor(donor, selected = false) {
        if (selected) {
            clearTimeout(this.unselectTimeout)
            this.unselectTimeout = setTimeout(() => {
                this.setDonor(donor)
            }, 5000)
        }

        if (!donor) {
            this.donor = donor
            this.textObject.text = 'Empty'
            return
        }

        this.donor = donor

        if (donor) {
            const {firstName, lastName} = donor
            if (DEBUG) {
                this.textObject.text = `${firstName} ${lastName}\n${donor.y}, ${donor.x}`
            } else {
                this.textObject.text = `${firstName} ${lastName}`
            }
        } else {
            this.textObject.text = ''
        }

        this.textObject.style = selected ? selectedTextStyle : normalTextStyle

        // TODO: align text in the middle of the puzzle piece
        // this.textObject.x = this._x - this.textObject.width / 2
        // this.textObject.y = this._y - this.textObject.height / 2
    }
}
