export default class MockTextTag {
    constructor(x, y, container, text) {
        this.textObject = {x, y, text}
    }

    getPosition() {
        return {x: this.textObject.x, y: this.textObject.y}
    }
}
