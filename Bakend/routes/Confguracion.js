import httpUsuarios from "../controllers/Configuracion.js";
import { Router } from "express";
import { check } from "express-validator"
import { validarResultados } from "../Middlewares/validaciones.js"
import validarUnicos from "./validar.js"
import { validarJWT } from "../Middlewares/validar-jwt.js";
const router = Router()
router.put("/:id", [
    check("nombre", "El nombre es obligatorio").notEmpty().trim().isString(),
    check("apellidos", "El apellido es obligatorio",).notEmpty().trim().isString(),
    check("cedula", "El numero de cedula es obligatorio").trim().not().isEmpty(),
    check("telefono", "El telefono es obligatorio").trim().not().isEmpty(),
    check("email", "El correo es obligatorio").trim().not().isEmpty(),
    // check("email", "Formato de E-mail no valido").isEmail(),
    check("perfilProfesional", "El perfil profecional es obligatorio").notEmpty().trim().isString(),
    // check("curriculum", "El curriculum es obligatorio").notEmpty().trim().isString(),
    check("RolUsuario", "El rol del usuario es obligatorio").notEmpty().trim().isString(),
    check("RedConocimiento", "La red de conocimiento es obligatoria").notEmpty().trim().isString(),
    validarResultados,
], httpUsuarios.putConfiguracion)


export default router 