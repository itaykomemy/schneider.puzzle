import React, {Component} from 'react'
import styled from 'styled-components'
import MainDialog from './components/MainDialog'
import Menu from './components/Menu'

class App extends Component {
    constructor() {
        super()
        this.state = {dialogVisible: true}
    }

    closeDialog = () => {
        this.setState({dialogVisible: false})
    }

    openDialog = () => {
        this.setState({dialogVisible: true})
    }

    render() {
        return (
            <div className={this.props.className}>
                <div className="menu-positioner">
                    <Menu onSearchClickHandler={this.openDialog}/>
                </div>
                <MainDialog visible={this.state.dialogVisible} onClose={this.closeDialog}/>
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
  pointer-events: none;
  
  .menu-positioner {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 50px;
  }
`
