import React, {Component} from 'react'
import styled from 'styled-components'
import Menu from './components/Menu'

class App extends Component {
    render() {
        return (
            <div className={this.props.className}>
                <div className="menu-position">
                    <Menu />
                </div>
            </div>
        );
    }
}

export default styled(App)`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events:none;
  
  .menu-position {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 33%;
    background-color: white;
  }
`
