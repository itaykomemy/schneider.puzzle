import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {PuzzleHeight, PuzzleWidth} from '../constants'

const _PuzzlePiece = (props) => {
    const {firstName, lastName} = props.donor
    return (
        <div className={props.className}>
            {firstName} {lastName}
        </div>
    )
}

_PuzzlePiece.propTypes = {
    donor: PropTypes.object.isRequired
}

const PuzzlePiece = styled(_PuzzlePiece)`
    display: inline-block;
    flex-grow: 1;
    flex-shrink: 0;
    width: ${PuzzleWidth}px;
    height: ${PuzzleHeight}px;
    overflow: hidden;
    text-align: center;
    vertical-align: middle;
    background: gray;
    border: 1px black solid;    
`

export default PuzzlePiece