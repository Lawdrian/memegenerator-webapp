import { NavLink, Outlet } from "react-router-dom"
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

const theme = createTheme({
    palette: {
        primary: {
            main: '#556cd6', // Hauptfarbe
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
    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static">
                <Toolbar>
                    <EmojiEmotionsIcon style={{ marginRight: 10 }} />
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Meme Generator
                    </Typography>
                    <Button color="inherit" component={NavLink} to="/" exact>
                        Home
                    </Button>
                    <Button color="inherit" component={NavLink} to="/editor">
                        Editor
                    </Button>
                    <Button color="inherit" component={NavLink} to="/profile">
                        Profile
                    </Button>
                </Toolbar>
            </AppBar>

            <main style={{ marginTop: 20 }}>
                <Outlet />
            </main>

        </ThemeProvider >
    )
}