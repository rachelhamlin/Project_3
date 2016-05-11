var mongoose        = require('mongoose');

var favoriteSchema  = mongoose.Schema({
  name:     { type: String, required: true },
  place_id: { type: String, required: true },
  type:     { type: String },
  lat:      { type: Number },
  lng:      { type: Number },
  address:  { type: String },
  notes:    { type: String }
}, {timestamps: true});

module.exports = mongoose.model("Favorite", favoriteSchema);
