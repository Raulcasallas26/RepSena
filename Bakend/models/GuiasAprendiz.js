import mongoose from "mongoose";

const GuiasAprendizSchema = new mongoose.Schema({
    codigo:{type:String},
    nombre:{type:String},
    fase:{type:String},
    InstrumentosEvaluacion:{type:String},
    MaterialApoyo:{type:String},
    documento:{type:String},
    nomDoc:{type:String},
    estado:{type:Boolean, default:true} 
}) 

export default mongoose.model("GuiasAprendiz", GuiasAprendizSchema)