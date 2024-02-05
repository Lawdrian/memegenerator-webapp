import React from 'react';
import { Grid } from '@mui/material';
import { Typography } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

const Meme = (meme) => {
  return(
    <Grid container direction="column" justify="center" alignItems="center" spacing={2}>
      <Grid item>
        <img src={meme.content} alt="meme" />
      </Grid>
      <Grid item container spacing={2}>
        <Grid item>
          <Typography>
            {meme.upvotes}
          </Typography>
          <ThumbUpIcon/>
        </Grid>
        <Grid item>
          <Typography>
            {meme.downvotes}
          </Typography>
          <ThumbDownIcon/>
        </Grid>
      </Grid>
    </Grid>
  )


}

export default Meme;