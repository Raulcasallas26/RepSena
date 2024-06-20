import httpMaterialesApoyo from "../controllers/MaterialesApoyo.js";
import { Router } from "express";
import { check } from "express-validator"
import { validarResultados } from "../Middlewares/validaciones.js"
import { validarJWT } from "../Middlewares/validar-jwt.js";

const router = Router()

router.get("/",[validarJWT], httpMaterialesApoyo.getMaterialesApoyo)

router.post("/", [ 
  check("codigo","El codigo es un campo obligatorio").notEmpty().trim().isString(),
  check("nombre", "El nombre es un campo obligatorio").notEmpty().trim().isString(),
  check("documento", "El docuemnto es un campo obligatorio").notEmpty().trim().isString(),
  check("descripcion","La descripcion es un campo obligatorio").notEmpty().trim().isString(),
  check("documentos").optional(),
  validarResultados
], httpMaterialesApoyo.postMaterialesApoyo)

router.put("/:id",[
  check("codigo","El codigo es un campo obligatorio").notEmpty().trim().isString(),
  check("nombre", "El nombre es un campo obligatorio").notEmpty().trim().isString(),
  check("documento", "El docuemnto es un campo obligatorio").notEmpty().trim().isString(),
  check("descripcion","La descripcion es un campo obligatorio").notEmpty().trim().isString(),
  check("documentos").optional(),
  validarResultados
], httpMaterialesApoyo.putMaterialesApoyo)

export default router 