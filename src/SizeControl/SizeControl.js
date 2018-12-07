import React, { Component } from 'react';
import './SizeControl.css';

class SizeControl extends Component {
  /*state = {
    isDragging: false,
  };*/

  constructor(props) {
    super(props);
    this.control = React.createRef();
  }

  handleMouseDown = e => {
    e.stopPropagation();
    this.props.onStartDragging(e, this.props.coordinates.x1, this.props.coordinates.x2, this.props.coordinates.y1, this.props.coordinates.y2);
  };

  render() {
    return (
      <div
        ref={this.control}
        className="draggable-rect"
        style={this.props.style}
        onMouseDown={this.handleMouseDown}
      />
    );
  }
}

export default SizeControl;
