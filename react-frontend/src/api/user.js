import axios from 'axios';
import { setUser } from '../slices/userSlice'

import { SERVER_DOMAIN } from '../utils/authUtils';

export const registration = (data) => {
  fetch(`${SERVER_DOMAIN}:3001/user/registration`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(data).toString(),
  })
  .then(response => {
    if (!response.ok) {
        alert('Registration failed');
    } else {
        alert('Registration successful');
    }
    return response.json();
  })
  .then(result => {
    console.log(result)
  })
  .catch(error => {
    console.error('Error during registration:', error);
  })
}

export const login = (data) => async (dispatch) => {
  fetch(`${SERVER_DOMAIN}:3001/user/login`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(data).toString(),
  })
  .then(response => {
    if (!response.ok) {
      alert('Wrong password or email');
    } 
    return response.json();
  })
  .then(result => {
      dispatch(setUser({ token: result.token, user: result.user }));
  })
  .catch(error => {
      console.error('Error during login:', error);
  })
  }



export const googleBackendLogin = (googleLoginResponse) => async (dispatch) => {
  axios
    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleLoginResponse.access_token}`, {
      headers: {
        Authorization: `Bearer ${googleLoginResponse.access_token}`,
        Accept: 'application/json'
      }
    })
    .then((res) => {
      const googleIdFromGoogleOAuth = res.data.id;

      fetch(`${SERVER_DOMAIN}:3001/user/api-login`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({ googleId: googleIdFromGoogleOAuth }).toString(),
      })
      .then(loginResponse => loginResponse.json())
      .then(result => {
          console.log("result", result);
          dispatch(setUser({ token: result.token, user: res.data }));
      })
      .catch(error => {
          console.error('Error during registration:', error);
      });
  })
  .catch((err) => console.log(err));
}