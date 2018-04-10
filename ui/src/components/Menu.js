import React, {Component} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Button from './Button'

class Menu extends Component {
    static propTypes = {
        onSearchClickHandler: PropTypes.func.isRequired
    }

    static defaultProps = {}

    render() {
        return (
            <div className={this.props.className}>
                <Button onClick={this.props.onSearchClickHandler}>&#x1f50d;</Button>
            </div>
        );
    }
}


export default styled(Menu)`
  height: 2em;
  line-height: 2em;
  pointer-events: all;
  :hover {
    transform: scale(1.2);
    transition: transform 50ms linear;
  }
`
