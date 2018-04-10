import React from 'react'
import styled from 'styled-components'


export default styled.button`
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1.5em;
  ${
    ({raised}) => raised ?
    `
        background: blue;
        color: white;
        box-shadow: black 1px 1px 3px;
        height: 2em;
        line-height: 2em;
        padding: 0 0.5em;
    ` : ''
    }
`
