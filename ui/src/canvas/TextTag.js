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
        container.addChild(this.textObject)
        this.unselectTimeout = null
        this._onTextChange()
    }

    setText(text) {
        this.textObject.text = text
        this._onTextChange()
    }

    clear() {
        this.textObject.text = ''
        this.donor = null
        this.onTouchEnd = {}
    }

    getPosition() {
        return {x: this._x, y: this._y}
    }

    setPosition(x , y) {
        if (x !== undefined)
            this._x = x
        if (y !== undefined)
            this._y = y
        this._onTextChange()
    }

    changePositionBy(dx, dy) {
        this._x += dx
        this._y += dy
        this._onTextChange()
    }

    getDonor() {
        return this.donor
    }

    _onTextChange() {
        this.textObject.x = this._x - this.textObject.width / 2
        this.textObject.y = this._y - this.textObject.height / 2
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
            this.textObject.text = ''
            this._onTextChange()
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
        this._onTextChange()
    }
}
