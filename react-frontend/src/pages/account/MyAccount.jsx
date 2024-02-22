
import * as React from 'react';

//Material UI
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

//Components
import MyMemes from '../../components/MyMemes';
import MyDrafts from '../../components/MyDrafts';
import APITesting from '../../components/APITesting';

//Redux - States
import { setUser } from '../../slices/userSlice'; 
import { useSelector, useDispatch } from 'react-redux';

export default function MyAccount() {
    const user = useSelector((state) => state.user.currentUser);
    const dispatch = useDispatch();

    const [showAllMemes, setShowAllMemes] = React.useState(false);
    const [showMyMemes, setShowMyMemes] = React.useState(false);
    const [showAllTemplates, setshowAllTemplates] = React.useState(false);

    const handleLogout = () => {
        dispatch(setUser(null));
    };

    return (
        <div>
            <Grid container direction={"column"} padding={2}>
                <Grid item >
                    <h2>Account: {user.email}</h2>
                </Grid>
                <Grid item>
                    <Button id = "logOutBtn" variant="contained" color="primary" onClick={handleLogout}>
                        Logout
                    </Button>
                </Grid>
                <br />
                <Grid item>
                    <Button onClick={() => setShowMyMemes(prevState => !prevState)}>Show My Memes</Button>
                    {showMyMemes && <MyMemes />}
                </Grid>
                <Grid item>
                    <MyDrafts />
                </Grid>
                <Grid item >
                   <APITesting/>
                </Grid>
            </Grid>
        </div>
    );
}; 