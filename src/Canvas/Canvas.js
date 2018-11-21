import React, { Component } from 'react';
import './Canvas.css';
import SizeControl from '../SizeControl/SizeControl';

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
  }

  state = {
    startPoint: null,
    endPoint: null,
    isDrawing: false,
    isDragging: false,
    affectedCoordinates: null,
    selectedImage: null,
  };

  handleImageUpload = e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      this.setState({ selectedImage: reader.result });
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
    }
  };

  handleMouseDown = e => {
    const canvasCoordinates = this.canvas.current.getBoundingClientRect();

    this.setState({
      startPoint: {
        x: e.clientX - canvasCoordinates.left,
        y: e.clientY - canvasCoordinates.top,
      },
      endPoint: {
        x: e.clientX - canvasCoordinates.left,
        y: e.clientY - canvasCoordinates.top,
      },
      isDrawing: true,
    });
  };

  handleMouseMove = e => {
    if (this.state.isDrawing && this.state.startPoint) {
      const canvasCoordinates = this.canvas.current.getBoundingClientRect();
      this.setState({
        endPoint: {
          x: Math.abs(e.clientX - canvasCoordinates.left),
          y: Math.abs(e.clientY - canvasCoordinates.top),
        },
      });
    }
  };

  handleMouseUp = () => {
    if (this.state.startPoint) {
      this.setState({
        isDrawing: false,
      });
    }
  };

  handleStartDragging = (e, x1, x2, y1, y2) => {
    this.setState({
      isDragging: true,
      affectedCoordinates: {
        x1,
        x2,
        y1,
        y2,
      },
    });
  };

  handleControlDrag = e => {
    const canvasCoordinates = this.canvas.current.getBoundingClientRect();
    e.persist();
    this.setState(prevState => ({
      startPoint: {
        x: this.state.affectedCoordinates.x1
          ? Math.abs(e.clientX - canvasCoordinates.left)
          : prevState.startPoint.x,
        y: this.state.affectedCoordinates.y1
          ? Math.abs(e.clientY - canvasCoordinates.top)
          : prevState.startPoint.y,
      },
      endPoint: {
        x: this.state.affectedCoordinates.x2
          ? Math.abs(e.clientX - canvasCoordinates.left)
          : prevState.endPoint.x,
        y: this.state.affectedCoordinates.y2
          ? Math.abs(e.clientY - canvasCoordinates.top)
          : prevState.endPoint.y,
      },
    }));
  };

  handleStopDragging = () => {
    this.setState({
      isDragging: false,
    });
  };

  render() {
    const { startPoint, endPoint } = this.state;
    const canvasWidth = this.canvas.current && this.canvas.current.offsetWidth;
    const canvasHeight = this.canvas.current && this.canvas.current.offsetHeight;
    const rightCoordinates = startPoint
      ? {
          top: `${startPoint.y}px`,
          left: `${startPoint.x}px`,
          transform: `translate(${-50}%, ${-50}%)`,
        }
      : null;

    const rightBottomControl = startPoint
      ? {
          top: `${endPoint.y}px`,
          left: `${endPoint.x}px`,
          transform: `translate(${-50}%, ${-50}%)`,
        }
      : null;

    const draggableRectLeft = startPoint
      ? {
          top: `${(endPoint.y + startPoint.y) / 2}px`,
          left: `${startPoint.x}px`,
          transform: `translate(${0}%, ${-50}%)`,
        }
      : null;

    const draggableRectTop = startPoint
      ? {
          top: `${startPoint.y}px`,
          left: `${(endPoint.x + startPoint.x) / 2}px`,
          transform: `translate(${-50}%, ${0}%)`,
        }
      : null;

    const draggableRectBottom = startPoint
      ? {
          top: `${endPoint.y}px`,
          left: `${(endPoint.x + startPoint.x) / 2}px`,
          transform: `translate(${-50}%, ${-100}%)`,
        }
      : null;

    const topRectangleStyle = startPoint
      ? {
          height: endPoint.y < startPoint.y ? `${endPoint.y}px` : `${startPoint.y}px`,
          width: `${Math.abs(endPoint.x - startPoint.x)}px`,
          left: endPoint.x < startPoint.x ? `${endPoint.x}px` : `${startPoint.x}px`,
        }
      : null;

    const bottomRectangleStyle = startPoint
      ? {
          left: endPoint.x < startPoint.x ? `${endPoint.x}px` : `${startPoint.x}px`,
          width: `${Math.abs(endPoint.x - startPoint.x)}px`,
          height:
            endPoint.y < startPoint.y
              ? `${canvasHeight - startPoint.y}px`
              : `${canvasHeight - endPoint.y}px`,
          top: endPoint.y < startPoint.y ? `${startPoint.y}px` : `${endPoint.y}px`,
        }
      : null;

    const leftRectangleStyle = startPoint
      ? {
          width: endPoint.x < startPoint.x ? `${endPoint.x}px` : `${startPoint.x}px`,
        }
      : null;

    const rightRectangleStyle = startPoint
      ? {
          width:
            endPoint.x < startPoint.x
              ? `${canvasWidth - startPoint.x}px`
              : `${canvasWidth - endPoint.x}px`,
          left: endPoint.x < startPoint.x ? `${startPoint.x}px` : `${endPoint.x}px`,
        }
      : null;

    const coord = {
      x1: 'x1',
      x2: 'x2',
      y1: 'y1',
      y2: 'y2',
    };

    return (
      <div className="wrapper">
        <input type="file" onChange={this.handleImageUpload} />
        <div
          className="canvas"
          ref={this.canvas}
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.state.isDragging ? this.handleControlDrag : this.handleMouseMove}
          onMouseUp={this.state.isDragging ? this.handleStopDragging : this.handleMouseUp}
        >
          <img src={this.state.selectedImage} alt="" />
          <SizeControl
            className="draggable-rect-hor"
            style={rightCoordinates}
            isDragging={this.state.isDragging}
            onStartDragging={this.handleStartDragging}
            coordinates={{ x1: coord.x1, x2: null, y1: coord.y1, y2: null }}
          />
          <SizeControl
            className="draggable-rect-hor"
            style={rightBottomControl}
            isDragging={this.state.isDragging}
            onStartDragging={this.handleStartDragging}
            coordinates={{ x1: null, x2: coord.x2, y1: null, y2: coord.y2 }}
          />
          <SizeControl
            className="draggable-rect-hor"
            style={rightBottomControl}
            isDragging={this.state.isDragging}
            onStartDragging={this.handleStartDragging}
            coordinates={{ x1: null, x2: coord.x2, y1: null, y2: coord.y2 }}
          />
          <SizeControl
            className="draggable-rect-hor"
            style={rightBottomControl}
            isDragging={this.state.isDragging}
            onStartDragging={this.handleStartDragging}
            coordinates={{ x1: null, x2: coord.x2, y1: null, y2: coord.y2 }}
          />

          <div className="dimness dimness-right" style={rightRectangleStyle} />
          <div className="dimness dimness-top" style={topRectangleStyle} />
          <div className="dimness dimness-left" style={leftRectangleStyle} />
          <div className="dimness dimness-bottom" style={bottomRectangleStyle} />
        </div>
      </div>
    );
  }
}
export default Canvas;
