import { Grid } from '@mui/material';
import React from 'react';
import { useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

import { getAllMemes } from "../../api/meme";
import { useState } from 'react';
import { Button, Typography } from '@mui/material';

export default function StatisticCreatedMemes() {

  const [allMemes, setAllMemes] = useState([]);
  const [showStatistics, setStatistics] = useState([false]);


  useEffect(() => {
    getAllMemes(setAllMemes);
    console.log(allMemes)
    setStatistics(false)
  }, [])

  function generateMemeData(){

  //Collecting the statistic-data from the mems
  const memeData = [];

  allMemes.forEach((meme) => {
    const createdAt = new Date(meme.createdAt);
    const month = createdAt.getMonth() + 1; //Month are 0-indexed

    memeData[month] ? memeData[month]++ : (memeData[month] = 1);
    console.log(memeData)
  });

  return memeData;
};
  return (

    <Grid>
      <Button onClick={() => showStatistics ? setStatistics(false) : setStatistics(true)}>Show Statistic: Memes created per Month</Button>
      {showStatistics && (
        <Grid style={{ background: "#00FF00" }}>
          <Typography variant="h4" style={{ color: "green", textAlign: "center", marginBottom: 20 }}>Memes created per Month</Typography>
          <BarChart
            series={[{ data: generateMemeData() }]}
            height={290}
            xAxis={[{ data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], scaleType: 'band' }]}
            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
          />
        </Grid>
      )}
    </Grid>
  );
}

