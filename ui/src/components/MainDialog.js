import React, {Component} from 'react'

import styled from 'styled-components'
import {fetchDonorBySerial} from '../api'
import * as Context from '../canvas/Context'
import Button from './Button'
import Input from './Input'

const strings = require('../strings/dialog.he.json')

class MainDialog extends Component {
    static propTypes = {}
    static defaultProps = {}

    constructor() {
        super()
        this.state = {}
    }

    componentDidMount() {
        this.input.focus()
    }

    onSubmit = (e) => {
        e.preventDefault()
        this.setState({error: null})
        fetchDonorBySerial(this.input.value)
            .then((res) => {
                if (res.status === 200) {
                    this.setState({error: null})
                    res.json().then(donor => {
                        Context.getGrid().selectDonor(donor)
                        this.props.onClose()
                    })
                } else {
                    this.setState({error: this.input.value})
                }
            })
    }

    onClose = (e) => {
        e.stopPropagation()
        this.props.onClose()
    }

    render() {
        return (
            <div onClick={this.onClose} className={this.props.className}>
                <div className="dialog" onClick={e => e.stopPropagation()}>
                    <Button className="close" onClick={this.onClose}>X</Button>
                    <section>
                        <h3>
                            {strings.welcome}
                        </h3>
                    </section>

                    <form onSubmit={this.onSubmit}>
                        <section>
                            <Input
                                innerRef={el => this.input = el}
                                type="number"
                                name="serial"
                                placeholder={strings.inputPlaceholder}
                                autofocus/>
                        </section>
                        <section>
                            {this.state.error && <span>{this.state.error} {strings.notfound}</span>}
                        </section>
                        <section style={{"textAlign": "center"}}>
                            <Button raised>{strings.search}</Button>
                        </section>
                    </form>
                </div>
            </div>
        )
    }
}


export default styled(MainDialog)`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: ${props => props.visible ? "block" : "none"};
  background: rgba(255, 255, 255, 0.75);
  pointer-events: all;
  
  section {
    margin-bottom: 1em;
  }
  
  .dialog {
    position: relative;
    width: 30%;
    margin: 20vh auto 0 auto; 
    background: white;
    padding: 2em 1em 1em 1em;
    box-shadow: black 1px 1px 1px;
    
    .close {
      position: absolute;
      top: 5px;
      left: 5px;
      font-size: 1em;
    }
  }
`
