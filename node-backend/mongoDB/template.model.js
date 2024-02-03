const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create a schema to save the templates in the database
// Schema = JSON-structure of the database
/*
template: {
	_id, 
	name, // name from template
    description, // description from template
	createdBy, // User object
	format, // data format ('image', 'gif', 'video')
	content, // base64 encoded meme
	createdAt, //creation time
	updatedAt, //update time
}
*/
const TemplateSchema = new Schema(    
    {
        name: {type: String, default: "myTemplate"}, // name of the template
        description: {type: String, default: "A good template for a meme"}, // description of the template
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        format: {type: String, required: true}, // type of the template either "image" or "gif" or "video"
        content: {type: String, required: true}, // template as base64 string
    },
    {
        timestamps: true, // adds createdAt and updatedAt fields automatically
        collection: "Template", // name of the collection inside the database
    }
);
mongoose.model("Template", TemplateSchema);

