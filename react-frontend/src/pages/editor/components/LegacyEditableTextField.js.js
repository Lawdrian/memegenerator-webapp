import React, { useState, useRef, useEffect } from 'react';
import { Layer, Text, Transformer, Group, Rect } from 'react-konva';

function NewEditableTextField({stageRef, textProps, onSelect, onDeselect, isSelected, initialTextWidth}) {
  const [textNode, setTextNode] = useState(null);
  const [rectNode, setRectNode] = useState(null);
  const [trNode, setTrNode] = useState(null);
  const [groupNode, setGroupNode] = useState(null);
  const textareaRef = useRef(null);
  const [textSize, setTextSize] = useState({ width: initialTextWidth, height: textProps.fontSize * 1.2 });

  //const [isSelected, setIsSelected] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const stage = stageRef.current.getStage();

  // handle the selection of the text field
  useEffect(() => {
    if (textNode && groupNode) {
      if(isSelected) {
        groupNode.on('transform', function () {
          const scaleX = textNode.scaleX();
          textNode.setAttrs({
            width: Math.max(30, groupNode.width() * scaleX),
            scaleX: 1,
            wrap: 'word',
          });
          // check, if there is currently a textarea and also update the rotation of the textarea
          if (textareaRef.current) {
            // it isn't allowed to edit the text while rotating it -> textarea will be deleted when rotating text
            setIsEditable(false);
            // Update the rotation of the textarea to match the rotation of the textNode
            //textareaRef.current.style.transform = `rotate(${textNode.rotation()}deg)`;
          }
        });

      } else {
        groupNode.off('transform');
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
        console.log(`textNode clicked:-- isSelected: ${isSelected}, isEditable: ${isEditable}`);
      
      });
    }

  }, [groupNode, textNode, isSelected, isEditable]);

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
        console.log(`stage clicked:-- isSelected: ${isSelected}, isEditable: ${isEditable}`);
      });
    }
  }, [stageRef, isSelected, isEditable]);


  // handle the creation of the textarea over the textfield
  useEffect(() => { 
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
      textarea.style.transform = `rotate(${groupNode.rotation()}deg)`;
      textarea.style.textAlign = textNode.align();
      textarea.style.color = textNode.fill();

      textarea.focus();

      // update the text of the textnode on every keypress inside the textarea
      textarea.addEventListener('input', () => {
        if(textNode) {
          textNode.text(textarea.value);
          // update the textarea's height to match the textNode's height
          textarea.style.height = `${textarea.scrollHeight}px`;
          setTextSize({ width: textarea.offsetWidth, height: textarea.offsetHeight });
          // update the size of the transformer box when the text changes
          trNode.forceUpdate();
        } else {
          // If the textNode doesn't exist, remove the textarea from the DOM
          document.body.removeChild(textarea);
        }

      });

    } else if(textNode && !isEditable) {
      // remove old textarea
      if (textareaRef.current) {
        // update text node with the textarea value
        textNode.text(textareaRef.current.value);
        textNode.show();
        
        // remove the textarea from the DOM
        textareaRef.current.parentNode.removeChild(textareaRef.current);
        textareaRef.current = null;
      }
      rectNode.show();
      textNode.show();
    }

  }, [textNode, textProps, isEditable]);
    
  // add a useEffect hook that updates the textarea's properties when textProps change
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.fontSize = textProps.fontSize + 'px';
      textareaRef.current.style.fontFamily = textProps.fontFamily;
      textareaRef.current.style.color = textProps.fill;
      textareaRef.current.style.backgroundColor = textProps.backgroundColor;
    }
  }, [textProps]);


  // this useEffect runs when the component mounts and unmounts (e.g. deleting the textField)
  useEffect(() => {
    return () => {
      console.log('removing textarea along with textNode');
      if (textareaRef.current && document.body.contains(textareaRef.current)) {
        document.body.removeChild(textareaRef.current);
      }
    };
  }, []);


  return (
        <Layer>
          <Group
            ref = { node => { setGroupNode(node) }}
            x={50}
            y={80}
            draggable
              dragBoundFunc={(pos) => {
                // prevent dragging off the stage
                //const lineHeight = textProps.fontSize * 1.2; // approximate line height based on fontSize
                //const lines = textNode.text.split('\n'); // split the text into lines
                //const textHeight = lines.length * lineHeight; // calculate the total height of the text box
                //const textWidth = initialTextWidth;
                const groupSize = textNode.getClientRect(); // get the size of the group
                const newX = Math.max(Math.min(pos.x, stage.width() - groupSize.width), 0);
                const newY = Math.max(Math.min(pos.y, stage.height() - groupSize.height), 0);
                return { x: newX, y: newY };
              }}
              width={initialTextWidth} // Set the width of the text box
          >
            <Rect
                fill={textProps.backgroundColor}
                width={textSize.width}
                height={textSize.height}
                ref={ node => {
                  setRectNode(node)
                }}

            />
            <Text
              width={initialTextWidth} // Set the width of the text box
              fontSize={textProps.fontSize}
              fontFamily={textProps.fontFamily}
              fill={textProps.fill}
              text="Some text"
              //onDragEnd={handleDragEnd}
              //onDragMove={handleDragMove}
              ref={ node => {
                setTextNode(node)
              }}

            />
          </Group>
          {(textNode && isSelected) && (
            <Transformer
              ref={node => setTrNode(node)}
              boundBoxFunc={(oldBox, newBox) => {
                newBox.width = Math.max(30, newBox.width);
                return newBox;
              }}
              node={groupNode}
              enabledAnchors={['middle-left', 'middle-right']}
            />
          )}
        </Layer>
  );
}

export default NewEditableTextField;