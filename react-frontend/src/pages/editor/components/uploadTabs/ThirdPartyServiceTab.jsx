import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import React from "react";
import { Grid } from "@mui/material";
import { fetchImgflipTemplates } from "../../../../api/template";
import { convertUrlToBase64 } from "../../../../utils/base64Conversions";

function ThirdPartyServiceTab({template, setTemplate}) {

  const [templates, setTemplates] = useState([]); // Setze den Initialwert auf null
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  useEffect(() => {
    fetchImgflipTemplates().then(fetchedTemplates => {
      setTemplates(fetchedTemplates);
     });
  }, []);

  const handleClickEvent = (image) => {
    convertUrlToBase64(image.url).then(base64 => {
      setTemplate({...template, content: base64, format: 'image'}) 
      setSelectedTemplateId(image.id); // Set the selected template when an image is clicked
    })
  }

  const imageStyle = {
    width: '20%',
    gap: '20px',
    height: 'auto',
    borderRadius: '10%',
    border: '1px solid #000',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    margin: '20px'
  };
  
  const selectedImageStyle = {
    ...imageStyle,
    border: '3px solid dodgerblue'
  };

  return (
    <div className="auth-wrapper">
      <Grid container className="auth-inner" style={{ width: "auto", display: "flex", justifyContent:"center", alignItems:"center"}}>
        {templates && templates.map(image => (
          <img
            key={image.id}
            src={image.url}
            alt={image.name}
            style={selectedTemplateId === image.id ? selectedImageStyle : imageStyle}
            onClick={() => handleClickEvent(image)}
          />
        ))}
      </Grid>
    </div>
    )
}

export default ThirdPartyServiceTab;
