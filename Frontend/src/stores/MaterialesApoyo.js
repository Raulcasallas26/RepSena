import { defineStore } from 'pinia'
import axios from "axios"
import { urlBackend } from '../routes/direccion.js'
import { ref } from "vue"
import { Notify } from "quasar"
export const useMaterialesApoyoStore = defineStore(
    "MaterialesApoyo", () => {
        const addMaterialesApoyo = async (info,documentos) => {
            try {
                const formData = new FormData();;
                for (const key in info) {
                    formData.append(key, info[key])
                }
                formData.append('documentos', documentos)
                let res = await axios.post(`${urlBackend}/MaterialesApoyo`, formData, {
                    headers: { "content-Type": "multipart/form-data" }
                })
                Notify.create({
                    color: "positive",
                    message: "Se creo un material de apoyo exitosamente",
                    icon: "check",
                    position: "top",
                    timeout: 3000
                })
                return res 
            } catch (error) {
                console.log("hay un error en la post");
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

        const getMaterialesApoyo = async (token) => {
            try {
                let header = {headers:{"x-token":token}} 
                let res = await axios.get(`${urlBackend}/MaterialesApoyo`,header)
                return res
            } catch (error) {
                console.log("hay un error en el get");
                return error
            }
        }
        
        const editMaterialesApoyo = async (id, codigo, nombre, documento, descripcion, documentos, nomDoc) => {
            try {
                const formData = new FormData();
                formData.append("codigo", codigo);
                formData.append("nombre", nombre);
                formData.append("documento", documento);
                formData.append("descripcion", descripcion);
                formData.append("documentos", documentos);
                formData.append("nomDoc", nomDoc);
                let res = await axios.put(`${urlBackend}/MaterialesApoyo/${id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data", },
                })
                Notify.create({
                    color: "positive",
                    message: "Edicion del aterial de apoyo exitoso",
                    icon: "check",
                    position: "top",
                    timeout: 3000
                })
                return res
            } catch (error) {
                console.log("hay un error al editar el material de apoyo", error);
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
        const activarMaterialesApoyo = async (id) => {
            try {
                let res = await axios.put(`${urlBackend}/MaterialesApoyo/estado/${id}`)
                return res.data
            } catch (error) {
                console.log("hay un error en activarUser");
                return error
            }
        }
        return {
            addMaterialesApoyo, getMaterialesApoyo, editMaterialesApoyo, activarMaterialesApoyo, 
        }
    }
)