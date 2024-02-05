import { Grid, Typography } from '@mui/material';
import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function SingleViewMeme({ meme }) {


  function memeDataLikes(){

    var memeData = Array.from({ length: 12 }, () => 0);
  
    meme.upVotes.forEach((like) => {
      const createdAt = new Date(like.createdAt);
      const month = createdAt.getMonth() + 1; //Month are 0-indexed
  
      memeData[month] ? memeData[month]++ : (memeData[month] = 1);
    });

    return memeData;
  };
  
  function memeDataDislikes(){

    var memeData = Array.from({ length: 12 }, () => 0);
  
    meme.downVotes.forEach((dislike) => {
      const createdAt = new Date(dislike.createdAt);
      const month = createdAt.getMonth() + 1; 
  
      memeData[month] ? memeData[month]++ : (memeData[month] = 1);
    });

    return memeData;
  };

  function memeDataComments(){

    var memeData = Array.from({ length: 12 }, () => 0);
  
    meme.comments.forEach((comments) => {
      const createdAt = new Date(comments.timeStamp);
      const month = createdAt.getMonth() + 1; 
  
      memeData[month] ? memeData[month]++ : (memeData[month] = 1);
    });
    return memeData;
  };


  return (
    <Grid>
      <Grid container spacing={2}>
        <Grid item style={{ background: "#ffffff" }}>
          <Typography variant="h4" style={{ color: "green", textAlign: "center", marginBottom: 20 }}>
            Likes/Dislikes over the time 
          </Typography>
          <BarChart
            xAxis={[{ data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], scaleType: 'band' }]}
            yAxis={[{ type: 'number' }]}
            series={[
              { data: memeDataLikes(), color: "green" }, 
              { data: memeDataDislikes(), color: "red"}]}
            width={500}
            height={250}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item style={{ background: "#ffffff" }}>
          <Typography variant="h4" style={{ color: "green", textAlign: "center", marginBottom: 20 }}>
            Comments over the time
          </Typography>
          <BarChart
            xAxis={[{ data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], scaleType: 'band' }]}
            yAxis={[{ type: 'number' }]}
            series={[{ data: memeDataComments(), color: "black"}]}
            width={500}
            height={250}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

