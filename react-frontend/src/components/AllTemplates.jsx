import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { Grid, Button, TextField } from "@mui/material";
import { getAlltemplates, handleCommentSubmit, handleDownVote, handleUpVote } from "../api/template.js";
import "./myMemes.css";
import TemplateView from "./Statistics/TemplateView.jsx";

//API

export default function AllTemplates() {
    const [showStatistics, setShowStatistik] = useState(false);
    const [allTemplate, setAllTemplate] = useState([]);
    const token = useSelector((state) => state.user.token);
    const template = useSelector((state) => state.template);


    useEffect(() => {
         setAllTemplate(template.templates);
    }, [template]);

    const handleStatistikClick = (templateId) => {
        const updatedtemplates = allTemplate.map((template) => {
            if (template._id === templateId) {
                return { ...template, showStatistics: !template.showStatistics };
            }
            return template;
        });
          setAllTemplate(updatedtemplates);
    };


    return (
        <Grid style={{ padding: "50px", background: "#DDDDDD44" }}>
            {allTemplate?.length > 0 && allTemplate.map((template) => (
                <Grid style={{ padding: 5 }} key={template._id}>
                    <Grid container>
                        <Grid item xs={12} md={4}>
                            <Grid style={{ display: "flex" }}>
                               <img src={template.content} alt="DAS BILD IST ECHT GEIL FINDET IHR NICHT?" style={{ width: "auto", height: "300px" }} />
                                {template.showStatistics && <TemplateView template={template} />}
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            {template.comments && template.comments.length > 0 && (
                                <>
                                    {template.comments.map((comment, index) => (
                                        <div key={index}>
                                            <p>{comment.user.email}: {comment.content}</p>
                                        </div>
                                    ))}
                                </>
                            )}
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Button onClick={() => handleStatistikClick(template._id)} variant="contained" color="info" style={{ margin: 5 }}>
                            Statistik
                        </Button>
                    </Grid>
                </Grid>
            ))}
        </Grid>
    );
}
