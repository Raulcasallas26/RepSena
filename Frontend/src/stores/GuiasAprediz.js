import { defineStore } from 'pinia'
import axios from "axios"
import { urlBackend } from '../routes/direccion.js'
import { ref } from "vue"
import { Notify } from "quasar"
export const useGuiasAprendizStore = defineStore(
    "GuiasAprendiz", () => {
        const getGuiasAprendiz = async (token) => {
            try {
                let header = {headers:{"x-token":token}} 
                let res = await axios.get(`${urlBackend}/GuiasAprendiz`, header)
                return res
            } catch (error) {
                console.log("hay un error en el get");
                return error
            }
        }

        const addGuiasAprendiz = async (info, documento) => {
            try {
                const formData = new FormData();
                for (const key in info) {
                    formData.append(key, info[key])
                }
                formData.append('documento', documento)
                let res = await axios.post(`${urlBackend}/GuiasAprendiz`, formData, {
                    headers: { "content-Type": "multipart/form-data" }
                })
                Notify.create({
                    color: "positive",
                    message: "Registro de la guia de aprendizaje fue exitoso",
                    icon: "check",
                    position: "top",
                    timeout: 3000
                })
                return res
            } catch (error) {
                console.log("hay un error en la post de guias de aprendizaje");
                console.log(error);
                Notify.create({
                    color: "negative",
                    message: error.response.data.errors[0].msg,
                    icon: "check",
                    position: "top",
                    timeout: 3000
                })
                return error
            }
        }

        const editGuiasAprendiz = async (id, codigo, nombre, fase, InstrumentosEvaluacion, MaterialApoyo, documento, nomDoc) => {
            try {
                const formData = new FormData();
                formData.append("codigo", codigo);
                formData.append("nombre", nombre);
                formData.append("fase", fase);
                formData.append("InstrumentosEvaluacion", InstrumentosEvaluacion);
                formData.append("MaterialApoyo", MaterialApoyo);
                formData.append("documento", documento);
                formData.append("nomDoc", nomDoc);
                let res = await axios.put(`${urlBackend}/GuiasAprendiz/${id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data", },
                })
                Notify.create({
                    color: "positive",
                    message: "Edicion de la Guia de aprendizaje exitoso",
                    icon: "check",
                    position: "top",
                    timeout: 3000
                })
                return res
            } catch (error) {
                console.log("hay un error en editGuiasaprendizaje", error);
                console.log(error);
                Notify.create({
                    color: "negative",
                    message: error.response.data.errors[0].msg,
                    icon: "check",
                    position: "top",
                    timeout: 3000
                })
                return error
            }
        }

        const activarGuiasAprendiz = async (id) => {
            try {
                let res = await axios.put(`${urlBackend}/GuiasAprendiz/estado/${id}`)
                return res.data
            } catch (error) {
                console.log("hay un error en activarUser");
                return error
            }
        }
        return {
            addGuiasAprendiz, getGuiasAprendiz, editGuiasAprendiz, activarGuiasAprendiz, 
        }
    }
)