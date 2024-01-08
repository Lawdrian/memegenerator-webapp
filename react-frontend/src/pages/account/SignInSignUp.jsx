import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import GoogleButton from 'react-google-button'

import {useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

//REDUX
import{ useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser} from '../../slices/userSlice'; 


function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}


const defaultTheme = createTheme();

export default function SignInSignUp() {

    const [googleLoginResponse, setGoogleLoginResponse] = useState(null);

    const dispatch = useDispatch();
    
    const handleLoginSubmit = (event) => {
        event.preventDefault();//prevents reload of page
        const formdata = new FormData(event.currentTarget);
        console.log("Login gestartet");
        fetch(`http://localhost:3001/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(formdata).toString(),
        })
            .then(response => response.json())
            .then(result => {
                //TOKEN
                console.log(result.token);
                dispatch(setUser({ token: result.token, user: result.user }));
            })
            .catch(error => {
                console.error('Error during login:', error);
            })
    };

    const handleRegistrationSubmit = async (event) => {
        event.preventDefault();                     
        const data = new FormData(event.currentTarget); //FOrmData Objekt, that contains the data of the submited form

        fetch(`http://localhost:3001/registration`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(data).toString(),
        })
            .then(response => response.json())
            .then(result => {
                console.log(result)
            })
            .catch(error => {
                console.error('Error during registration:', error);
            })

    };


    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
          setGoogleLoginResponse(codeResponse);
          console.log("Login erfolgreich. Willkommen!", codeResponse);
        },
        onError: (error) => console.log('Login Failed:', error)
      });
    
      useEffect(() => {
        if (googleLoginResponse) {
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleLoginResponse.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${googleLoginResponse.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then((res) => {
                    console.log(res);
                    console.log(res.data);
                    const googleIdFromGoogleOAuth = res.data.id;
                    console.log("Google ID:" + googleIdFromGoogleOAuth);
    
                    fetch('http://localhost:3001/api-login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams({ googleId: googleIdFromGoogleOAuth }).toString(),
                    })
                        .then(result => {
                            dispatch(setUser({ token: result.token, user: res.data }));
                            console.log(result);
                        })
                        .catch(error => {
                            console.error('Error during registration:', error);
                        });
                })
                .catch((err) => console.log(err));
        }
    }, [googleLoginResponse]);
    


    return (
        <ThemeProvider theme={defaultTheme}>

            {/* ------------SIGN-IN------------ */}
            <Grid container style = {{marginTop: "-20px", height: "94vh"}}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={3}
                    md={6}
                    sx={{
                        backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={8} md={6} component={Paper} elevation={5} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Anmeldung
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleLoginSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                ANMELDEN
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="#" variant="body2">
                                        Forgot password?
                                    </Link>

                                </Grid>
                            </Grid>
                            <GoogleButton onClick={() => login()}></GoogleButton>
                        </Box>
                    </Box>
                </Grid>

                        {/* ------------SIGN-UP------------ */}
                <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
                    <Box
                            sx={{
                                marginTop: 8,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Registration
                            </Typography>
                            <Box component="form" noValidate onSubmit={handleRegistrationSubmit} sx={{ mt: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="email"
                                            label="Email Address"
                                            name="email"
                                            autoComplete="email"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="password"
                                            label="Password"
                                            type="password"
                                            id="password"
                                            autoComplete="new-password"
                                        />
                                    </Grid>
                                </Grid>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    REGISTRIEREN
                                </Button>
                            </Box>
                            <Copyright sx={{ mt: 5 }} />
                    </Box>
                </Grid>
                <Grid
                    item
                    xs={false}
                    sm={3}
                    md={6}
                    sx={{
                        backgroundImage: 'url(https://source.unsplash.com/random?random?wallpapers)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            </Grid>
        </ThemeProvider >

    );
}


