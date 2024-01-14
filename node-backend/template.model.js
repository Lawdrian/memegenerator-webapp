const mongoose = require("mongoose");

// create a schema to save the templates in the database
// Schema = JSON-structure of the database
const templateSchema = new mongoose.Schema(    
    {
        name: String, // name of the template
        type: String, // type of the template either "image" or "gif" or "video"
        content: String, // image as string
    },
    {
        collection: "Template", // name of the collection inside the database
    }
);
mongoose.model("Template", templateSchema);

