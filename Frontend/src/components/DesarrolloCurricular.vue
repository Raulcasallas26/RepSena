<template>
    <div class="card-container">
        <div v-if="load == true" style="margin-top: 5px">
            <q-linear-progress ark rounded indeterminate color="green" />
        </div>
        <div v-else class="body">

            <div style="margin-left: 5%" class="text-h4">Desarrollo Curricular</div>
            <q-space />
        </div>
        <div class="container" v-for="(Desarrollo, index) in desarrolloCur" :key="index">
            <div class="q-pa-md" id="col7">
                <q-btn style="background-color: green; color: white; margin: 1rem;" :disable="loading" label="Editar"
                    @click="edito(Desarrollo)" />
                <q-list>
                    <div style="margin-left: 5%" class="text-h4">{{ Desarrollo.nombre }}</div>
                    <q-expansion-item popup icon="menu_book" label="Guias de aprendizaje" caption="">
                        <q-separator />
                        <q-card style="margin: 1rem;">
                            <q-card-section>
                                De click en el boton para acceder a las guias de aprendizaje {{ Desarrollo.guias }}
                                <br>
                                <div class="row justify-end q-gutter-md">
                                    <q-btn @click="AbirGuias()" style="background-color: #93F282;"
                                        class="q-mt-md q-mr-md light-blue-6" icon="book" />
                                </div>
                            </q-card-section>
                        </q-card>
                    </q-expansion-item>
                    <q-expansion-item popup icon="insert_chart" label="Matriz correlación" caption="">
                        <q-separator />
                        <q-card style="margin: 1rem;">
                            <q-card-section>
                                De click en el boton para acceder a las Matriz de Correlación "<a
                                    :href="Desarrollo.matrizCorrelacion" target="_blank">{{ Desarrollo.nomMatriz
                                    }}</a>"<br>
                                <div class="row justify-end q-gutter-md">
                                    <q-btn @click="AbrirMatriz(Desarrollo)" style="background-color: #93F282;"
                                        class="q-mt-md q-mr-md light-blue-6" icon="bar_chart" />
                                </div>
                            </q-card-section>
                        </q-card>
                    </q-expansion-item>
                    <q-expansion-item popup icon="email" label="Proyecto Formativo" caption="">
                        <q-separator />
                        <q-card style="margin: 1rem;">
                            <q-card-section>
                                De click en el boton para acceder a el proyecto formativo "<a
                                    :href="Desarrollo.proyectoFormativo" target="_blank">{{ Desarrollo.nomProyecto
                                    }}</a>"<br>
                                <div class="row justify-end q-gutter-md">
                                    <q-btn @click="AbrirProyecto(Desarrollo)" style="background-color: #93F282;"
                                        class="q-mt-md q-mr-md light-blue-6" icon="email" />
                                </div>
                            </q-card-section>
                        </q-card>
                    </q-expansion-item>
                    <q-expansion-item popup icon="school" label="Planeación Pedagogica" caption="">
                        <q-separator />
                        <q-card style="margin: 1rem;">
                            <q-card-section>
                                <div>
                                    De click en el boton para acceder a la planeación Pedagogica "<a
                                        :href="Desarrollo.planeacionPedagogica" target="_blank">{{
            Desarrollo.nomPlaneacion }}</a>"
                                </div><br>
                                <div class="row justify-end q-gutter-md">
                                    <q-btn @click="AbrirPlaneacion(Desarrollo)" style="background-color: #93F282;"
                                        class="q-mt-md q-mr-md light-blue-6" icon="school" />
                                </div>
                            </q-card-section>
                        </q-card>
                    </q-expansion-item>
                </q-list>
            </div>
        </div>

        <q-dialog v-model="VerDoc" position="top">
            <div class="outlook-modal">
                <div class="outlook-header">
                    <span class="outlook-title">Vista Previa de Documento</span>
                    <q-btn flat round dense icon="close" @click="vistaDoc()" />
                </div>
                <div class="outlook-content">
                    <iframe :src="documentUrl" ref="documentIframe" class="document-iframe"></iframe>
                </div>
            </div>
        </q-dialog>

        <div>
            <q-dialog v-model="alert" persistent>
                <q-card id="card">
                    <div style="display: flex">
                        <q-card-section>
                            <div class="text-h4">Editar Desarrollo Curricular</div>
                        </q-card-section>
                        <div style="margin-left: auto; margin-bottom: auto">
                            <q-btn @click="limpiarFormulario()" class="close-button" icon="close" v-close-popup />
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
                                    <q-select v-model="guias" :rules="[(val) => !!val || 'Campo requerido']"
                                        :options="GuiasApre" label="Guia de aprendizaje" />
                                </div>
                                <div class="q-gutter-md" id="span">
                                    <div class="q-gutter-md custom-file-container">
                                        <spam style="font-size: medium;">Matriz Correlación</spam><br>
                                        <input id="file-upload" type="file" @change="docMatriz"
                                            class="custom-file-input" clickable>
                                        <label for="file-upload" class="custom-file-label">
                                            <span>{{ nombreArchivoMatriz || (legaNomMatriz || 'Seleccionar archivo')
                                                }}</span>
                                        </label>
                                    </div>
                                </div><br>
                                <div class="q-gutter-md" id="span">
                                    <div class="q-gutter-md custom-file-container">
                                        <spam style="font-size: medium;">Proyecto Formativo</spam><br>
                                        <input id="file-upload" type="file" @change="docProyecto"
                                            class="custom-file-input" clickable>
                                        <label for="file-upload" class="custom-file-label">
                                            <span>{{ nombreArchivoProyecto || (legaNomProyecto || 'Seleccionar archivo')
                                                }}</span>
                                        </label>
                                    </div>
                                </div><br>
                                <div class="q-gutter-md" id="span">
                                    <div class="q-gutter-md custom-file-container">
                                        <spam style="font-size: medium;">Planeación Pedagogica</spam><br>
                                        <input id="file-upload" type="file" @change="docPlaneacion"
                                            class="custom-file-input" clickable>
                                        <label for="file-upload" class="custom-file-label">
                                            <span>{{ nombreArchivoPlaneacion || (legaNomPlaneacion || 'Seleccionar archivo') }}</span>
                                        </label>
                                    </div>
                                </div>
                            </q-card-section>
                            <q-card-section>
                                <div id="mensajeError"></div>
                                <div role="alert" id="alert" v-if="check !== ''">
                                    <div>
                                        {{ check }}
                                    </div>
                                </div>
                            </q-card-section>
                        </q-card>
                    </q-card-section>

                    <q-card-actions align="right">
                        <q-btn flat label="Cerrar" @click="limpiarFormulario()" color="primary" v-close-popup />
                        <q-btn flat label="Editar" @click="validarEditar()" color="primary" />
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useDesarrolloCurricularStore } from "../stores/DesarrolloCurricular.js";
import { useLoginStore } from "../stores/login.js";
import { Notify } from "quasar"
import { load } from "../routes/direccion.js";
import { useGuiasAprendizStore } from "../stores/GuiasAprediz.js";
const useDesarrolloCurricular = useDesarrolloCurricularStore();
let useGuias = useGuiasAprendizStore();
const useLogin = useLoginStore();
const router = useRouter();
let desarrolloCur = ref([]);
let guia = ref([]);
let GuiasApre = ref([]);
let loading = ref(false);
let alert = ref(false)
let nombre = ref("");
let guias = ref("");
let matrizCorrelacion = ref("");
let nombreArchivoMatriz = ref("")
let nomMatriz = ref("");
let legaNomMatriz = ref("");
let nombreArchivoProyecto = ref("")
let proyectoFormativo = ref("");
let nomProyecto = ref("");
let legaNomProyecto = ref("");
let nombreArchivoPlaneacion = ref("")
let planeacionPedagogica = ref("");
let nomPlaneacion = ref("");
let legaNomPlaneacion = ref("");
let indice = ref(null);
let r = ref(null)
let check = ref("");
const VerDoc = ref(false);
const documentUrl = ref("");
let hasReloaded = false;

function refresccar() {
    if (!hasReloaded) {
        window.location.reload();
        hasReloaded = true;
    }
}

async function ListarDesarrollo() {
    load.value = true;

    // Obtener los programas de formación
    let programas = await useDesarrolloCurricular.getDesarrolloCurricular(useLogin.token);
    desarrolloCur.value = programas.data.Desarrollo;
    console.log(desarrolloCur.value);

    // Obtener el ID de red del sessionStorage
    let idRedSesion = sessionStorage.getItem('Desarrollo');
    console.log(idRedSesion);

    // Filtrar los programas de formación por el ID de red del sessionStorage
    if (idRedSesion) {
        try {
            let redSesion = JSON.parse(idRedSesion);
            desarrolloCur.value = desarrolloCur.value.filter(p => JSON.stringify(p.Programa) === JSON.stringify(redSesion));
            console.log(desarrolloCur.value);
        } catch (error) {
            console.error('Error al parsear el ID de red del sessionStorage:', error);
        }
    }
    load.value = false;;
}

async function ListarGuias() {
    load.value = true
    let Guias = await useGuias.getGuiasAprendiz(useLogin.token);
    console.log(Guias);
    guia.value = Guias.data.GuiasAprendiz;
    GuiasApre.value = guia.value.map(item => ({
        value: item.nombre,
        label: item.nombre,
    }))
    console.log(GuiasApre.value);
    load.value = false
}

async function validarEditar() {
    if (!guias.value === "") {
        mostrarAlerta("La guía de Aprendizaje es Requerida");
    } else if (!nomMatriz.value && !legaNomMatriz.value) {
        mostrarAlerta("La documento de matriz de Correlacion es Requerida");
    } else if (!nomProyecto.value && !legaNomProyecto.value) {
        mostrarAlerta("El documento de proyecto Formativo es Requerido");
    } else if (!nomPlaneacion.value && !legaNomPlaneacion.value) {
        mostrarAlerta("La documento de Planeacion Pedagogica es Requerida");
    } else {
        alert.value = false;
        editar();
    }
}

function edito(Desarrollo) {
    r.value = Desarrollo
    alert.value = true;
    indice.value = r.value._id;
    nombre.value = r.value.nombre;
    guias.value = r.value.guias;
    matrizCorrelacion.value = r.value.matrizCorrelacion;
    nomMatriz.value = r.value.nomMatriz;
    legaNomMatriz.value = nomMatriz.value;
    proyectoFormativo.value = r.value.proyectoFormativo;
    nomProyecto.value = r.value.nomProyecto;
    legaNomProyecto.value = nomProyecto.value;
    planeacionPedagogica.value = r.value.planeacionPedagogica;
    nomPlaneacion.value = r.value.nomPlaneacion;
    legaNomPlaneacion = nomPlaneacion.value;
}

async function editar() {
    loading.value = true;
    try {
        console.log("hola estoy editando");

        let DesarrolloData = {
            nombre: nombre.value,
            guias: guias.value,
            matrizCorrelacion: matrizCorrelacion.value,
            nomMatriz: nomMatriz.value,
            proyectoFormativo: proyectoFormativo.value,
            nomProyecto: nomProyecto.value,
            planeacionPedagogica: planeacionPedagogica.value,
            nomPlaneacion: nomPlaneacion.value,
        }

        if (guia.value && guia.value.value) {
            DesarrolloData.guias = guias.value.value
        }

        let r = await useDesarrolloCurricular.editDesarrolloCurricular(
            indice.value,
            DesarrolloData.nombre,
            DesarrolloData.guias,
            DesarrolloData.matrizCorrelacion,
            DesarrolloData.nomMatriz,
            DesarrolloData.proyectoFormativo,
            DesarrolloData.nomProyecto,
            DesarrolloData.planeacionPedagogica,
            DesarrolloData.nomPlaneacion,
        );
        console.log("se insertaron los datos");
        console.log(r.status, r);
        if (r.status === 201) {
            console.log(r);
            console.log("Se edito el usuario con exito");
            ListarDesarrollo();
            limpiarFormulario();
            alert.value = false; // Cierra la alerta
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

function mostrarAlerta(mensaje) {
    alert.value = true;
    check.value = mensaje;
}

function AbrirMatriz(Desarrollo) {
    documentUrl.value = Desarrollo.matrizCorrelacion; // Reemplaza con la URL de tu documento
    VerDoc.value = true;
    nextTick(() => {
        const iframe = document.querySelector('iframe');
        if (iframe) {
            iframe.onload = () => {
                // Enviar un mensaje al iframe una vez que haya cargado
                iframe.contentWindow.postMessage('resize', '*');
            };
        } else {
            console.error('El iframe no se encontró en el DOM');
        }
    });

}


function AbrirProyecto(Desarrollo) {
    documentUrl.value = Desarrollo.proyectoFormativo; // Reemplaza con la URL de tu documento
    VerDoc.value = true;;
    nextTick(() => {
        const iframe = document.querySelector('iframe');
        if (iframe) {
            iframe.onload = () => {
                // Enviar un mensaje al iframe una vez que haya cargado
                iframe.contentWindow.postMessage('resize', '*');
            };
        } else {
            console.error('El iframe no se encontró en el DOM');
        }
    });

}

function AbrirPlaneacion(Desarrollo) {
    documentUrl.value = Desarrollo.planeacionPedagogica; // Reemplaza con la URL de tu documento
    VerDoc.value = true;
    nextTick(() => {
        const iframe = document.querySelector('iframe');
        if (iframe) {
            iframe.onload = () => {
                // Enviar un mensaje al iframe una vez que haya cargado
                iframe.contentWindow.postMessage('resize', '*');
            };
        } else {
            console.error('El iframe no se encontró en el DOM');
        }
    });

}

function vistaDoc() {
    VerDoc.value = false;
};

const docMatriz = (event) => {
    const file = event.target.files[0];
    if (file) {
        nombreArchivoMatriz.value = file.name;
        nomMatriz.value = nombreArchivoMatriz.value
        matrizCorrelacion.value = file;
    } else {
        nombreArchivoMatriz.value = '';
        matrizCorrelacion.value = null;
    }
};

const docProyecto = (event) => {
    const file = event.target.files[0];
    if (file) {
        nombreArchivoProyecto.value = file.name;
        nomProyecto.value = nombreArchivoProyecto.value
        proyectoFormativo.value = file;
    } else {
        nombreArchivoProyecto.value = '';
        proyectoFormativo.value = null;
    }
};

const docPlaneacion = (event) => {
    const file = event.target.files[0];
    if (file) {
        nombreArchivoPlaneacion.value = file.name;
        nomPlaneacion.value = nombreArchivoPlaneacion.value
        planeacionPedagogica.value = file;
    } else {
        nombreArchivoPlaneacion.value = '';
        planeacionPedagogica.value = null;
    }
};

function AbirGuias() {
    sessionStorage.setItem('useRed', true);
    router.push("/guias")
}

function limpiarFormulario() {
    nombre.value = "";
    guias.value = "";
    matrizCorrelacion.value = "";
    nomMatriz.value = "";
    legaNomMatriz.value = "";
    proyectoFormativo.value = "";
    nomProyecto.value = "";
    legaNomProyecto.value = "";
    planeacionPedagogica.value = "";
    nomPlaneacion.value = "";
    legaNomPlaneacion = "";

    alert.value = false;
}

onMounted(async () => {
    ListarDesarrollo();
    ListarGuias();
});
</script>

<style scoped>
body {
    background-color: var(--color--background);
    color: var(--color--text);
    font-family: Telka, sans-serif;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.7;
}



.outlook-modal {
    width: 100%;
    max-width: 1000px;
    background: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    border-top-left-radius: 50%;
}

.outlook-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background: #0078d4;
    color: #fff;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}

.outlook-title {
    font-size: 18px;
}

.outlook-content {
    padding: 20px;
}

.document-iframe {
    width: 100%;
    height: 500px;
    border: none;
}



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

#alert {
    border: 2px solid red;
    border-radius: 20px;
    text-align: center;
    background-color: #FF6A61;
}

.outlook-modal {
    background-color: #ffffff;
    border-radius: 0.75rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    width: 90vw;
    max-width: 50rem;
    margin: auto;
}

.outlook-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #4caf50;
    /* Verde */
    color: #ffffff;
}

.outlook-title {
    font-size: 1.5rem;
    font-weight: bold;
}

.outlook-content {
    padding: 1rem;
    height: 70vh;
    overflow: auto;
}

.document-iframe {
    width: 100%;
    height: 100%;
    border: none;
}

.imagen {
    display: flex;
    height: 100vh;
    margin: 0;
    padding: 0;
    border: 1px solid #ccc;
    overflow: hidden;
    background-color: black;
    position: relative;
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

#span {
    color: grey;
}

#span:hover {
    color: black;
}

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    box-sizing: border-box;
}

#col7 {
    max-width: 40rem;
    min-width: 20rem;
    width: 100%;
    /* Ensure it is responsive */
}

#cart {
    width: 35em;
    max-width: 100%;
    max-height: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
}

#card {
    width: 35em;
    max-width: 100%;
    display: block;
}

#img {
    max-width: 100%;
    max-height: 100%;
    height: 100vh;
    display: flex;
    margin-bottom: 0;
    border-radius: 2px;
    border: 0.5px solid #999;
    object-fit: cover;
    object-position: center;
}
</style>