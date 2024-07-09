import DesarrolloCurricularModel from "../models/DesarrolloCurricular.js"
import url from "url"
import path from "path"
import { v2 as cloudinary } from "cloudinary"

const httpDesarrollo = {
    getDesarrollo: async (req, res) => {
        try {
            const Desarrollo = await DesarrolloCurricularModel.find();
            res.status(200).json({ Desarrollo });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al obtener los Desarrollo", error })
        }
    },

    postDesarrollo: async (req, res) => {
        const { guiasAprendizaje, matrizCorrelacion, proyectoFormativo, planeacionPedagogica } = req.body;
        try {
            const Desarrollo = new DesarrolloCurricularModel({
                guiasAprendizaje,
                matrizCorrelacion,
                proyectoFormativo,
                planeacionPedagogica
            });
            await Desarrollo.save();
            res.json({
                mensaje: "Un Desarrollo insertado!!",
                Desarrollo
            });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al insertar el Desarrollo", error });
        }
    },

    putDesarrollo: async (req, res) => {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_KEY,
            api_secret: process.env.CLOUDINARY_SECRET,
            secure: true,
        });

        try {
            const { id } = req.params;
            const {
                nombre, guias, nomMatriz, nomProyecto, nomPlaneacion
            } = req.body;

            const buscarNombre = await DesarrolloCurricularModel.findOne({ nombre: nombre });
            if (buscarNombre && buscarNombre._id.toString() !== id) {
                return res
                    .status(404)
                    .json({ msg: `Ya se encuentra un Usuario registrado con ese Nombre ${nombre}` });
            };

            let updatedData = {
                nombre: nombre,
                guias: guias,
                nomMatriz: nomMatriz,
                nomProyecto: nomProyecto,
                nomPlaneacion: nomPlaneacion,
            };

            if (req.files && req.files.matrizCorrelacion) {
                const matrizCorrelacion = req.files.matrizCorrelacion;
                const extension = matrizCorrelacion.name.split(".").pop();
                const { tempFilePath } = matrizCorrelacion;
                const result = await cloudinary.uploader.upload(tempFilePath, {
                    width: 250,
                    crop: "limit",
                    resource_type: "raw",
                    allowedFormats: ["jpg", "png", "docx", "xlsx", "pptx", "pdf"],
                    format: extension,
                });

                const buscar = await DesarrolloCurricularModel.findById(id);

                if (buscar.matrizCorrelacion) {
                    const nombreTemp = buscar.matrizCorrelacion.split("/");
                    const nombrematrizCorrelacion = nombreTemp[nombreTemp.length - 1];
                    const [public_id] = nombrematrizCorrelacion.split(".");
                    await cloudinary.uploader.destroy(public_id);
                };

                updatedData.matrizCorrelacion = result.url;
            };

            if (req.files && req.files.proyectoFormativo) {
                const proyectoFormativo = req.files.proyectoFormativo;
                const extension = proyectoFormativo.name.split(".").pop();
                const { tempFilePath } = proyectoFormativo;
                const result = await cloudinary.uploader.upload(tempFilePath, {
                    width: 250,
                    crop: "limit",
                    resource_type: "raw",
                    allowedFormats: ["jpg", "png", "docx", "xlsx", "pptx", "pdf"],
                    format: extension,
                });

                const buscar = await DesarrolloCurricularModel.findById(id);

                if (buscar.proyectoFormativo) {
                    const nombreTemp = buscar.proyectoFormativo.split("/");
                    const nombreproyectoFormativo = nombreTemp[nombreTemp.length - 1];
                    const [public_id] = nombreproyectoFormativo.split(".");
                    await cloudinary.uploader.destroy(public_id);
                };

                updatedData.proyectoFormativo = result.url;
            };

            if (req.files && req.files.planeacionPedagogica) {
                const planeacionPedagogica = req.files.planeacionPedagogica;
                const extension = planeacionPedagogica.name.split(".").pop();
                const { tempFilePath } = planeacionPedagogica;
                const result = await cloudinary.uploader.upload(tempFilePath, {
                    width: 250,
                    crop: "limit",
                    resource_type: "raw",
                    allowedFormats: ["jpg", "png", "docx", "xlsx", "pptx", "pdf"],
                    format: extension,
                });

                const buscar = await DesarrolloCurricularModel.findById(id);

                if (buscar.planeacionPedagogica) {
                    const nombreTemp = buscar.planeacionPedagogica.split("/");
                    const nombrecurriculum = nombreTemp[nombreTemp.length - 1];
                    const [public_id] = nombrecurriculum.split(".");
                    await cloudinary.uploader.destroy(public_id);
                };

                updatedData.planeacionPedagogica = result.url;
            };

            const buscarUsuario = await DesarrolloCurricularModel.findByIdAndUpdate(
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

    putDesarrolloEstado: async (req, res) => {
        const { id } = req.params
        const usu = await DesarrolloCurricularModel.findById(id)
        let Desarrollo = null
        if (usu.estado) {
            Desarrollo = await DesarrolloCurricularModel.findByIdAndUpdate(id, { estado: false })
        } else {
            Desarrollo = await DesarrolloCurricularModel.findByIdAndUpdate(id, { estado: true })
        }
        const DesarrolloAutenticado = req.Desarrollo
        res.json({
            msj: "fue cambiado el estado",
            Desarrollo,
            DesarrolloAutenticado
        })
    },
}

export default httpDesarrollo