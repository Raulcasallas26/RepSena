import AmbientesFormacionModel from "../models/AmbientesFormacion.js"
import bcryptjs from "bcryptjs"
import url from "url"
import path from "path"
import { v2 as cloudinary } from "cloudinary"

const httpAmbientesFormacion = {
    getAmbientesFormacion: async (req, res) => {
        try {   
            const AmbientesFormacion = await AmbientesFormacionModel.find({});
            res.json({ AmbientesFormacion });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al obtener infotmacion del ambiente", error })
        }
    },

    postAmbientesFormacion: async (req, res) => {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_KEY,
            api_secret: process.env.CLOUDINARY_SECRET,
            secure: true,
        });

        try {
            const {nombre, tipo, descripcion, CentrosDeFormacion} = req.body;
            const { documentos } = req.files;
            if (documentos) {
                const extension = documentos.name.split(".").pop();
                const { tempFilePath } = documentos;
                const result = await cloudinary.uploader.upload(tempFilePath, {
                    width: 250,
                    crop: "limit",
                    resource_type: "raw",
                    allowedFormats: ["jpg", "png", "docx", "xlsx", "pptx", "pdf"],
                    format: extension,
                });
                const buscar = await AmbientesFormacionModel.findOne({ nombre: nombre });
                if (buscar) {
                    return res.status(404).json({
                        msg: ` Se encontró un AmbientesFormacion con el nombre ${nombre} en esta red`
                    });
                } else {
                    const nuevoAmbientesFormacion = new AmbientesFormacionModel({
                        nombre: nombre,
                        tipo: tipo,
                        descripcion: descripcion,
                        CentrosDeFormacion: CentrosDeFormacion,
                        documentos: result.url,
                    });
                    const AmbientesFormacionCreado = await nuevoAmbientesFormacion.save();
                    res.status(201).json({mensaje: "Un Ambiente de formacion insertado!!", AmbientesFormacionCreado});
                }
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    },
    
    putAmbientesFormacion: async (req, res) => {
        const { id } = req.params;
        const {  nombre, tipo, descripcion, documentos, CentrosDeFormacion } = req.body;
        const AmbientesFormacion = await AmbientesFormacionModel.findByIdAndUpdate(id,
            {
                nombre,
                tipo,
                descripcion,
                documentos,
                CentrosDeFormacion
            }, { new: true })
        res.json({
            msg: "ok",
            AmbientesFormacion
        })
    },


    putAmbientesFormacionEstado: async (req, res) => {
        const { id } = req.params
        const formacion = await AmbientesFormacionModel.findById(id)
        let Amnbiente = null
        if (formacion.estado) {
            Amnbiente = await AmbientesFormacionModel.findByIdAndUpdate(id, { estado: false })
        } else {
            Amnbiente = await AmbientesFormacionModel.findByIdAndUpdate(id, { estado: true })
        }
        const AmnbienteAutenticado = req.Amnbiente
        res.json({
            msj: "fue cambiado el estado",
            Amnbiente,
            AmnbienteAutenticado
        })
    },
}

export default httpAmbientesFormacion