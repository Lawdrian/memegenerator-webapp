import { Button, useThemeProps } from "@mui/material";

function ImageEditorButton({onClick, children, color}) {

  return (
   <Button 
    color= {color ?? "success"} 
    variant="contained" 
    onClick={onClick}
  >
    {children}
  </Button>
  );
}

export default ImageEditorButton;