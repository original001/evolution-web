import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export default class AnimalTraitArrowMarker extends Component {
  componentDidMount() {
    const markerNode = ReactDOM.findDOMNode(this);
    const {markerSize} = this.props;

    markerNode.setAttribute('markerWidth', markerSize);
    markerNode.setAttribute('markerHeight', markerSize);
    markerNode.setAttribute('refX', 0);
    markerNode.setAttribute('refY', markerSize / 2);
    markerNode.setAttribute('orient', 'auto-start-reverse');
  }

  render() {
    const {id, markerSize, className} = this.props;
    return <marker id={id} ref={(e) => this.marker = e}>
      <path d={`M0,0 L0,${markerSize} L${markerSize / 4 * 3},${markerSize / 2} z`}
            className={'Marker ' + className}/>
    </marker>
  }
}