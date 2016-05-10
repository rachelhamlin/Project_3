var mongoose        = require('mongoose');
var bcrypt          = require('bcryptjs');

var userSchema      = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  // address: {
  //   type: String  // This should be an array of 3 lines for formatted address
  // },
  // favorites: {
  //   type: Array // Array of objects. Not sure how to implement this yet
  // },
  public: {
    type: Boolean, // Also not sure about this
    default: false
  }
}, {timestamps: true});

// Hash the password before saving
userSchema.pre("save", function(next){
  if(this.isModified || this.isNew){
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

userSchema.methods.authenticate = function(submittedPassword){
  return bcrypt.compareSync(submittedPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
