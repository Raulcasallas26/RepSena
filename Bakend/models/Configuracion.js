import mongoose from "mongoose";

const ConfiguracionSchema = new mongoose.Schema({
    nombre:{type:String, require: true},
    apellido:{type:String, require: true},
    cedula:{type:String, require: true, unique:true},
    telefono:{type:String, require: true},
    email:{type:String, require: true, unique:true}, 
    perfilProfesional:{type:String, require: true},
    curriculum:{type:String, require: true}, 
    estado:{type: Boolean, default: true, require: true},
}) 

export default mongoose.model("Configuracion", ConfiguracionSchema)  