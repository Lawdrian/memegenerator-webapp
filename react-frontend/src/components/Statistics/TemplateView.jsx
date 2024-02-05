import { Grid, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { getTempRefMemes } from '../../api/template';

export default function TemplateView({ template }) {
  const [templateData, setTemplateData] = useState([]);
  const defaultData = Array.from({ length: 12 }, () => 0);

  useEffect(() => {
    getTempData();
    console.log(templateData)
  }, [template]);

  const getTempData = async () => {
    try {
      const data = await getTempRefMemes(template);
      console.log(data);
      setTemplateData(data.memeDetails || []);
    } catch (error) {
      console.error(error);
    }
  };

  const templateDataLikes = () => {
    const dataSet = Array.from({ length: 12 }, () => 0);

    templateData.forEach((meme) => {
      if(meme.upVotes.length == 0 ){return dataSet}
      else{
        meme.upVotes.forEach((like) => {
          const createdAt = new Date(like);
          const month = createdAt.getMonth() + 1; // Month is 0-indexed
  
          dataSet[month] = (dataSet[month] || 0) + 1;
        });
      };
    });

    console.log("Like: "+ dataSet);
    return dataSet;
  };

  const templateDataDislikes = () => {
    const dataSet = Array.from({ length: 12 }, () => 0);

    templateData.forEach((meme) => {

      meme.downVotes.forEach((dislike) => {
        const createdAt = new Date(dislike);
        const month = createdAt.getMonth() + 1; // Month is 0-indexed

        dataSet[month] = (dataSet[month] || 0) + 1;
      });
    });

    console.log(dataSet);
    return dataSet;
  };

  const templateCountUsed = () => {
    const dataSet = Array.from({ length: 12 }, () => 0);

    templateData.forEach((meme) => {
        const createdAt = new Date(meme.createdAt);
        const month = createdAt.getMonth() + 1; // Month is 0-indexed

        dataSet[month] = (dataSet[month] || 0) + 1;
    });

    console.log(dataSet);
    return dataSet;
  };
  return (
    <Grid>
      <Grid container spacing={2}>
        <Grid item style={{ background: "#ffffff" }}>
          <Typography variant="h4" style={{ color: "green", textAlign: "center", marginBottom: 20 }}>
            Likes/Dislikes over the time for the RefMemes
          </Typography>
          <BarChart
            xAxis={[{ data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], scaleType: 'band' }]}
            yAxis={[{ type: 'number' }]}
            series={[{ data: templateDataLikes(), color: "green" }, { data: templateDataDislikes(), color: "red" }]}
            width={500}
            height={250}
          />
          <Typography variant="h4" style={{ color: "green", textAlign: "center", marginBottom: 20 }}>
            Used Template
          </Typography>
          <BarChart
            xAxis={[{ data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], scaleType: 'band' }]}
            yAxis={[{ type: 'number' }]}
            series={[{ data: templateCountUsed(), color: "black" }]}
            width={500}
            height={250}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
