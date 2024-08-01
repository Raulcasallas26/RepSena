<template>
  <div class="card-container">
    <div class="clas" v-if="load === true" style="margin-top: 5px;">
      <q-linear-progress ark rounded indeterminate color="green" />
    </div>
    <div v-else>
      <div class="body" style="position: relative">
        <q-btn style="background-color: whitesmoke; color: white; filter: invert(1); margin-right: 10px;"
          @click="goBack" label="" > <span style='font-size: 1.5rem;'>🔙</span> </q-btn>
        <q-btn style="background-color: green; color: white;" :disable="loading" label="Agregar"
          @click="modal = true" />
        <div style="margin-left: 5%" class="text-h4">Guias de Aprendizaje</div>
        <q-space />
        <q-input borderless dense debounce="300" style="border-radius: 10px; border: grey solid 0.5px; padding: 5px"
          color="primary" v-model="filter">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div>
        <!-- Itera a través de los MatApoyos y muestra cada uno en un card -->
        <div v-for="(guia, index) in Guia" :key="index">
          <div class="card" @click="toggleDetails(index)" >
            <div class="top-half">
              <div class="info">
                <p><strong>Código: </strong> {{ guia.codigo }}</p>
                <p><strong>Nombre: </strong> {{ guia.nombre }}</p>
                <p><strong> Fase: </strong> {{ guia.fase }}</p>
              </div>
              <div class="buttons">
                <button @click="toggleDetails(index)" class="rotate-button">
                  <div class="arrow-icon" :class="{ rotate: isRotated[index] }">
                    <img src="https://cdn-icons-png.flaticon.com/512/32/32195.png" alt="Arrow" class="arrow-icon" />
                  </div>
                </button>
                <button class="editar" @click="edito(guia)">
                  <img src="https://cdn-icons-png.flaticon.com/512/650/650143.png" alt="Editar" class="arrow-icon" />
                </button>
              </div>
            </div>

            <q-slide-transition appear>
              <div v-show="cardStates[index]">
                <div class="bottom-half">
                  <div class="info">
                    <p @click="abrirInstrumento()" style="cursor: pointer;">
                      <strong>Instrumentos de evaluación: </strong> {{ guia.InstrumentosEvaluacion }}
                    </p>
                    <p @click="abrirMaterial()" style="cursor: pointer;">
                      <strong>Materiales de Apoyo: </strong> {{ guia.MaterialApoyo }}
                    </p>
                    <p><strong>Documentos: </strong><a :href="guia.documento" target="_blank">{{ guia.nomDoc }}</a> </p>
                  </div>
                </div>
              </div>
            </q-slide-transition>
          </div>
        </div>
      </div>
    </div>

    <q-dialog v-model="modal" persistent>
      <q-spinner-ios v-if="loading == true" color="green" size="20em" :thickness="100" />
      <q-card v-else id="card">
        <div style="display: flex;">
          <q-card-section>
            <div class="text-h4" v-if="bd === false"> Agregar matrerial de apoyo</div>
            <div class="text-h4" v-else> Editar material de apoyo</div>
          </q-card-section>
          <div style="margin-left: auto;    margin-bottom: auto;">
            <q-btn @click="limpiarFormulario()" class="close-button" icon="close" v-close-popup />
          </div>
        </div>

        <q-card-section class="q-pt-none" id="card">
          <q-card flat bordered class="my-card">
            <q-card-section class="q-pa-md">
              <div class="q-gutter-md">
                <q-input v-model="codigo" label="Codigo" :rules="[(val) => !!val || 'Campo requerido']" />
              </div>
              <div class="q-gutter-md">
                <q-input v-model="nombre" label="Nombre" :rules="[(val) => !!val || 'Campo requerido']" />
              </div>
              <div class="q-gutter-md">
                <q-input v-model="fase" label="Fase" :rules="[(val) => !!val || 'Campo requerido']" />
              </div>
              <div class="q-gutter-md">
                <q-select v-model="InstrumentosEvaluacion" :rules="[(val) => !!val || 'Campo requerido']"
                  :options="Instrumen" label="Instrumento de evalueación" />
              </div>
              <div class="q-gutter-md">
                <q-select v-model="MaterialApoyo" :rules="[(val) => !!val || 'Campo requerido']" :options="MatApoyo"
                  label="Material de apoyo" />
              </div>
              <div class="q-gutter-md">
                <div class="q-gutter-md custom-file-container">
                  <input id="file-upload" type="file" @change="urlDoc" class="custom-file-input">
                  <label for="file-upload" class="custom-file-label">
                    <span>{{ nombreArchivo || (legaNom || 'Seleccionar archivo') }}</span>
                  </label>
                </div>
              </div>

            </q-card-section>
            <q-card-section>
              <div role="alert"
                style=" border: 2px solid red; border-radius: 20px;  text-align: center;  background-color: rgba(255, 0, 0, 0.304);"
                v-if="check !== ''">
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
          <q-btn flat label="Editar Usuario" v-else bd=true @click="validarCampos()" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useInstrumentosEvaluacionStore } from "../stores/InstrumentosEvaluacion";
import { useMaterialesApoyoStore } from "../stores/MaterialesApoyo.js";
import { useGuiasAprendizStore } from "../stores/GuiasAprediz.js";
import { useLoginStore } from "../stores/login.js"
import { load } from "../routes/direccion.js"
let useInstrumentosEva = useInstrumentosEvaluacionStore();
let useMaterialApoyo = useMaterialesApoyoStore();
let useGuias = useGuiasAprendizStore();
let useLogin = useLoginStore()
const router = useRouter();
let nombreArchivo = ref("");
let alert = ref(false);
let bd = ref(false);
let Guia = ref([])
let MaterApoyo = ref([]);
let MatApoyo = ref([]);
let Instru = ref([]);
let Instrumen = ref([]);
let codigo = ref("");
let nombre = ref("");
let fase = ref("");
let documento = ref("");
let nomDoc = ref("");
let legaNom = ref("");
let InstrumentosEvaluacion = ref("");
let MaterialApoyo = ref("");
let filter = ref("");
let check = ref("");
let r = ref("");
let modal = ref(false);
let indice = ref(null);
const loading = ref(false);

async function ListarGuias() {
  load.value = true
  console.log(useLogin.token);
  let Guias = await useGuias.getGuiasAprendiz(useLogin.token);
  console.log(Guias);
  Guia.value = Guias.data.GuiasAprendiz;
  console.log(Guia.value);
  load.value = false
}

async function ListarInstumentoEva() {
  load.value = true
  let Instrumentos = await useInstrumentosEva.getInstrumentosEvalacion(useLogin.token);
  console.log(Instrumentos);
  Instru.value = Instrumentos.data.InstrumentosEvaluacion;
  Instrumen.value = Instru.value.map(item => ({
    value: item.nombre,
    label: item.nombre,
  }))
  console.log(Instrumen.value);
  load.value = false
}

function abrirInstrumento() {
  sessionStorage.setItem('useRed', true);
  router.push("/instrumentosEvaluacion")
}

async function ListarMaterialApoyo() {
  load.value = true
  let apoyo = await useMaterialApoyo.getMaterialesApoyo(useLogin.token);
  console.log(apoyo);
  MaterApoyo.value = apoyo.data.MaterialesApoyo;
  MatApoyo.value = MaterApoyo.value.map(item => ({
    value: item.nombre,
    label: item.nombre,
  }))
  console.log(MatApoyo.value);
  load.value = false
}

function abrirMaterial() {
  sessionStorage.setItem('useRed', true);
  router.push("/materialesApoyo")
}

async function validarCampos() {
  console.log(bd.value);
  if (codigo.value.trim() === "") {
    mostrarAlerta("El Codigo es obligatorio");
  } else if (nombre.value.trim() === "") {
    mostrarAlerta("El Nombre es obligatorio");
  } else if (fase.value.trim() === "") {
    mostrarAlerta("La Fase es obligatoria");
  } else if (!InstrumentosEvaluacion.value) {
    mostrarAlerta("Es obligatorio elegir un Instrumento de Evaluacion");
  } else if (!MaterialApoyo.value) {
    mostrarAlerta("Es obligatorio elegir el material de apoyo");
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

async function guardar() {
  console.log("Estoy guardando");
  loading.value = true;
  try {
    let r = await useGuias.addGuiasAprendiz({
      codigo: codigo.value,
      nombre: nombre.value,
      fase: fase.value,
      InstrumentosEvaluacion: InstrumentosEvaluacion.value.value,
      MaterialApoyo: MaterialApoyo.value.value,
      documento: documento.value,
      nomDoc: nomDoc.value,
    });
    console.log(r);
    console.log(r.status);
    if (r.status == 201) {
      console.log("Se guardó un nuevo Material de apoyo");
      alert.value = false;
      ListarGuias();
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

function edito(guia) {
  r.value = guia
  bd.value = true
  modal.value = true;
  indice.value = r.value._id;
  codigo.value = r.value.codigo;
  nombre.value = r.value.nombre;
  fase.value = r.value.fase;
  InstrumentosEvaluacion.value = r.value.InstrumentosEvaluacion;
  MaterialApoyo.value = r.value.MaterialApoyo
  documento.value = r.value.documento;
  nomDoc.value = r.value.nomDoc;
  legaNom.value = nomDoc.value
}

async function editar() {
  loading.value = true;
  try {
    console.log("hola estoy editando");
    let GuiaData = {
      codigo: codigo.value,
      nombre: nombre.value,
      fase: fase.value,
      InstrumentosEvaluacion: InstrumentosEvaluacion.value,
      MaterialApoyo: MaterialApoyo.value,
      documento: documento.value,
      nomDoc: nomDoc.value,
    }

    if (InstrumentosEvaluacion.value && InstrumentosEvaluacion.value.value) {
      GuiaData.InstrumentosEvaluacion = InstrumentosEvaluacion.value.value
    }

    if (MaterialApoyo.value && MaterialApoyo.value.value) {
      GuiaData.MaterialApoyo = MaterialApoyo.value.value
    }

    let r = await useGuias.editGuiasAprendiz(
      indice.value,
      GuiaData.codigo,
      GuiaData.nombre,
      GuiaData.fase,
      GuiaData.InstrumentosEvaluacion,
      GuiaData.MaterialApoyo,
      GuiaData.documento,
      GuiaData.nomDoc,
    );
    console.log("se insertaron los datos");
    console.log(r.status, r);
    if (r.status === 201) {
      console.log(r);
      console.log("Se edito el usuario con exito");
      ListarGuias();
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

const cardStates = ref({});
const isRotated = ref({});
const toggleDetails = (index) => {
  cardStates.value[index] = !cardStates.value[index];
  isRotated.value[index] = !isRotated.value[index];
};

function goBack() {
  router.go(-1);
}

function mostrarAlerta(mensaje) {
  alert.value = true;
  check.value = mensaje;
}

function limpiarFormulario() {
  codigo.value = "";
  nombre.value = "";
  fase.value = "";
  documento.value = "";
  InstrumentosEvaluacion.value = "";
  MaterialApoyo.value = "";
  nomDoc.value = "";
  nombreArchivo.value = "";
  legaNom.value = "";
  modal.value = false
  bd.value = false;
  check.value = ""
}
onMounted(async () => {
  ListarGuias();
  ListarMaterialApoyo();
  ListarInstumentoEva();
});
//editMatApoyosFormacion   StoreMatApoyo
</script>

<style scoped>
.body {
  margin: 1%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
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
  margin-right: -20%;
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

.arrow-icon {
  width: 25px;
  height: 30px;
  /* rotate: 90deg; */
  transition: transform 0.5s ease;
  /* Duración y documento de transición */
}

.rotate {
  transform: rotate(180deg);
  /* Gira 180 grados al hacer clic */
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
</style>
