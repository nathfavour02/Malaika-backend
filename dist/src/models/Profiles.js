"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const profileSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});
/**
 * Mongoose Model based on TProfile for TypeScript.
 * https://mongoosejs.com/docs/models.html
 *
 * TProfile
 * @param user:ref => User._id
 * @param firstName:string
 * @param lastName:string
 * @param username:string
 */
const Profile = (0, mongoose_1.model)("Profile", profileSchema);
exports.default = Profile;
//# sourceMappingURL=Profiles.js.map