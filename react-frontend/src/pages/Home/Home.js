import React, { useState, useEffect } from "react";
import axios from "axios";
import Post from "./Posts/Post";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { setTemplates } from "../../slices/templateSlice";
import { v4 as uuidv4 } from "uuid";
import "./Home.css";

function Home() {
  const dispatch = useDispatch();
  const templates = useSelector((state) => state.template.templates);

  useEffect(() => {
    fetch("http://localhost:3001/template")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          dispatch(setTemplates({ templates: data.data }));
        } else {
          console.error("Failed calling templates", data.message);
        }
      })
      .catch((error) => {
        console.error("Failed calling templates", error);
      });
  }, [dispatch]);

  return (
    <div>
      <h1>Templates</h1>
      <div className="template-list">
        {templates.map((template) => {
          const key = uuidv4();
          return (
            <div key={key} className="template">
              <h2>{template.name}</h2>
              <div className="template-image">
                <img src={template.content} alt={`Template ${template.id}`} />
              </div>
              {/* Add more information or styling as needed */}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
