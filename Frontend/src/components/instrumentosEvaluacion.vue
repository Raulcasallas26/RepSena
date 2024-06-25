<template>
    <div class="card-container">
        <div v-if="load == true" style="margin-top: 5px">
            <q-linear-progress ark rounded indeterminate color="green" />
        </div>
        <div v-else class="body">
            <q-btn style="background-color: green; color: white" :disable="loading === true" label="Agregar"
                @click="alert = true" />
            <div style="margin-left: 5%" class="text-h4">
                Instrumentos de Evaluacion
            </div>
            <q-space />
            <q-input borderless dense debounce="300" style="border-radius: 10px; border: grey solid 0.5px; padding: 5px"
                color="primary">
                <template v-slot:append>
                    <q-icon name="search" />
                </template>
            </q-input>
        </div>
        <div>
            <div v-for="(instrumento, index) in Instrumentos" :key="index">
                <div class="card">
                    <div class="top-half" style="display: flex">
                        <div class="info">
                            <p><strong>Nombre:</strong> {{ instrumento.nombre }}</p>
                            <p><strong>Documentos:  </strong><a :href="instrumento.documento"
                                    target="_blank">  {{ instrumento.nomDoc }} </a>  </p>
                            <strong>Estado: </strong>
                            <span class="text-green" v-if="instrumento.estado === true">
                                Activo</span>
                            <span class="text-red" v-else> Inactivo</span>
                        </div>
                        <div>
                            <div class="q-pa-md">
                                <q-btn-dropdown id="botonDesplegable"
                                    style="background-color: rgba(255, 255, 255, 0); border: none" icon="more_vert">
                                    <q-list>
                                        <q-item v-close-popup>
                                            <q-item-section>
                                                <q-btn icon="edit" @click="edito(index)" id="botonDesplegable"
                                                    color="black" outline>
                                                </q-btn>
                                            </q-item-section>
                                        </q-item>
                                        <q-item v-close-popup>
                                            <q-item-section>
                                                <q-btn icon="download" id="botonDesplegable" color="primary" outline>
                                                </q-btn>
                                            </q-item-section>
                                        </q-item>
                                        <q-item v-close-popup>
                                            <div style="display: flex; justify-content: flex-end">
                                                <q-btn id="botonDesplegable" class="q-pa-r" color="green" outline
                                                    @click="activar(instrumento)" v-if="instrumento.estado === false">✅
                                                </q-btn>
                                                <q-btn class="q-pa-r" color="red" outline @click="activar(instrumento)"
                                                    v-else>❌</q-btn>
                                            </div>
                                        </q-item>
                                    </q-list>
                                </q-btn-dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <q-dialog v-model="alert" persistent>
            <q-spinner-dots v-if="loading == true" color="green" size="20em" :thickness="100" />
                <q-card v-else id="card">
                    <div style="display: flex">  
                        <q-card-section>
                            <div class="text-h4">Registro de instrumento</div>
                        </q-card-section>
                        <div style="margin-left: auto; margin-bottom: auto">
                            <q-btn @click="toggleX, limpiarFormulario()" class="close-button" icon="close" />
                        </div>
                    </div>
                    <q-card-section class="q-pt-none" id="card">
                        <q-card flat bordered class="my-card">
                            <q-card-section class="q-pa-md">
                                <div class="q-gutter-md">
                                    <q-input v-model="nombre" label="Nombre"
                                        :rules="[(val) => !!val || 'Campo requerido']" />
                                </div>
                                <div class="q-gutter-md">
                                    <div class="q-gutter-md custom-file-container">
                                        <input id="file-upload" type="file" @change="urlDoc" class="custom-file-input">
                                        <label for="file-upload" class="custom-file-label">
                                            <span>{{ nombreArchivo || (legaNom  ||  'Seleccionar archivo') }}</span>
                                        </label>
                                    </div>
                                </div>
                            </q-card-section>
                            <q-card-section>
                                <div role="alert" style=" border: 2px solid red; border-radius: 20px; text-align: center;
                                background-color: rgba(255, 0, 0, 0.304); " v-if="check !== ''">
                                    <div>
                                        {{ check }}
                                    </div>
                                </div>
                            </q-card-section>
                        </q-card>
                    </q-card-section>

                    <q-card-actions align="right">
                        <q-btn flat label="Cerrar" @click="limpiarFormulario()" color="primary" v-close-popup />
                        <q-btn flat label="Guardar" v-if="bd === false" @click="validarCampos()" color="primary" />
                        <q-btn flat label="Editar Proyecto" v-else @click="validarCampos()" color="primary" />
                    </q-card-actions>
                </q-card>

        </q-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Notify } from "quasar"
import { useInstrumentosEvaluacionStore } from "../stores/InstrumentosEvaluacion";
import { useLoginStore } from "../stores/login.js";
import { load } from "../routes/direccion.js";
const useInstrumentos = useInstrumentosEvaluacionStore();
const useLogin = useLoginStore();
let Instrumentos = ref([]);
let nombreArchivo = ref("")
let alert = ref(false);
let check = ref("");
let indice = ref(null);
let nomDoc = ref("")
let legaNom = ref("")
let bd = ref(false);
let r = ref("")
let nombre = ref("");
let documento = ref("");
const loading = ref(false);

async function listarInstrumentos() {
    load.value = true;
    let InstrumentosEvaluacion = await useInstrumentos.getInstrumentosEvalacion(
        useLogin.token);
    console.log(InstrumentosEvaluacion);
    Instrumentos.value = InstrumentosEvaluacion.data.InstrumentosEvaluacion;
    load.value = false;
}

async function validarCampos() {
    console.log(bd.value);
    if (nombre.value.trim() === "") {
        mostrarAlerta("El Nombre es obligatorio");
    } else if (nombreArchivo.value.trim() === "" && legaNom.value.trim() === "") {
        mostrarAlerta("Es obligatorio que suba un documento");
    } else {
        alert.value = false;
        if (bd.value == false) {
            guardar();
        } else {
            editar();
        }
    }
}

function mostrarAlerta(mensaje) {
    alert.value = true;
    check.value = mensaje;
}

async function guardar() {
    console.log("Estoy guardando");
    loading.value = true;
    try {
        let r = await useInstrumentos.addInstrumentosEvaluacion({
            nombre: nombre.value,
            documento: documento.value,
            nomDoc: nomDoc.value,
        });
        console.log(r.status);
        if (r.status == 201) {
            console.log("Se guardó un nuevo Material de apoyo");
            alert.value = false;
            listarInstrumentos();
            limpiarFormulario();
        } else {
            console.error("Error al guardar el Material de apoyo");
            // Puedes mostrar un mensaje de error aquí si es necesario
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        // Puedes manejar errores de red u otros errores aquí si es necesario
    } finally {
        loading.value = false;
    }
}

const urlDoc = (event) => {
    const file = event.target.files[0];
    if (file) {
        nombreArchivo.value = file.name;
        nomDoc.value = nombreArchivo.value
        documento.value = file;
    } else {
        nombreArchivo.value = '';
        documento.value = null;
    }
};


const edito = (index) => {
    let r = Instrumentos.value[index];
    bd.value = true;
    indice.value = r._id;
    alert.value = true;
    nombre.value = r.nombre;
    documento.value = r.documento;
    nomDoc.value = r.nomDoc;
    legaNom.value = nomDoc.value
};

async function editar() {
    loading.value = true;
    try {
        console.log("hola estoy editando");
        let Instrumento = {
            nombre: nombre.value,
            documento: documento.value,
            nomDoc: nomDoc.value
        }

        let r = await useInstrumentos.editInstrumentosEvaluacion(
            indice.value,
            Instrumento.nombre,
            Instrumento.documento,
            Instrumento.nomDoc
        );
        console.log(r);
        console.log(r.status, r);
        if (r.status === 201) {
            console.log(r);
            listarInstrumentos();
            limpiarFormulario();
            console.log("Se edito el usuario con exito");
        } else {
            console.error("Error al editar el usuario");
            // Puedes mostrar un mensaje de error aquí si es necesario
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        console.log(error);
        // Puedes manejar errores de red u otros errores aquí si es necesario
    } finally {
        loading.value = false;
    }
}

function limpiarFormulario() {
    nombre.value = "";
    documento.value = "";
    nomDoc.value = "";
    legaNom.value = "";
    nombreArchivo.value = "";
    alert.value = false;
    bd.value = false;
}


async function activar(instrimentos) {
    r.value = instrimentos;
    if (r.value.estado === true) {
        r.value.estado = false;
        console.log(r.value.estado, "resultado del if condicion");
        Notify.create({
            color: "negative",
            message: "El Instrumento de evaluacion fue Desactivado",
            icon: "check",
            position: "top",
            timeout: 3000
        })
        console.log("el estado es inactivo");
    } else {
        r.value.estado = true;
        console.log(r.value.estado, "resultado del else condicion");
        Notify.create({
            color: "positive",
            message: "El Instrumento de evalueacion fue Activado",
            icon: "check",
            position: "top",
            timeout: 3000
        })
    }
    let est = await useInstrumentos.activarInstrumentosEvaluacion(r.value._id);
    console.log(est);
}

onMounted(async () => {
    await listarInstrumentos();
});
</script>

<style scoped>
.body {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    position: relative;
    margin: 1rem;
}

.text {
    font-size: 500%;
    color: green;
    margin-top: 2%;
}

.text2 {
    font-size: 400%;
    color: green;
    margin-top: 2%;
}

.agregar {
    background-color: green;
    width: 8%;
    height: 20%;
    border-radius: 8px;
    margin-left: 90%;
    color: white;
    font-size: 150%;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.agregar:hover {
    transform: scale(1.05);
    /* Aumenta el tamaño en un 5% */
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    /* Agrega una sombra suave */
}

#card {
    width: 35em;
    max-width: 100%;
}

.card {
    border: 1px solid #ccc;
    padding: 16px;
    margin: 16px;
}

.top-half {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.buttons {
    display: flex;
    gap: 8px;
}

.bottom-half {
    margin-top: 16px;
}

.editar {
    margin-left: -45%;
    margin-top: 80%;
    width: 30%;
    height: 30%;
    background-color: rgba(255, 0, 0, 0);
    border: none;
}

.rotate-button {
    background-color: rgba(0, 0, 0, 0);
    border: none;
    cursor: pointer;
    width: 30%;
    height: 30%;
    margin-top: -15%;
    margin-left: 50%;
    outline: none;
    padding: 0;
}

.arrow-icon {
    width: 25px;
    height: 30px;
    /* rotate: 90deg; */
    transition: transform 0.5s ease;
    /* Duración y tipo de transición */
}

.rotate {
    transform: rotate(180deg);
    /* Gira 180 grados al hacer clic */
}

/* Define la animación de entrada para la "X" */
@keyframes fadeInX {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

/* Define la animación de salida para la "X" */
@keyframes fadeOutX {
    from {
        opacity: 1;
        transform: translateX(0);
    }

    to {
        opacity: 0;
        transform: translateX(-20px);
    }
}

#botonDesplegable {
    animation-duration: 0.3s;
    /* Duración de la animación */
    animation-timing-function: ease;
    /* Función de temporización (puedes ajustarla) */
}

#botonDesplegable {
    opacity: 0;
}

#botonDesplegable {
    opacity: 1;
}

#botonDesplegable:not(.active):before {
    animation-name: fadeOutX;
    opacity: 0;
}

/* Aplica las transiciones y animaciones */
.close-button {
    animation-duration: 0.3s;
    /* Duración de la animación */
    animation-timing-function: ease;
    /* Función de temporización (puedes ajustarla) */
}

/* Inicialmente, la "X" estará invisible */
.close-button:before {
    opacity: 0;
}

/* Cuando la "X" está activa, aplica la animación de entrada */
.close-button.active:before {
    animation-name: fadeInX;
    opacity: 1;
}

/* Cuando la "X" está inactiva, aplica la animación de salida */
.close-button:not(.active):before {
    animation-name: fadeOutX;
    opacity: 0;
}

.custom-file-container {
    position: relative;
    display: inline-block;
    width: 100%;
}

.custom-file-input {
    width: 100%;
    height: 40px;
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
}

.custom-file-label {
    display: inline-block;
    padding: 10px 20px;
    font-size: 16px;
    color: #333;
    background-color: #f8f9fa;
    border: 1px solid #ced4da;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s, border-color 0.3s;
}

.custom-file-label:hover {
    background-color: #e2e6ea;
    border-color: #dae0e5;
}

.custom-file-label:active {
    background-color: #d6d8db;
    border-color: #c6c8ca;
}

.custom-file-input:focus+.custom-file-label {
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.custom-file-label span {
    pointer-events: none;
}
</style>