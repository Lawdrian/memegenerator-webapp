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

import { useGoogleLogin } from '@react-oauth/google';

//REDUX
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { registration, login, googleBackendLogin } from '../../api/user';


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
    dispatch(login(formdata));
  };

  const handleRegistrationSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget); //FOrmData Objekt, that contains the data of the submited form
    registration(data)
  };


  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setGoogleLoginResponse(codeResponse);
    },
    onError: (error) => console.log('Login Failed:', error)
  });

  useEffect(() => {
    if (googleLoginResponse) {
      dispatch(googleBackendLogin(googleLoginResponse));
    }
  }, [googleLoginResponse]);

  return (
    <ThemeProvider theme={defaultTheme}>
      {/* ------------SIGN-IN------------ */}
      <Grid container style={{ marginTop: "-20px", height: "94vh" }}>
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
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleLoginSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="loginEmail"
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
                id="loginPassword"
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
                id="loginBtn"
              >
                LOGIN
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>

                </Grid>
              </Grid>
              <GoogleButton onClick={() => googleLogin()}></GoogleButton>
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
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleRegistrationSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="registrationEmail"
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
                    id="registrationPassword"
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
                Sign up
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


