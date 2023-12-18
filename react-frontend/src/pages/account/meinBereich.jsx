
import * as React from 'react';

//Material UI
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

//Components
import NaviBar from "../../components/navbar";
import UploadTemplate from '../../components/UploadTemplate';
//Redux - States
import { setUser } from '../../slices/userSlice'; // Passe den Pfad entsprechend deiner Struktur an
import { useSelector, useDispatch } from 'react-redux';


export default function MyAccount() {
    const user = useSelector((state) => state.user.currentUser);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(setUser(null));
        console.log('Logout clicked');
      };

    return (
        <div>
            <NaviBar />
            <h1>Eingeloggt mit der Email {user.email}</h1>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <h2>Ausloggen</h2>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={handleLogout}>
                        Ausloggen
                    </Button>
                </Grid>
            </Grid>
            <UploadTemplate/>
        </div>
    );
}; 