import httpGuiasAprendiz from "../controllers/GuiasAprendiz.js";
import { Router } from "express";
import {check} from "express-validator"
import {validarResultados} from "../Middlewares/validaciones.js"
import { validarJWT, sinTokenMiddleware } from "../Middlewares/validar-jwt.js";

const router = Router()

  router.get("/",[validarJWT], httpGuiasAprendiz.getGuiasAprendiz)
  
  router.post("/", [
    check("codigo","el codigo es obligatorio",).notEmpty().trim().isString(),
    check("nombre","el nombre es obligatorio").notEmpty().trim().isString(),
    check("fase","la fase es obligatoria").notEmpty().trim().isString(),
    check("documento").optional(),
    check("nomDoc").optional(),
    check("InstrumentosEvaluacion","el id de los instrumentos de evaluacion es obligatorio").notEmpty().trim().isString(),
    check("MaterialApoyo","el id de material de apoyo es obligatorio").notEmpty().trim().isString(),
    validarResultados    
  ], httpGuiasAprendiz.postGuiasAprendiz)
  
  router.put("/:id", [
    check("codigo","el codigo es obligatorio",).notEmpty().trim().isString(),
    check("nombre","el nombre es obligatorio").notEmpty().trim().isString(),
    check("fase","la fase es obligatoria").notEmpty().trim().isString(),
    check("documento").optional(),
    check("nomDoc").optional(),
    check("InstrumentosEvaluacion","el id de los instrumentos de evaluacion es obligatorio").notEmpty().trim().isString(),
    check("MaterialApoyo","el id de material de apoyo es obligatorio").notEmpty().trim().isString(),
    validarResultados    
  ],httpGuiasAprendiz.putGuiasAprendiz)
  
  export default router