import mongoose from "mongoose";

const DesarrolloCurricularSchema = new mongoose.Schema({
    nombre:{type:String},
    guias:{type:String},
    matrizCorrelacion:{type:String},
    nomMatriz:{type:String},
    proyectoFormativo:{type:String},
    nomProyecto:{type:String},
    planeacionPedagogica:{type:String}, 
    nomPlaneacion:{type:String}, 
    estado:{type: Boolean, default: true}
}) 

export default mongoose.model("DesarrolloCurricular", DesarrolloCurricularSchema)