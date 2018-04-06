import * as PIXI from 'pixi.js'
import {FontSize} from '../constants'


export class DonorTag {

    constructor(x, y, container) {
        this._x = x
        this._y = y

        this.textObject = new PIXI.Text("", {align: 'center', fontSize: FontSize})

        container.addChild(this.textObject)
    }

    clear() {
        this.textObject.text = ''
    }

    setDonor(donor) {
        this._donor = donor
        this.firstName = donor.firstName
        this.lastName = donor.lastName
        this.id = donor.id
        this.serial = donor.serial

        this.textObject.text = `${this.firstName} ${this.lastName}\n${this.serial}`

        this.textObject.x = this._x - this.textObject.width / 2
        this.textObject.y = this._y - this.textObject.height / 2
    }
}
