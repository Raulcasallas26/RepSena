import { validationResult } from 'express-validator';

function validarResultados(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(errors);
    }
    
    next();
}

export { validarResultados };
export default validarResultados;
