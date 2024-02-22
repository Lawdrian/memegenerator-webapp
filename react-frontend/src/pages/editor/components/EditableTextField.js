import React, { useState, useRef, useEffect } from 'react';
import { Layer, Text, Transformer } from 'react-konva';
import Konva from 'konva';

function EditableTextField({stageRef, textProps, onSelect, onDeselect, isSelected, initialTextWidth, onPropertyChange}) {
  const [textNode, setTextNode] = useState(null);
  const [trNode, setTrNode] = useState(null);
  const textareaRef = useRef(null);
  const stageSize = { width: stageRef.current.width(), height: stageRef.current.height() };
  const [isEditable, setIsEditable] = useState(false);
 
  const stage = stageRef.current.getStage();

  // handle the selection of the text field
  useEffect(() => {
    if (textNode) {
      if(isSelected) {
        textNode.on('transform', function () {
          textNode.setAttrs({
            width: textNode.width() * textNode.scaleX(),
            scaleX: 1,
          });
          onPropertyChange("rotation", textNode.rotation());
          // check, if there is currently a textarea and also update the rotation of the textarea
          if (textareaRef.current) {
            // it isn't allowed to edit the text while rotating it -> textarea will be deleted when rotating text
            setIsEditable(false);
          }
        });
      } else {
        textNode.off('transform');
      }
      textNode.off('click tap');
      textNode.on('click tap', (e) => {
        if(!isSelected) {
          //setIsSelected(true);
          onSelect();
        } else if(!isEditable) {
          setIsEditable(true);
        }
        // stop propagation of the event to prevent the Stage's click event listener from being triggered
        e.cancelBubble = true;   
      });
    }

  }, [textNode, isSelected, isEditable]);

  // handle click on the stage to either de_editable or de_select the text field
  useEffect(() => {
    if (stageRef.current) {
      stageRef.current.off('click tap');
      stageRef.current.on('click tap', () => {
        if(isEditable) {
          setIsEditable(false);
        } else {
          onDeselect();
          //setIsSelected(false);
        }
      });
    }
  }, [stageRef, isSelected, isEditable]);

  // if the user clicks on another textNode, then this one should be deselected
  useEffect(() => {
    if(!isSelected && isEditable) {
      setIsEditable(false);
    }
  }, [isSelected]);

  // handle the creation of the textarea over the textfield
  useEffect(() => { 
    let handler;
    if (textNode && isEditable) {
      // remove old textarea
      if (textareaRef.current) {
        textareaRef.current.parentNode.removeChild(textareaRef.current);
        textareaRef.current = null;
      }

      //const stage = stageRef.current.getStage();
      const textPosition = textNode.absolutePosition();

      // calculate offset from stage to the top of the screen
      const stageBox = stageRef.current.content.getBoundingClientRect();
      const adjustedPosition = {
        x: stageBox.left + textPosition.x,
        y: stageBox.top + textPosition.y,
      };

      const textarea = document.createElement('textarea');
      document.body.appendChild(textarea);
      textareaRef.current = textarea;

      // hide text node
      textNode.hide();

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
      textarea.style.transform = `rotate(${textNode.rotation()}deg)`;
      textarea.style.textAlign = textNode.align();
      textarea.style.color = textNode.fill();
      textarea.style.textDecoration = textNode.textDecoration();
      textarea.style.fontStyle = textProps.fontStyle;
      textarea.style.fontWeight = textProps.fontWeight;
      textarea.style.align = textProps.align;

      textarea.focus();

      // update the text of the textnode on every keypress inside the textarea
      handler = () => {
        if(textNode) {
          const newValue = textarea.value;
          textNode.text(newValue);
          onPropertyChange("text", newValue);
          // update the textarea's height to match the textNode's height
          textarea.style.height = `${textarea.scrollHeight}px`;
        } else {
          // If the textNode doesn't exist, remove the textarea from the DOM
          document.body.removeChild(textarea);
        }
      };
      textarea.addEventListener('input', handler);

    } else if(textNode && !isEditable) {
      // remove old textarea
      if (textareaRef.current) {
        // update text node with the textarea value
        const newValue = textareaRef.current.value
        textNode.text(newValue);
        onPropertyChange("text", newValue);
        textNode.show();
        // remove the textarea from the DOM
        textareaRef.current.parentNode.removeChild(textareaRef.current);
        textareaRef.current = null;
      }
      textNode.show();
    }

    // clean up the event listener when the component unmounts
    return () => {
      if (textareaRef.current && document.body.contains(textareaRef.current)) {
        if (handler) {
          textareaRef.current.removeEventListener('input', handler);
        }
      }}

  }, [textNode, textProps, isEditable]);
    
  // add a useEffect hook that updates the textarea's properties when textProps change
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.fontSize = textProps.fontSize + 'px';
      textareaRef.current.style.fontFamily = textProps.fontFamily;
      textareaRef.current.style.color = textProps.fill;
    }
  }, [textProps]);

  // this useEffect runs when the component mounts and unmounts (e.g. deleting the textField)
  useEffect(() => {
    return () => {
      if (textareaRef.current && document.body.contains(textareaRef.current)) {
        document.body.removeChild(textareaRef.current);
      }
      if(textNode) {
        textNode.off('transform');
        textNode.off('click tap');
      }
      if(stageRef.current) {
        stageRef.current.off('click tap');
      }
    };
  }, []);

  const handleDragMove = e => {
    onPropertyChange("position", { x: e.target.x(), y: e.target.y() });
  };

  const handleDragEnd = e => {
    onPropertyChange("position", { x: e.target.x(), y: e.target.y() });
  };

  const checkFontStyle = () => {
    if(textProps.fontStyle === 'italic') {
      if(textProps.fontWeight === 'bold') {
        return 'bold italic';
      } else {
        return 'italic';
      }
    } else if(textProps.fontWeight === 'bold') {
      return 'bold';
    }
    return 'normal';
  }

  return (
        <Layer>
            <Text
              x={textProps.position.x}
              y={textProps.position.y}
              width={initialTextWidth} // Set the width of the text box
              fontSize={textProps.fontSize}
              fontFamily={textProps.fontFamily}
              rotation={textProps.rotation}
              fill={textProps.fill}
              text={textProps.text}
              align={textProps.align}
              textDecoration={textProps.textDecoration}
              fontStyle={checkFontStyle()}
              //stroke= '#f00'
              //strokeWidth={2} // Add this line
              draggable
              dragBoundFunc={(pos) => {
                  // prevent dragging off the stage
                  // TODO think of a solution for the dragging of stage
                  /*
                  const textWidth = textNode.width(); // the width prop of the Text component
                  const textHeight = textNode.height() // approximate height based on fontSize
                  const newX = Math.max(Math.min(pos.x, stageSize.width - textWidth), 0);
                  const newY = Math.max(Math.min(pos.y, stageSize.height - textHeight), 0);
                  return { x: newX, y: newY };
                  */
                 return { x: pos.x, y: pos.y };
              }}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
              ref={ node => {
                setTextNode(node)
              }}

            />
          {(textNode && isSelected) && (
            <Transformer
              ref={node => setTrNode(node)}
              boundBoxFunc={(oldBox, newBox) => {
                newBox.width = Math.max(30, newBox.width);
                return newBox;
              }}
              nodes={[textNode]}
              enabledAnchors={['middle-left', 'middle-right']}
            />
          )}
        </Layer>
  );
}

export default EditableTextField;