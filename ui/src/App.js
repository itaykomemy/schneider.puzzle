import React, {Component} from 'react'
import styled from 'styled-components'

class App extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className={this.props.className} />
        );
    }
}

export default styled(App)``
