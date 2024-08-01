import httpDesarrollo from "../controllers/DesarrolloCurricular.js";
import { Router } from "express";
import { check } from "express-validator"
import { validarResultados } from "../Middlewares/validaciones.js"
import { validarJWT } from "../Middlewares/validar-jwt.js";

const router = Router()

router.get("/", [validarJWT], httpDesarrollo.getDesarrollo)

// router.get("/:id", httpDesarrollo.getDesarrolloId)

router.post("/", [ 
    check("nombre","El nombre del sedarrollo curricular es obligatorio").notEmpty().trim().isString(),
    check("guias","las guias de aprendizaje es un campo obligatorio").notEmpty().trim().isString(),
    check("matrizCorrelacion").optional(),
    check("nomMatriz").optional(),
    check("proyectoFormativo").optional(),
    check("nomProyecto").optional(),
    check("planeacionPedagogica").optional(),
    check("nomPlaneacion").optional(),
    validarResultados
    ], httpDesarrollo.postDesarrollo)

router.put("/:id",[ 
    check("nombre","El nombre del sedarrollo curricular es obligatorio").notEmpty().trim().isString(),
    check("guias","las guias de aprendizaje es un campo obligatorio").notEmpty().trim().isString(),
    check("matrizCorrelacion").optional(),
    check("nomMatriz").optional(),
    check("proyectoFormativo").optional(),
    check("nomProyecto").optional(),
    check("planeacionPedagogica").optional(),
    check("nomPlaneacion").optional(),
    validarResultados
    ], httpDesarrollo.putDesarrollo) 

router.put("/estado/:id", httpDesarrollo.putDesarrolloEstado)

export default router