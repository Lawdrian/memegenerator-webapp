import { useState } from 'react';
import { Grid, FormControl, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
import { changeMemePrivacy } from '../api/meme';
import { useSelector } from 'react-redux';

export const PrivacyRadioButton = ({ privacy, id }) => {
  const [memePrivacy, setMemePrivacy] = useState(privacy);
  const token = useSelector((state) => state.user.token);

  const handePrivacyChange = (newPrivacy) => {
    setMemePrivacy(newPrivacy);
    changeMemePrivacy(newPrivacy, id, token);
  }

  return(
      <Grid item>
      <FormControl>
        <RadioGroup
          defaultValue="public"
          name="radio-buttons-group"
          value={memePrivacy}
          onChange={(event) => handePrivacyChange(event.target.value)}
          row
        >
          <FormControlLabel value="public" control={<Radio />} label="public" />
          <FormControlLabel value="unlisted" control={<Radio />} label="unlisted" />
          <FormControlLabel value="private" control={<Radio />} label="private" />
        </RadioGroup>
      </FormControl>
    </Grid>
  )
}