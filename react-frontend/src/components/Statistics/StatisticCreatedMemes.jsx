import { Grid } from '@mui/material';
import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

import { useState } from 'react';
import { Button, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

export default function GeneralStatistics() {

  const [showStatistics, setStatistics] = useState([false]);
  const currentYear = new Date().getFullYear()
  const memes = useSelector((state) => state.meme.memes);

  function generateMemeData(){
    if (!memes || memes?.length === 0 || memes[0]?.createdAt === null) {
      console.log("no memes")
      return [];
    }
  //Collecting the statistic-data from the mems
  console.log("generateMemeData")
  console.log(memes)
  console.log(memes.length)


  const dataSet = Array.from({ length: 12 }, () => 0);

  memes.forEach((meme) => {
    const createdAt = new Date(meme.createdAt);
    if (createdAt.getFullYear() === currentYear) {
    const month = createdAt.getMonth()
    console.log("month", month)
    dataSet[month] = (dataSet[month] || 0) + 1;
    console.log(dataSet)
    }
  });

  console.log("dataSet", dataSet)
  return dataSet;
};
  return (

    <Grid>
      <Button onClick={() => showStatistics ? setStatistics(false) : setStatistics(true)}>Show Statistic: Memes created per Month (all users)</Button>
      {(showStatistics && memes?.length != 0 && memes[0]?.createdAt != null) && (
        <Grid style={{backgroundColor: "#F5F5F5"}}>
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

