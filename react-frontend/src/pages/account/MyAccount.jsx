
import * as React from 'react';

//Material UI
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

//Components
import MyMemes from '../../components/MyMemes';
import AllMemes from '../../components/AllMemes';
import MyDrafts from '../../components/MyDrafts';

//Redux - States
import { setUser } from '../../slices/userSlice'; 
import { useSelector, useDispatch } from 'react-redux';


export default function MyAccount() {
    const user = useSelector((state) => state.user.currentUser);
    const dispatch = useDispatch();

    const [showAllMemes, setShowAllMemes] = React.useState(false);
    const [showMyMemes, setShowMyMemes] = React.useState(false);


    const handleLogout = () => {
        dispatch(setUser(null));
        console.log('Logout clicked');
    };

    return (
        <div>
            <Grid container spacing={2} direction={"column"} padding={2}>
                <Grid item >
                    <h1>Eingeloggt mit der Email {user.email}</h1>
                </Grid>
                <Grid item >
                    <h2>Ausloggen</h2>
                    <Button variant="contained" color="primary" onClick={handleLogout}>
                        Ausloggen
                    </Button>
                </Grid>
                <br />
                <Grid item>
                <Button onClick={() => setShowMyMemes(prevState => !prevState)}>Show My Memes</Button>
                    {showMyMemes && <MyMemes />}
                </Grid>
                <Grid item>
                    <Button onClick={() => setShowAllMemes(prevState => !prevState)}>Show all Memes</Button>
                    {showAllMemes && <AllMemes />}
                </Grid>
                <Grid item>
                    <MyDrafts />
                </Grid>
            </Grid>
        </div>
    );
}; 