import React, { useState } from 'react';
import { Text } from 'react-konva';


/**
 * A draggable text component - used to add text to the canvas.
 * 
 * @param {number} props.x - The x coordinate of the text.
 * @param {number} props.y - The y coordinate of the text.
 * @param {number} props.fontSize - The font size of the text.
 * @param {Function} props.setTextNode - A function that sets the text node in the parent.
 *
 * @returns {JSX} A draggable text component.
 */
function DraggableText(props) {
  const [position, setPosition] = useState({ x: props.x, y: props.y });

  const handleDragMove = e => {
    setPosition({ x: e.target.x(), y: e.target.y() });
  };

  const handleDragEnd = e => {
    setPosition({ x: e.target.x(), y: e.target.y() });
  };

  return (
    <Text
			width={200}
      x={position.x}
      y={position.y}
      fontSize={props.fontSize}
      text="Some text"
      draggable
      dragBoundFunc={(pos) => {
        const stage = props.stageRef.current.getStage();
        const textWidth = 200; // the width prop of the Text component
        const textHeight = props.fontSize * 1.2; // approximate height based on fontSize
        const newX = Math.max(Math.min(pos.x, stage.width() - textWidth), 0);
        const newY = Math.max(Math.min(pos.y, stage.height() - textHeight), 0);
        return { x: newX, y: newY };
      }}
      onDragEnd={handleDragEnd}
			onDragMove={handleDragMove}
			ref={node => props.setTextNode(node)}
    />
  );
}

export default DraggableText;