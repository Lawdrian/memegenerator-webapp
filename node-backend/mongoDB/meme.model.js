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
                }
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
                }
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