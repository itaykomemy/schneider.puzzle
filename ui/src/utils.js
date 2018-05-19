/* Randomization Utils */

export const randInt = (from, upto) => Math.floor(Math.random() * (upto - from) + from)
export const randValue = (values) => values[randInt(0, values.length)]
