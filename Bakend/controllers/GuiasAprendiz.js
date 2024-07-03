import GuiasAprendizModel from "../models/GuiasAprendiz.js"
import url from "url"
import path from "path"
import { v2 as cloudinary } from "cloudinary"

const httpGuiasAprendiz = {
    getGuiasAprendiz: async (req, res) => {
        try {
            const GuiasAprendiz = await GuiasAprendizModel.find()
            res.json({ GuiasAprendiz });
        } catch (error) {
            res.status(500)
                .json({
                    mensaje: "Error al obtener infotmacion de las guias del aprendiz",
                    error
                });
        }
    },

    postGuiasAprendiz: async (req, res) => {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_KEY,
            api_secret: process.env.CLOUDINARY_SECRET,
            secure: true,
        });

        try {
            const {
                codigo, nombre, fase, InstrumentosEvaluacion, MaterialApoyo, nomDoc} = req.body;

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
                const buscar = await GuiasAprendizModel.findOne({ codigo: codigo });
                if (buscar) {
                    return res.status(404).json({
                        msg: ` Se encontró una guia de aprendizaje con el código ${codigo} en esta red`
                    });
                } else {
                    const GuiasAprendiz = new GuiasAprendizModel({
                        codigo,
                        nombre,
                        fase,
                        InstrumentosEvaluacion,
                        MaterialApoyo,
                        documento: result.url,
                        nomDoc,
                    });

                    const GuiaCreada = await GuiasAprendiz.save();
                    res.status(201).json({ mensaje: "Guia de aprendiz creada exitosamente!!", GuiaCreada });
                }
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ mensaje: "Error al insertar las guias del aprendiz", error: error.message });
        }
    },

    putGuiasAprendiz: async (req, res) => {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_KEY,
            api_secret: process.env.CLOUDINARY_SECRET,
            secure: true,
        });

        try {
            const { id } = req.params;
            const {
                codigo, nombre, fase, InstrumentosEvaluacion, MaterialApoyo, nomDoc
            } = req.body;

            const buscarCodigo = await GuiasAprendizModel.findOne({ codigo: codigo });
            if (buscarCodigo && buscarCodigo._id.toString() !== id) {
                return res
                    .status(404)
                    .json({ msg: "Ya se encuentra un Usuario registrado con ese codigo" });
            };

            let updatedData = {
                codigo: codigo,
                nombre: nombre,
                fase: fase,
                InstrumentosEvaluacion: InstrumentosEvaluacion,
                MaterialApoyo: MaterialApoyo,
                nomDoc: nomDoc,
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

                const buscar = await GuiasAprendizModel.findById(id);

                if (buscar.documento) {
                    const nombreTemp = buscar.documento.split("/");
                    const nombredocumento = nombreTemp[nombreTemp.length - 1];
                    const [public_id] = nombredocumento.split(".");
                    await cloudinary.uploader.destroy(public_id);
                };

                updatedData.documento = result.url;
            };

            const buscarGuia = await GuiasAprendizModel.findByIdAndUpdate(
                { _id: id },
                { $set: updatedData },
                { new: true }
            );
            res.status(201).json(buscarGuia);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    },

    putGuiasAprendizEstado: async (req, res) => {
        const { id } = req.params;

        try {

            const GuiasAprendiz = await GuiasAprendizModel.findOne({ id });

            if (!GuiasAprendiz) {
                return res.status(400).json({ mensaje: "guias de aprendiz no encontrados" });
            }

            GuiasAprendiz.estado = !GuiasAprendiz.estado

            await GuiasAprendiz.save();

            const estadoMensaje = GuiasAprendiz.estado ? "Activo" : "Inactivo";

            res.json({
                mensaje: `Estado de guias de aprendiz modificado a  ${estadoMensaje}`,
                GuiasAprendiz: GuiasAprendiz
            });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al cambiar la informacion de las guias de aprendiz", error })
        }
    }
}

export default httpGuiasAprendiz