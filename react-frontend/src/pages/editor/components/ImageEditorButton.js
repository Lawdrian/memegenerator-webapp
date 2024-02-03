import { Button } from "@mui/material";

export function ImageEditorButton({onClick, children, color}) {
  return (
    <Button 
      color={color ?? "success"} 
      variant="contained" 
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

export function ImageEditorTextfieldButton({onClick, children, color}) {
  return (
    <Button 
      color={color ?? "success"} 
      variant="contained" 
      onClick={onClick}
      id="addTextFieldbtn"
    >
      {children}
    </Button>
  );
}

export function ImageEditorClearButton({onClick, children, color}) {
  return (
    <Button 
      color={color ?? "success"} 
      variant="contained" 
      onClick={onClick}
      id="clearBtn"
    >
      {children}
    </Button>
  );
}
