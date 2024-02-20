import { NavLink, Outlet } from "react-router-dom"
import { AppBar, Button, createTheme, Icon, ThemeProvider, Toolbar, Typography } from "@mui/material"
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import { useSelector } from "react-redux";

//Components
import AccessibilityContent from "../components/Accessibility/AccessibilityContent";
//Image to Text
import ImageToText from '../components/Accessibility/ImageToText';

import ReadImageDescrption from '../components/Accessibility/ReadImageDescription';

const theme = createTheme({
    palette: {
        primary: {
            main: '#556cd6', // Hauptfarbe
            light: '#FFFFFF',
        },
        secondary: {
            main: '#19857b', // Sekundärfarbe
        },
    },
    typography: {
        // Schriftart, Schriftgröße etc.
    },
});

export default function RootLayout() {
    const serverReachable = useSelector((state) => state.server.serverReachable);

    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static">
                <Toolbar>
                    <EmojiEmotionsIcon style={{ marginRight: 10 }} a />
                    <Typography variant="h6" style={{ width: "30%" }}>
                        Meme Generator
                    </Typography>
                    <AccessibilityContent />


                    {!serverReachable && (
                        <CloudOffIcon style={{ marginRight: 10 }}/>              
                    )
                    }
                    <Button color="inherit" component={NavLink} to="/" exact>
                        Home
                    </Button>
                    <Button color="inherit" component={NavLink} to="/editor">
                        Editor
                    </Button>
                    <Button color="inherit" component={NavLink} to="/canvas" style={{ marginRight: 10 }}>
                        Canvas
                    </Button>
                    <Button color="inherit" component={NavLink} to="/account">
                        Account
                    </Button>

                </Toolbar>
            </AppBar>

            <main style={{ marginTop: 20 }}>
                <Outlet />
            </main>

        </ThemeProvider >
    )
}