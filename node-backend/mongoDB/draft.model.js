/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Draft:
 *       type: object
 *       required:
 *         - createdBy
 *         - format
 *         - textProperties
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the draft
 *         name:
 *           type: string
 *           description: The name of your draft
 *         description:
 *           type: string
 *           description: The description of your draft
 *         createdBy:
 *           type: string
 *           description: The draft creator
 *         format:
 *           type: string
 *           description: Draft format ('image', 'gif', 'video')
 *         textProperties:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the draft was created
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The date the draft was last updated
 *       example:
 *         _id: 65beb09bdb3ca678ad8bcae2
 *         name: "bestDraft"
 *         description: "This is the best draft ever!"
 *         createdBy: "65beb006db3ca678ad8bcabc"
 *         format: "image" 
 *         textProperties: []
 *         createdAt: 2024-02-03T21:31:07.168+00:00	
 *         updatedAt: 2024-02-03T21:31:07.168+00:00
 */

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