import React, { useEffect, useRef } from 'react';
import { Text } from 'react-konva';

function AnimatedTextField({ textProps, animation }) {
  const textRef = useRef();

  useEffect(() => {
    const node = textRef.current;
    const anim = new window.Konva.Animation((frame) => {
      if (animation === 'fade-in') {
        node.opacity(Math.min(frame.time / 1000, 1));
      } else if (animation === 'fade-out') {
        node.opacity(Math.max(1 - frame.time / 1000, 0));
      }
    }, node.getLayer());

    anim.start();

    return () => anim.stop();
  }, [animation]);

  return <Text ref={textRef} {...textProps} />;
}

export default AnimatedTextField;