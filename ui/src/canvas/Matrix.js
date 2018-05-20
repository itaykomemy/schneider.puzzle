export default class Matrix {
    constructor(width, height, generator) {
        this.width = width
        this.height = height
        this.rows = []
        this.cols = []

        for (let i = 0; i < height; i++) {
            this.rows[i] = []
            for (let j = 0; j < width; j++) {
                const item = generator(i, j)
                this.rows[i].push(item)
            }
        }

        for (let j = 0; j < width; j++) {
            this.cols[j] = []
            for (let i = 0; i < height; i++) {
                this.cols[j].push(this.rows[i][j])
            }
        }
    }

    getRow(i) {
        return this.rows[i]
    }

    getColumn(j) {
        return this.cols[j]
    }
}