var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

// define user schema attributes / fields
var UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true},
  password: String,

  profile: {
    name: { type: String, default: ''},
    picture: { type: String, default: ''}
  },

  address: String,
  history: [{
    date: Date,
    // exclude later
    paid: { type: Number, default: 0},
    // item: { type: Schema.Types.ObjectId, ref: ''}
  }]
});

// hash the password before  sending to database
UserSchema.pre('save', function(nextcall) {
  var user = this;
  if (!user.isModified('password')) return nextcall();
  bcrypt.genSalt(13, function(err, salt) {
    if (err) return nextcall(err);
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return nextcall(err);
      user.password = hash;
      nextcall();
    });
  });
});

// compare password in the database
// below is a custom method name after UserSchema.methods
UserSchema.methods.comparePassword = function(password) {
  // 'this refers to UserSchema.password, while 'password' refers to user input
  return bcrypt.compareSync(password, this.password);
}

// export the whole Schema
module.exports = mongoose.model('User', UserSchema);
