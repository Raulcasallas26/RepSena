import ConfiguracionModel from "../models/Configuracion.js"
import bcrypt from "bcrypt"
import url from "url"
import path from "path"
import { v2 as cloudinary } from "cloudinary"

const httpConfiguracion = {
    putConfiguracion: async (req, res) => {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_KEY,
            api_secret: process.env.CLOUDINARY_SECRET,
            secure: true,
        });

        try {
            const { id } = req.params;
            const {
                nombre, apellido, cedula, telefono, email, perfilProfesional, 
            } = req.body;


            const buscarCodigo = await ConfiguracionModel.findOne({ cedula: cedula });
            if (buscarCodigo && buscarCodigo._id.toString() !== id) {
                return res
                    .status(404)
                    .json({ msg: "Ya se encuentra un Usuario registrado con ese codigo" });
            };

            let updatedData = {
                nombre: nombre,
                apellido: apellido,
                cedula: cedula,
                telefono: telefono,
                email: email,
                password: password,
                perfilProfesional: perfilProfesional,
            };

            if (req.files && req.files.curriculum) {
                const curriculum = req.files.curriculum;
                const extension = curriculum.name.split(".").pop();
                const { tempFilePath } = curriculum;
                const result = await cloudinary.uploader.upload(tempFilePath, {
                    width: 250,
                    crop: "limit",
                    resource_type: "raw",
                    allowedFormats: ["jpg", "png", "docx", "xlsx", "pptx", "pdf"],
                    format: extension,
                });

                const buscar = await ConfiguracionModel.findById(id);

                if (buscar.curriculum) {
                    const nombreTemp = buscar.curriculum.split("/");
                    const nombrecurriculum = nombreTemp[nombreTemp.length - 1];
                    const [public_id] = nombrecurriculum.split(".");
                    await cloudinary.uploader.destroy(public_id);
                };
                updatedData.curriculum = result.url;
            };
            const buscarUsuario = await ConfiguracionModel.findByIdAndUpdate(
                { _id: id },
                { $set: updatedData },
                { new: true }
            );
            res.status(201).json(buscarUsuario);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    },
}

export default httpConfiguracion