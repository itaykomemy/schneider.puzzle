import React, {Component} from 'react'
import styled from 'styled-components'
import Layout from './components/Layout'

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            layouts: [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8]
            ]
        }
    }

    render() {
        return (
            <div className={this.props.className}>
                {
                    this.state.layouts.map((row, i) =>
                        row.map((batch, j) =>
                            <Layout key={batch}
                                    batch={batch}
                                    x={(j - 1) * window.innerWidth}
                                    y={(i - 1) * window.innerHeight}/>
                        )
                    )
                }
            </div>
        );
    }
}

export default styled(App)`
  position: fixed;
  top:0;
  right:0;
  bottom:0;
  left:0;
  //transform: scale(.9);
  //transform-origin: center;
`


