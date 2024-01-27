const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/*
draft: {
	_id, 
	name, // name from draft
	createdBy, // User object
	format, // data format ('image', 'gif', 'video')
	textProperties, // textproperties of the draft Array of Objects
	usedTemplate, // Template object
	createdAt, //creation time
	updatedAt, //update time
}
*/
const DraftSchema = new Schema(
    {
      name: { type: String, default: "myDraft" }, // name of the draft
      createdBy: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true
      }, // user who created the draft
      format: {type: String, required: true}, // type of the draft either "image" or "gif" or "video"
      textProperties: { type: Array, required: true }, // properties of the draft
      usedTemplate: {
          type: Schema.Types.ObjectId,
          ref: 'Template',
          required: true
      }, // template used to create the draft
    },
    {
        timestamps: true, // adds createdAt and updatedAt fields automatically
        collection: "Draft"
    }
);

mongoose.model("Draft", DraftSchema);