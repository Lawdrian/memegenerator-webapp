const mongoose = require("mongoose"); // Importiere das Mongoose-Modul

// Erstelle ein neues Schema für die Bilder
// Schema = JSON-Struktur
const ImageSchema = new mongoose.Schema(    
    {
        image: String   // Bild als String
    },
    {
        collection: "Template", // Name der Collection in der Datenbank
    }
);
mongoose.model("Template", ImageSchema);  // Erstellen eines Models mit dem Namen "Template" und dem Schema "ImageSchema"

