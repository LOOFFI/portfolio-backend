const { Schema, model } = require('mongoose');
const PLM = require('passport-local-mongoose');

const userSchema = new Schema(
  {
    email: String,
    encryptedPassword: { type: String, required: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

userSchema.plugin(PLM, { usernameField: 'email', passwordField: 'encryptedPassword' });

module.exports = model('User', userSchema);
