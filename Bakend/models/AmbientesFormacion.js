import mongoose from "mongoose";

const AmbientesFormacionSchema = new mongoose.Schema({
    nombre:{type:String},
    tipo:{type:String},
    descripcion:{type:String},
    CentroDeFormacion:{type:Object},
    documentos:{type:String},
    estado:{type: Boolean, default: true},
}) 

export default mongoose.model("AmbientesFormacion", AmbientesFormacionSchema)