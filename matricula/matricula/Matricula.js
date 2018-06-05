var mongoose = require('mongoose'); 
var MatriculaSchema = new mongoose.Schema({  
  name: String,
  email: String,
  docId: String
});
mongoose.model('Matricula', MatriculaSchema);

module.exports = mongoose.model('Matricula');