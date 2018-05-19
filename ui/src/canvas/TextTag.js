import * as PIXI from 'pixi.js'
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
    constructor(x, y, container) {
        this._x = x
        this._y = y

        this.textObject = new PIXI.Text("")
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

        const {firstName, lastName} = donor
        this.donor = donor
        this.textObject.text = `${firstName} ${lastName}`

        this.textObject.style = selected ? selectedTextStyle : normalTextStyle

        this.textObject.x = this._x - this.textObject.width / 2
        this.textObject.y = this._y - this.textObject.height / 2
    }
}
