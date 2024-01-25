
import * as React from 'react';

//Material UI
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

//Components
import UploadTemplatePopup from '../../components/UploadTemplatePopup';
import MyMemes from '../../components/MyMemes';
import AllMemes from '../../components/AllMemes';
import TextDictation from '../../components/Accessibility/TextDictation';
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
            <h1>Eingeloggt mit der Email {user.email}</h1>
            <TextDictation/>
            <Grid spacing={2} alignItems="center">
                <Grid>
                    <h2>Ausloggen</h2>
                </Grid>
                <Grid>
                    <Button variant="contained" color="primary" onClick={handleLogout}>
                        Ausloggen
                    </Button>
                </Grid>
                <br />
                <Grid>
                    <UploadTemplatePopup />
                </Grid>
                <Grid>
                <Button onClick={() => setShowMyMemes(prevState => !prevState)}>Show My Memes</Button>
                    {showMyMemes && <MyMemes />}
                </Grid>
                <Grid>
                    <Button onClick={() => setShowAllMemes(prevState => !prevState)}>Show all Memes</Button>
                    {showAllMemes && <AllMemes />}
                </Grid>
            </Grid>

        </div>
    );
}; 