const mongoose = require('mongoose');
const mongoosePaginate= require('mongoose-paginate');

const UsuarioSchema = new mongoose.Schema({
    nome:String,
    email:String,
    senha:String,
    dataNascimento:Date,
    status:Boolean,
    verificado:Boolean,
    token:String
});
UsuarioSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Usuario',UsuarioSchema); 