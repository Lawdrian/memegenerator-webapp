import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { Grid, Button, TextField } from "@mui/material";
import { getAlltemplates, handleCommentSubmit, handleDownVote, handleUpVote } from "../api/template.js";
import "./myMemes.css";
import TemplateStatistics from "./Statistics/TemplateStatistics.jsx";

//API

export default function AllTemplates() {
    const [allTemplate, setAllTemplate] = useState([]);
    const token = useSelector((state) => state.user.token);
    const template = useSelector((state) => state.template);


    useEffect(() => {
         setAllTemplate(template.templates);
    }, [template]);



    return (
        <Grid style={{ padding: "50px", background: "#DDDDDD44" }}>
            {allTemplate?.length > 0 && allTemplate.map((template) => (
                <Grid style={{ padding: 5 }} key={template._id}>
                    <Grid container>
                        <Grid item xs={12} md={4}>
                            <Grid style={{ display: "flex" }}>
                               <img src={template.content} alt="DAS BILD IST ECHT GEIL FINDET IHR NICHT?" style={{ width: "auto", height: "300px" }} />
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
                </Grid>
            ))}
        </Grid>
    );
}
