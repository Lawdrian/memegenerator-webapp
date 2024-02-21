/**
 * @swagger
 *  components:
 *    schemas:
 *      Meme:
 *        type: object
 *        required:
 *          - name
 *          - createdBy
 *          - format
 *          - content
 *          - usedTemplate
 *        properties:
 *          name:
 *            type: string
 *            description: The name of the meme.
 *          description:
 *            type: string
 *            description: The description of the meme.
 *          createdBy:
 *            type: string
 *            description: The ID of the user who created the meme.
 *          format:
 *            type: string
 *            description: The format of the meme (image, gif, video).
 *          content:
 *            type: string
 *            description: The base64 encoded content of the meme.
 *          usedTemplate:
 *            type: string
 *            description: The ID of the template used to create the meme.
 *          privacy:
 *            type: string
 *            description: The privacy setting of the meme (public, unlisted, private).
 *          upVotes:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                voteCount:
 *                  type: integer
 *                  description: The count of upvotes.
 *                voter:
 *                  type: string
 *                  description: The ID of the voter.
 *                createdAt:
 *                  type: string
 *                  format: date-time
 *                  description: The time the vote was cast.
 *          downVotes:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                voteCount:
 *                  type: integer
 *                  description: The count of downvotes.
 *                voter:
 *                  type: string
 *                  description: The ID of the voter.
 *                createdAt:
 *                  type: string
 *                  format: date-time
 *                  description: The time the vote was cast.
 *          comments:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                user:
 *                  type: string
 *                  description: The ID of the user who commented.
 *                content:
 *                  type: string
 *                  description: The content of the comment.
 *                timeStamp:
 *                  type: string
 *                  format: date-time
 *                  description: The time the comment was posted.
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/*
meme: {
	_id, 
	name, // name from meme
    description, // description from meme
	createdBy, // User object
	format, // data format ('image', 'gif', 'video')
	content, // base64 encoded meme
	usedTemplate, // Template object
	privacy, // "public", "unlisted", "private"
	upVotes,
	downVotes,
	comments,
	createdAt, //creation time
	updatedAt, //update time
}
*/
const MemeSchema = new Schema(
    {
        name: { type: String, default: "myMeme" }, // name of the meme
        description: { type: String, default: "A funny Meme" }, // name of the meme
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }, // user who created the meme
        format: {type: String, required: true}, // type of the meme either "image" or "gif" or "video"
        content: { type: String, required: true }, // meme as base64 string
        usedTemplate: {
            type: Schema.Types.ObjectId,
            ref: 'Template',
            required: true
        }, // template used to create the meme
        privacy: {
            type: String,
            default: "public"
        },
        upVotes: [ //Array of Objects
            {
                voteCount: {
                    type: Number,
                    default: 0
                },
                voter: {
                    type: String,
                },
                createdAt: { type: Date, default: Date.now }
            }
        ],
        downVotes: [
            {
                voteCount: {
                    type: Number,
                    default: 0
                },
                voter: {
                    type: String,
                },
                createdAt: {type: Date, default: Date.now}
            }
        ],
        comments : [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
                },
                content: {
                    type: String,
                    required: true
                },
                timeStamp: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    {
        timestamps: true, // adds createdAt and updatedAt fields automatically
        collection: "Meme"
    }
);

mongoose.model("Meme", MemeSchema);