import { Grid, Typography, Dialog } from '@mui/material';
import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function SingleViewStatistics({ meme, open, setOpen}) {


  function memeDataLikes(){
    var dataSet = Array.from({ length: 12 }, () => 0);
    if( !meme || meme?.upVotes.length == 0 ){return dataSet}
    meme.upVotes.forEach((like) => {
      const createdAt = new Date(like.createdAt);
      const month = createdAt.getMonth()
  
      dataSet[month] ? dataSet[month]++ : (dataSet[month] = 1);
    });

    return dataSet;
  };
  
  function memeDataDislikes(){

    var dataSet = Array.from({ length: 12 }, () => 0);
    if( !meme || meme?.downVotes.length == 0 ){return dataSet}
    meme.downVotes.forEach((dislike) => {
      const createdAt = new Date(dislike.createdAt);
      const month = createdAt.getMonth() 
  
      dataSet[month] ? dataSet[month]++ : (dataSet[month] = 1);
    });

    return dataSet;
  };

  function memeDataComments(){

    var dataSet = Array.from({ length: 12 }, () => 0);
    if( !meme || meme?.comments.length == 0 ){return dataSet}
    meme.comments.forEach((comment) => {
      const createdAt = new Date(comment.timeStamp);
      const month = createdAt.getMonth()
      dataSet[month] ? dataSet[month]++ : (dataSet[month] = 1);
    });
    return dataSet;
  };


  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
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
      </Dialog>
  );
}

