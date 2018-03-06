import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components'
import * as api from '../api'
import PuzzlePiece from './PuzzlePiece'

// A Layout is laying out groups of Puzzle Pieces
class Layout extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }

    static propTypes = {
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        batch: PropTypes.number.isRequired,
    };

    static defaultProps = {};

    componentDidMount() {
        api.getPage(this.props.batch)
            .then(({results}) => this.setState({data: results}))
    }

    render() {
        return (
            <div className={this.props.className}>
                {
                    this.state.data.map(d =>
                        <PuzzlePiece donor={d} key={d.id}/>
                    )
                }
            </div>
        );
    }
}

export default styled(Layout)`
  position: absolute;
  transition: top 100ms ease, left 100ms ease;
  top: ${props => props.y}px;
  left: ${props => props.x}px;
  width: 100vw;
  height: 100vh; 
  display: flex;
  flex-flow: row wrap;
  justify-content: start;
`
