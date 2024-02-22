import { Grid, Typography, Dialog } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { getTempRefMemes } from '../../api/template';
import { useSelector } from 'react-redux';

export default function TemplateStatistics({ template, open, setOpen}) {
  const [statisticData, setStatisticData] = useState([]);
  const currentYear = new Date().getFullYear()
  const token = useSelector((state) => state.user.token)
  
  useEffect(() => {
    getTemplateStatisticData();
  }, [template]);

  const getTemplateStatisticData = async () => {
    if(!template) return;
    try {
      const data = await getTempRefMemes(template, token);
      setStatisticData(data.memeDetails || []);
    } catch (error) {
      console.error(error);
    }
  };

  const templateDataLikes = () => {
    const dataSet = Array.from({ length: 12 }, () => 0);

    statisticData.forEach((meme) => {
      if(meme.upVotes.length == 0 ){return dataSet}
      else{
        meme.upVotes.forEach((like) => {
          const createdAt = new Date(like);
          if (createdAt.getFullYear() === currentYear) {
            const month = createdAt.getMonth()
            dataSet[month] = (dataSet[month] || 0) + 1;
          }
        });
      };
    });
    return dataSet;
  };

  const templateDataDislikes = () => {
    const dataSet = Array.from({ length: 12 }, () => 0);

    statisticData.forEach((meme) => {

      meme.downVotes.forEach((dislike) => {
        const createdAt = new Date(dislike);
        if (createdAt.getFullYear() === currentYear) {
          const month = createdAt.getMonth()
          dataSet[month] = (dataSet[month] || 0) + 1;
        }
      });
    });
    return dataSet;
  };

  const templateCountUsed = () => {
    const dataSet = Array.from({ length: 12 }, () => 0);;

    statisticData.forEach((meme) => {
        const createdAt = new Date(meme.createdAt);
        if (createdAt.getFullYear() === currentYear) {
          const month = createdAt.getMonth()
          dataSet[month] = (dataSet[month] || 0) + 1;
        }
    });

    return dataSet;
  };
  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
    <Grid>
      <Grid container spacing={2}>
        <Grid item style={{ background: "#ffffff" }}>
          <Typography variant="h4" style={{textAlign: "center", marginBottom: 20 }}>
            {currentYear} Statistics for the Template {template?.name}
          </Typography>

          <Typography variant="h6" style={{textAlign: "center"}}>
            Created Memes from this template
          </Typography>
          <BarChart
            xAxis={[{ data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], scaleType: 'band' }]}
            yAxis={[{ type: 'number' }]}
            series={[{ data: templateCountUsed(), color: "black" }]}
            width={500}
            height={250}
          />
          <Typography variant="h6" style={{textAlign: "center"}}>
            Likes/Dislikes of memes created from this template
          </Typography>
          <BarChart
            xAxis={[{ data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], scaleType: 'band' }]}
            yAxis={[{ type: 'number' }]}
            series={[{ data: templateDataLikes(), color: "green" }, { data: templateDataDislikes(), color: "red" }]}
            width={500}
            height={250}
          />
        </Grid>
      </Grid>
    </Grid>
    </Dialog>
  );
}
