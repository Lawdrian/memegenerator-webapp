const mongoose = require("mongoose"); // import of mongoose-modul 
const Schema = mongoose.Schema;

//Create new schema for images
// Schema = JSON-Struktur
const ImageSchema = new Schema(    
    {
        image: String   // image as string
    },
    {
        collection: "Template", // name of collection in db
    }
);
mongoose.model("Template", ImageSchema);  // Create model with the name "Template" and schema "ImageSchema"

