import { Button } from "@mui/material";

export function ImageEditorButton({onClick, children, color, id}) {
  return (
    <Button 
      id={id}
      color={color ?? "success"} 
      variant="contained" 
      onClick={onClick}
    >
      {children}
    </Button>
  );
}