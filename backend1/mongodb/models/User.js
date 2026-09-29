const mongoose = require('mongoose');

 const userSchema = new mongoose.Schema({
    email: { type: String },
    name: { type: String },
    picture: { type: String },
    scope: { type: mongoose.Schema.Types.Mixed },
    isAuthenticated: { type: Boolean },
    created_at: { type: Date, default: Date.now },
});

const userDb = mongoose.model("users", userSchema);

module.exports = { userDb };