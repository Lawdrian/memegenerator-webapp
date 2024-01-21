import { useEffect, useState, useRef } from "react";
import { useSelector } from 'react-redux';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import React from "react";
import { Grid, Typography } from "@mui/material";
import { Stage, Layer, Line } from 'react-konva';
import { emptyUploadTemplate } from "./UploadTemplateDialog";

  function HandDrawnTab({ template, setTemplate}) {
    const [lines, setLines] = useState([]);
    const isDrawing = useRef(false);
    const stageRef = useRef(null);
  
    useEffect(() => {
      setTemplate({...emptyUploadTemplate, name: template.name});
    }, []);

    const handleMouseDown = (e) => {
      isDrawing.current = true;
      const pos = e.target.getStage().getPointerPosition();
      setLines([...lines, { points: [pos.x, pos.y] }]);
    };
  
    const handleMouseMove = (e) => {
      if (!isDrawing.current) {
        return;
      }
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();
      let lastLine = lines[lines.length - 1];
      lastLine.points = lastLine.points.concat([point.x, point.y]);
  
      lines.splice(lines.length - 1, 1, lastLine);
      setLines(lines.concat());
    };
  
    const handleMouseUp = () => {
      isDrawing.current = false;
    };

  function clearCanvas() {
    setLines([]);
  }

  function convertCanvasToTemplate() {
    if (stageRef.current) {
      const dataUrl = stageRef.current.toDataURL();
      console.log(dataUrl);
      setTemplate({...template, content: dataUrl, format: 'image'});
      // Now you can send dataUrl to the server or use it as the src for an Image element
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Typography variant="h4"><b>Draw your Template</b></Typography>
          </Grid>
          <Grid item>
            <div
              style={{
                width: "500px", // Set the width of the drawing area
                height: "500px", // Set the height of the drawing area
                border: "1px solid black", // Add a border
              }}
            >
              <Stage
                ref={stageRef}
                width={500} // Match the width of the container
                height={500} // Match the height of the container
                onMouseDown={handleMouseDown}
                onMouseup={handleMouseUp}
                onMousemove={handleMouseMove}
                onMouseOut={() => { isDrawing.current = false;}}
              >
                <Layer>
                  {lines.map((line, i) => (
                    <Line
                      key={i}
                      points={line.points}
                      stroke="#000"
                      strokeWidth={2}
                      tension={0.5}
                      lineCap="round"
                      listening={false} // used so that the mouse events are not attached to individual lines
                      globalCompositeOperation={
                        line.tool === 'eraser' ? 'destination-out' : 'source-over'
                      }
                    />
                  ))}
                </Layer>
              </Stage>
            </div>
          </Grid>
          <Grid item>
            <Grid container spacing={2}>
              <Grid item>
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  disabled={!lines}
                  onClick={convertCanvasToTemplate}
                >
                  Done
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="error" onClick={clearCanvas}>
                  Clear Canvas
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={6}>
        {template.content && <img src={template.content} style={{maxWidth: '50%', maxHeight: '50%'}} />}
      </Grid>
    </Grid>
  );
}

export default HandDrawnTab;

