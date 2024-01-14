import React, { useEffect, useRef } from 'react';
import { Text } from 'react-konva';
import Konva from 'konva';


const AnimatedText = ({ text, x, y, animationType }) => {
  const textRef = useRef(null);

  useEffect(() => {
    const textNode = textRef.current;

    const animate = new Konva.Animation((frame) => {
      // Your animation logic here
      // Example: sliding animation
      const newX = x + frame.time * 0.01;
      textNode.x(newX);

      if (newX > x + 100) {
        animate.stop();
      }
    }, textNode.getLayer());

    animate.start();

    return () => animate.stop(); // Clean up the animation when the component unmounts
  }, [text, x, y, animationType]);

  return <Text ref={textRef} text={text} x={x} y={y} />;
};

export default AnimatedText;