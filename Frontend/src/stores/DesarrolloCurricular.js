import { defineStore } from 'pinia'
import axios from "axios"
import { urlBackend } from '../routes/direccion.js'
import { ref } from "vue"
import { Notify } from "quasar"
export const useDesarrolloCurricularStore = defineStore(
    "DesarrolloCurricular", () => {
        const addDesarrolloCurricular = async (info) => {
            try {
                let res = await axios.post(`${urlBackend}/desarrolloCurricular`, info)
                Notify.create({
                    color: "positive",
                    message: "Registro del Desarrollo Curricular exitoso",
                    icon: "check",
                    position: "top",
                    timeout: 3000
                })
                return res
            } catch (error) {
                console.log("hay un error en la post DesarrolloCurricular");
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

        const getDesarrolloCurricular = async (token) => {
            try {
                let header = { headers: { "x-token": token } }
                let res = await axios.get(`${urlBackend}/desarrolloCurricular`, header)
                return res
            } catch (error) {
                console.log(error);
                console.log("hay un error en el get DesarrolloCurricular");
                return error
            }
        }

        const editDesarrolloCurricular = async (id, nombre, guias, matrizCorrelacion, nomMatriz, proyectoFormativo, nomProyecto, planeacionPedagogica, nomPlaneacion) => {
            try {
                const formData = new FormData();
                formData.append("nombre", nombre);
                formData.append("guias", guias);
                formData.append("matrizCorrelacion", matrizCorrelacion);
                formData.append("nomMatriz", nomMatriz);
                formData.append("proyectoFormativo", proyectoFormativo);
                formData.append("nomProyecto", nomProyecto);
                formData.append("planeacionPedagogica", planeacionPedagogica);
                formData.append("nomPlaneacion", nomPlaneacion);
                let res = await axios.put(`${urlBackend}/desarrolloCurricular/${id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data", },
                })
                Notify.create({
                    color: "positive",
                    message: "Edicion del Desarrollo Curricular fue exitoso",
                    icon: "check",
                    position: "top",
                    timeout: 3000
                })
                return res
            } catch (error) {
                console.log("hay un error en editDesarrollo", error);
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

        const activarDesarrolloCurricular = async (id) => {
            try {
                let res = await axios.put(`${urlBackend}/desarrolloCurricular/estado/${id}`)
                return res.data
            } catch (error) {
                console.log("hay un error en activarDesarrolloCurricular");
                return error
            }
        }
        return {
            addDesarrolloCurricular, getDesarrolloCurricular, editDesarrolloCurricular, activarDesarrolloCurricular,
        }
    }
)