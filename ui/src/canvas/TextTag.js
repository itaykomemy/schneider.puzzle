import * as PIXI from 'pixi.js'
import {FontSize} from '../constants'


export class TextTag {

    constructor(x, y, container) {
        this._x = x
        this._y = y

        this.textObject = new PIXI.Text("", {align: 'center', fontSize: FontSize})

        container.addChild(this.textObject)
    }

    setText(text) {
        this.textObject.text = text
    }

    clear() {
        this.textObject.text = ''
    }

    setDonor(donor) {
        const {firstName, lastName, serial} = donor

        this.textObject.text = `${firstName} ${lastName}\n${serial}`

        this.textObject.x = this._x - this.textObject.width / 2
        this.textObject.y = this._y - this.textObject.height / 2
    }
}
