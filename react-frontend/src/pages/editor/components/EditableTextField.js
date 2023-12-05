import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Text, Transformer } from 'react-konva';
import Konva from 'konva';

import DraggableText from './DraggableText';

function EditableTextField({onRemove, stageRef}) {
  const [textNode, setTextNode] = useState(null);
  const [trNode, setTrNode] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textNode) {
      textNode.on('transform', function () {
        textNode.setAttrs({
          width: textNode.width() * textNode.scaleX(),
          scaleX: 1,
        });
      });

      textNode.on('dblclick dbltap', () => {

        // hide text node
        textNode.hide();

        const stage = stageRef.current.getStage();
        const textPosition = textNode.absolutePosition();

        // calculate offset from stage to the top of the screen
        const stageBox = stageRef.current.content.getBoundingClientRect();
        const adjustedPosition = {
          x: stageBox.left + textPosition.x,
          y: stageBox.top + textPosition.y,
        };

        const textarea = document.createElement('textarea');
        document.body.appendChild(textarea);

        textarea.value = textNode.text();
        textarea.style.position = 'absolute';
        textarea.style.top = `${adjustedPosition.y}px`;
        textarea.style.left = `${adjustedPosition.x}px`;
        textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px';
        textarea.style.height = textNode.height() - textNode.padding() * 2 + 5 + 'px';
        textarea.style.fontSize = textNode.fontSize() + 'px';
        textarea.style.border = 'none';
        textarea.style.padding = '0px';
        textarea.style.margin = '0px';
        textarea.style.overflow = 'hidden';
        textarea.style.background = 'none';
        textarea.style.outline = 'none';
        textarea.style.resize = 'none';
        textarea.style.lineHeight = textNode.lineHeight();
        textarea.style.fontFamily = textNode.fontFamily();
        textarea.style.transformOrigin = 'left top';
        textarea.style.textAlign = textNode.align();
        textarea.style.color = textNode.fill();

        textarea.focus();

        // this function removes the textarea which is generated
        // by double-clicking on the textbox
        function removeTextarea() {
          if (textarea.parentNode) {
            textarea.parentNode.removeChild(textarea);
          }
        }
        
        function handleBlur() {
          textNode.text(textarea.value);
          textNode.show();
          removeTextarea();
        }

  
        textarea.addEventListener('keydown', function (e) {
          // hide on enter, but don't hide on shift + enter
          if (e.key === 'Enter' && !e.shiftKey) {
            textNode.text(textarea.value);
            // show the original text node
            textNode.show();
            textarea.removeEventListener('blur', handleBlur);
            removeTextarea();
          }
          // on esc do not set value back to node
          if (e.key === 'Escape') {
            // show the original text node
            textNode.show();
            textarea.removeEventListener('blur', handleBlur);
            removeTextarea();
          }
        });
        
        textarea.addEventListener('blur', handleBlur);

        textarea.addEventListener('keydown', function (e) {
          textarea.style.height = 'auto';
          textarea.style.height = textarea.scrollHeight + textNode.fontSize() + 'px';
        });

        function handleOutsideClick(e) {
          if (e.target !== textarea) {
            textNode.text(textarea.value);
            removeTextarea();
          }
        }

        setTimeout(() => {
          window.addEventListener('click', handleOutsideClick);
        });
      });
    }
  }, [textNode]);
  
  /*
  <Text
            text='Some text here'
            x={50}
            y={80}
            fontSize={20}
            draggable={true}
            width={200}
            ref={node => setTextNode(node)}
          />
  */

  return (
        <Layer>
          <DraggableText 
            x={50} 
            y={80} 
            fontSize={20} 
            setTextNode={setTextNode} 
            stageRef={stageRef}
          />
          {textNode && (
            <Transformer
              ref={node => setTrNode(node)}
              boundBoxFunc={(oldBox, newBox) => {
                newBox.width = Math.max(30, newBox.width);
                return newBox;
              }}
              node={textNode}
              enabledAnchors={['middle-left', 'middle-right']}
            />
          )}
        </Layer>
  );
}

export default EditableTextField;