
import * as React from 'react';

//Material UI
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

//Components
import MyMemes from '../../components/MyMemes';
import AllMemes from '../../components/AllMemes';
import TextDictation from '../../components/Accessibility/TextDictation';
import MyDrafts from '../../components/MyDrafts';
import APITesting from '../../components/APITesting';

//Redux - States
import { setUser } from '../../slices/userSlice'; 
import { useSelector, useDispatch } from 'react-redux';
import AllTemplates from '../../components/AllTemplates';

export default function MyAccount() {
    const user = useSelector((state) => state.user.currentUser);
    console.log("MyAccount.jsx")
    console.log(user);
    const dispatch = useDispatch();

    const [showAllMemes, setShowAllMemes] = React.useState(false);
    const [showMyMemes, setShowMyMemes] = React.useState(false);
    const [showAllTemplates, setshowAllTemplates] = React.useState(false);

    const handleLogout = () => {
        dispatch(setUser(null));
        console.log('Logout clicked');
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
                    <Button onClick={() => setShowAllMemes(prevState => !prevState)}>Show all Memes</Button>
                    {showAllMemes && <AllMemes />}
                </Grid>
                <Grid item>
                    <Button onClick={() => setshowAllTemplates(prevState => !prevState)}>Show all Templates</Button>
                    {showAllTemplates && <AllTemplates />}
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