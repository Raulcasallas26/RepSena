import mongoose from "mongoose";

const MaterialesApoyoSchema = new mongoose.Schema({
    codigo: {type: String},
    nombre:{type:String}, 
    documento:{type:String},
    descripcion:{type:String},
    documentos:{type:String},
    nomDoc:{type:String},
}) 

export default mongoose.model("MaterialesApoyo", MaterialesApoyoSchema)

