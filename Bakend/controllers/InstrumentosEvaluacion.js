import InstrumentoEvaluacionModel from "../models/InstrumentosEvaluacion.js"
import url from "url"
import path from "path"
import { v2 as cloudinary } from "cloudinary"

const httpInstrumentosEvaluacion = {
    getInstrumentosEvaluacion: async (req, res) => {
        try {
            const InstrumentosEvaluacion = await InstrumentoEvaluacionModel.find();
            res.json({ InstrumentosEvaluacion });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al obtener infotmacion de instrumentos de evaluacion", error })
        }
    },

    postInstrumentosEvaluacion: async (req, res) => {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_KEY,
            api_secret: process.env.CLOUDINARY_SECRET,
            secure: true,
        });

        try {
            const { nombre, nomDoc } = req.body;
            const { documento } = req.files;
            if (documento) {
                const extension = documento.name.split(".").pop();
                const { tempFilePath } = documento;
                const result = await cloudinary.uploader.upload(tempFilePath, {
                    width: 250,
                    crop: "limit",
                    resource_type: "raw",
                    allowedFormats: ["jpg", "png", "docx", "xlsx", "pptx", "pdf"],
                    format: extension,
                });
                const buscar = await InstrumentoEvaluacionModel.findOne({ nombre: nombre });
                if (buscar) {
                    return res.status(404).json({
                        msg: ` Se encontró un Instrumento de evaluacion con el nmombre ${nombre} en esta red`
                    });
                } else {
                    const InstrumentosEvaluacion = new InstrumentoEvaluacionModel({
                        nombre,
                        documento: result.url,
                        nomDoc,
                    });

                    const InstrumentoCreado = await InstrumentosEvaluacion.save();
                    res.status(201).json({ mensaje: "Un material de apoyo insertado!!", InstrumentoCreado });
                }
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ mensaje: "Error al insertar el instrumento de evaluación", error: error.message });
        }
    },

    putInstrumentosEvaluacion: async (req, res) => {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_KEY,
            api_secret: process.env.CLOUDINARY_SECRET,
            secure: true,
        });
        try {
            const { id } = req.params;
            const { nombre, nomDoc} = req.body;

            const buscarnombre = await InstrumentoEvaluacionModel.findOne({ nombre: nombre });
            if (buscarnombre && buscarnombre._id.toString() !== id) {
                return res
                    .status(404)
                    .json({ msg: "Ya se encuentra un Instrumento de evaluacion registrado con ese nombre" });
            };

            let updatedData = {
                nombre: nombre,
                nomDoc: nomDoc
            };

            if (req.files && req.files.documento) {
                const documento = req.files.documento;
                const extension = documento.name.split(".").pop();
                const { tempFilePath } = documento;
                const result = await cloudinary.uploader.upload(tempFilePath, {
                    width: 250,
                    crop: "limit",
                    resource_type: "raw",
                    allowedFormats: ["jpg", "png", "docx", "xlsx", "pptx", "pdf"],
                    format: extension,
                });

                const buscar = await InstrumentoEvaluacionModel.findById(id);

                if (buscar.documento) {
                    const nombreTemp = buscar.documento.split("/");
                    const nombredocumento = nombreTemp[nombreTemp.length - 1];
                    const [public_id] = nombredocumento.split(".");
                    await cloudinary.uploader.destroy(public_id);
                };

                updatedData.documento = result.url;
            };

            const InstrumentoEdit = await InstrumentoEvaluacionModel.findByIdAndUpdate(
                { _id: id },
                { $set: updatedData },
                { new: true }
            );
            res.status(201).json(InstrumentoEdit);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    },

    putInstrumentosEvaluacionEstado: async (req, res) => {
        const { id } = req.params
        const instrument = await InstrumentoEvaluacionModel.findById(id)
        let Instrumento = null
        if (instrument.estado) {
            Instrumento = await InstrumentoEvaluacionModel.findByIdAndUpdate(id, { estado: false })
        } else {
            Instrumento = await InstrumentoEvaluacionModel.findByIdAndUpdate(id, { estado: true })
        }
        const InstrumentoAutenticado = req.Instrumento
        res.json({
            msj: "fue cambiado el estado",
            Instrumento,
            InstrumentoAutenticado
        })
    },
}

export default httpInstrumentosEvaluacion