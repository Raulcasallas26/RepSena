import MaterialesApoyoModel from "../models/MaterialesApoyo.js";
import url from "url"
import path from "path"
import bcrypt from "bcrypt"
import { v2 as cloudinary } from "cloudinary"

const httpMaterialesApoyo = {
    getMaterialesApoyo: async (req, res) => {
        try {
            const MaterialesApoyo = await MaterialesApoyoModel.find();
            res.json({ MaterialesApoyo });
        } catch (error) {
            res
                .status(500)
                .json({
                    mensaje: "Error al obtener infotmacion de material de apoyo",
                    error,
                });
        }
    },

    postMaterialesApoyo: async (req, res) => {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_KEY,
            api_secret: process.env.CLOUDINARY_SECRET,
            secure: true,
        });
        try {
            const { codigo, nombre, documento, descripcion } = req.body;
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
                const buscar = await MaterialesApoyoModel.findOne({ codigo: codigo });
                if (buscar) {
                    return res.status(404).json({
                        msg: ` Se encontró un Material de apoyo con el código ${codigo} en esta red`
                    });
                } else {
                    const nuevoMaterialesApoyo = new MaterialesApoyoModel({
                        codigo,
                        nombre,
                        documento,
                        descripcion,
                        documentos: result.url,
                    });

                    const MateriarlApoyoCreado = await nuevoMaterialesApoyo.save();
                    res.status(201).json({ mensaje: "Un material de apoyo insertado!!", MateriarlApoyoCreado });
                }
            }
        } catch (error) {
            console.log(error);
            return res.status(500)
                .json({ mensaje: "Error al insertar material de apoyo", error: error.message });
        }
    },

    putMaterialesApoyo: async (req, res) => {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_KEY,
            api_secret: process.env.CLOUDINARY_SECRET,
            secure: true,
        });
        try {
            const { id } = req.params;
            const { codigo, nombre, documento, descripcion } = req.body;

            const buscarCodigo = await MaterialesApoyoModel.findOne({ codigo: codigo });
            if (buscarCodigo && buscarCodigo._id.toString() !== id) {
                return res
                    .status(404)
                    .json({ msg: "Ya se encuentra un Material de apoyo registrado con ese codigo" });
            };

            let updatedData = {
                codigo: codigo,
                nombre: nombre,
                documento: documento,
                descripcion: descripcion
            };

            if (req.files && req.files.documentos) {
                const documentos = req.files.documentos;
                const extension = documentos.name.split(".").pop();
                const { tempFilePath } = documentos;
                const result = await cloudinary.uploader.upload(tempFilePath, {
                    width: 250,
                    crop: "limit",
                    resource_type: "raw",
                    allowedFormats: ["jpg", "png", "docx", "xlsx", "pptx", "pdf"],
                    format: extension,
                });

                const buscar = await MaterialesApoyoModel.findById(id);

                if (buscar.documentos) {
                    const nombreTemp = buscar.documentos.split("/");
                    const nombredocumentos = nombreTemp[nombreTemp.length - 1];
                    const [public_id] = nombredocumentos.split(".");
                    await cloudinary.uploader.destroy(public_id);
                };

                updatedData.documentos = result.url;
            };

            const buscarMatApoyo = await MaterialesApoyoModel.findByIdAndUpdate(
                { _id: id },
                { $set: updatedData },
                { new: true }
            );
            res.status(201).json(buscarMatApoyo);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    },

    putMaterialesApoyoEstado: async (req, res) => {
        const { id } = req.params;

        try {
            const MaterialesApoyo = await MaterialesApoyoModel.findOne({ id });

            if (!MaterialesApoyo) {
                return res
                    .status(400)
                    .json({ mensaje: "Material de apoyo no encontrados" });
            }

            MaterialesApoyo.estado = !MaterialesApoyo.estado;

            await MaterialesApoyo.save();

            const estadoMensaje = MaterialesApoyo.estado ? "Activo" : "Inactivo";

            res.json({
                mensaje: `Estado de material de apoyo modificado a  ${estadoMensaje}`,
                MaterialesApoyo: MaterialesApoyo,
            });
        } catch (error) {
            res
                .status(500)
                .json({
                    mensaje: "Error al cambiar la informacion del material de apoyo",
                    error,
                });
        }
    },
};

export default httpMaterialesApoyo;
