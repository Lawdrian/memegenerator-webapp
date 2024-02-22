import { Grid } from '@mui/material';
import React, {useEffect} from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

import { useState } from 'react';
import { Button, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { setMemes } from '../../slices/memeSlice';
import { useDispatch } from 'react-redux';
import { getAllMemes } from '../../api/meme';

export default function GeneralStatistics() {

  const [showStatistics, setStatistics] = useState(false);
  const currentYear = new Date().getFullYear()
  const dispatch = useDispatch();
  const memes = useSelector((state) => state.meme.memes);
  const token = useSelector((state) => state.user.token);
  const memesLoaded = useSelector((state) => state.meme.memesLoaded);

  useEffect(() => {
    if (token && !memesLoaded) {
      getAllMemes((memes) => {
        dispatch(setMemes({ memes: memes }));
      }, token);
    }
  }, [token, memesLoaded, dispatch]);

  function generateMemeData(){
    if (!memes || memes?.length === 0 || memes[0]?.createdAt === null) {
      return [];
    }

  const dataSet = Array.from({ length: 12 }, () => 0);

  memes.forEach((meme) => {
    const createdAt = new Date(meme.createdAt);
    if (createdAt.getFullYear() === currentYear) {
    const month = createdAt.getMonth()
    dataSet[month] = (dataSet[month] || 0) + 1;
    }
  });
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

