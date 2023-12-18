/*import React, { useState } from 'react';
import { Stage, Layer, Rect, Transformer, Image } from 'react-konva';
import useImage from 'use-image';

const URLImage = ({ image }) => {
  const [img] = useImage(image.src);
  return (
    <Image
      image={img}
      x={image.x}
      y={image.y}
      draggable
    />
  );
};

const CanvasCreator = () => {
  const [stageSize, setStageSize] = useState({ width: 500, height: 500 });
  const [images, setImages] = useState([]);

  const handleStageMouseDown = (e) => {
    // clicked on stage - clear selection
    if (e.target === e.target.getStage()) {
      setSelectedShapeName('');
      return;
    }
    // clicked on transformer - do nothing
    const clickedOnTransformer =
      e.target.getParent().className === 'Transformer';
    if (clickedOnTransformer) {
      return;
    }

    // find clicked rect by its name
    const name = e.target.name();
    const rect = rectangles.find((r) => r.name === name);
    if (rect) {
      setSelectedShapeName(name);
    } else {
      setSelectedShapeName('');
    }
  };

  const handleResize = (e) => {
    setStageSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Stage
      width={stageSize.width}
      height={stageSize.height}
      onMouseDown={handleStageMouseDown}
      onTouchStart={handleStageMouseDown}
    >
      <Layer>
        {images.map((image, i) => {
          return <URLImage key={i} image={image} />;
        })}
      </Layer>
    </Stage>
  );
}

export default CanvasCreator;
*/