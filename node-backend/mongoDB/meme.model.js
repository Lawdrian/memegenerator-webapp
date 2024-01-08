const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MemeSchema = new Schema(
    {
        image: { type: String, required: true },
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        private: {
            type: Boolean,
            default: false
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
        timestamps: true,
        collection: "Meme"
    }
);

mongoose.model("Meme", MemeSchema);