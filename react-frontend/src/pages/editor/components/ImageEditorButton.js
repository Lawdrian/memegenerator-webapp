import { Button } from "@mui/material";

export function ImageEditorButton({onClick, children, color, id, disabled}) {
  return (
    <Button 
      id={id}
      color={color ?? "success"} 
      variant="contained" 
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}