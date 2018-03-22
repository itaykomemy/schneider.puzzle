import React, {Component} from 'react';
import styled from 'styled-components'

class Menu extends Component {
    static propTypes = {};
    static defaultProps = {}

    render() {
        return (
            <div className={this.props.className}>
                <input type="text" placeholder="חפש"/>
            </div>
        );
    }
}


export default styled(Menu)`
  height: 2em;
  line-height: 2em;
  box-shadow: gray 1px 1px 1px  1px;
  input {
    border: none;
    pointer-events: all;
    height: 100%;
    width: 100%;
  }   
`
