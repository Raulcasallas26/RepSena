<template>
  <div class="card-container">
    <div v-if="load == true" style="margin-top: 5px;">
      <q-linear-progress ark rounded indeterminate color="green" />
    </div>
    <div v-else>
      <q-table class="tabla" flat bordered title="Treats" :rows="Porgrama" :columns="columns" row-key="id"
        :filter="filter" :loading="loading" table-header-class="" virtual-scroll :virtual-scroll-item-size="20"
        :virtual-scroll-sticky-size-start="20" :rows-per-page-options="[15]">>
        <template v-slot:top>
          <q-btn style="background-color: green; color: white" :disable="loading" label="Agregar"
            @click="alert = true" />
          <div style="margin-left: 5%" class="text-h4">Programas De Formacion</div>
          <q-space />
          <q-input borderless dense debounce="300" color="primary" v-model="filter"
            style="border-radius: 10px; border: grey solid 0.5px; padding: 5px">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body-cell="props">
          <q-td :props="props">
            <div @click="AbrirPrograma(props)">
              {{ props.value }}
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-archivo="props">
          <q-td :props="props">
            <q-spinner-ios v-if="loading == true" color="green" size="2em" :thickness="10" />
            <p><strong><a :href="props.row.nomDoc" target="_blank"> {{ props.row.nomDoc }} </a></strong> </p>
          </q-td>
        </template>

        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <span class="text-green" v-if="props.row.estado == true">Activo</span>
            <span class="text-red" v-else>Inactivo</span>
          </q-td>
        </template>

        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <q-spinner-ios v-if="loading == true" color="green" size="2em" :thickness="10" />
            <q-btn v-else class="q-mx-sm" color="primary" outline @click="edito(props)">📝</q-btn>
            <q-btn class="q-mx-sm" color="green" outline v-if="props.row.estado == false"
              @click="activar(props)">✅</q-btn>
            <q-btn class="q-mx-sm" color="red" outline v-else @click="activar(props)">❌</q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <q-dialog v-model="alert" persistent>
      <q-spinner-ios v-if="loading == true" color="green" size="20em" :thickness="100" />
      <q-card v-else id="card">
        <div style="display: flex;">
          <q-card-section>
            <div class="text-h4" v-if="bd === false">Registrar Programa</div>
            <div class="text-h4" v-else>Editar Programa</div>
          </q-card-section>
          <div style="margin-left: auto;    margin-bottom: auto;">
            <q-btn @click="limpiarFormulario()" class="close-button" icon="close" v-close-popup />
          </div>
        </div>
        <q-card-section class="q-pt-none" id="card">
          <q-card flat bordered class="my-card">
            <q-card-section class="q-pa-md">
              <div class="q-gutter-md">
                <q-input v-model="denominacion" label="Denominación" :rules="[(val) => !!val || 'Campo requerido']" />
              </div>
              <div class="q-gutter-md">
                <q-input v-model="version" label="Versión" :rules="[(val) => !!val || 'Campo requerido']" />
              </div>
              <div class="q-gutter-md">
                <q-select v-model="nivelForma" :options="nivelFormacion" label="Selecciona un nivel de formacion "
                  :rules="[(val) => !!val || 'Campo requerido']" />
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
              <div role="alert" style="
                  border: 2px solid red;
                  border-radius: 20px;
                  text-align: center;
                  background-color: rgba(32, 15, 15, 0.304);
                " v-if="check !== ''">
                <div>
                  {{ check }}
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" @click="limpiarFormulario(), cerrar()" color="primary" v-close-popup />
          <q-btn flat label="Guardar" v-if="bd === false" @click="validarYGuardar()" color="primary" />
          <q-btn flat label="Editar Programa" v-else @click="validareditar()" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, defineExpose } from "vue";
import { useRouter } from 'vue-router';
import { useProgramasFormacionStore } from "../stores/programasformacion.js";
import { useNivelesFormacionStore } from "../stores/Nivel_Formacion.js";
import { useDesarrolloCurricularStore } from "../stores/DesarrolloCurricular.js";
import { useLoginStore } from "../stores/login.js"
import { load } from "../routes/direccion.js"
const useProgramas = useProgramasFormacionStore();
const useDesarrollo = useDesarrolloCurricularStore();
const useNivel = useNivelesFormacionStore();
const useLogin = useLoginStore()
const router = useRouter();
const filter = ref("");
const loading = ref(false);
let Porgrama = ref([]);
let check = ref("");
let bd = ref(false);
let r = ref("");
let nivelFormacion = ref([])
let nivelForma = ref("");
let nombreArchivo = ref("")
let nomDoc = ref("")
let legaNom = ref("")
let alert = ref(false);
let nive = ref("")
let archivo = ref("");
let denominacion = ref("");
let version = ref("");
let indice = ref(null);

let columns = [
  { name: "denominacion", label: "Denominacion", align: "center", field: "denominacion", },
  { name: "version", label: "Version", align: "center", field: "version" },
  { name: "nivel de formacion", label: "Nivel de formacion", align: "center", field: "niveldeformacion" },
  { name: "archivo", label: "Documento", align: "center", field: "archivoOEnlace" },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  { name: "opciones", label: "Opciones", align: "center",  },
];

const urlDoc = (event) => {
  const file = event.target.files[0];
  if (file) {
    nombreArchivo.value = file.name;
    nomDoc.value = nombreArchivo.value
    archivo.value = file;
  } else {
    nombreArchivo.value = '';
    archivo.value = null;
  }
};

async function AbrirPrograma(props) {
  let IdPrograma = props.row._id;
  console.log(IdPrograma);
  // Obtener los programas de formación
  let Desarrollos = await useDesarrollo.getDesarrolloCurricular(useLogin.token);
  let Desarrollo = Desarrollos.data.Desarrollo;

  // Filtrar el programa de formación con el mismo ID de red
  let DesarrolloCur = Desarrollo.find(p => p.Programa === IdPrograma);
  console.log(DesarrolloCur.Programa);

  if (DesarrolloCur.Programa === IdPrograma) {
    sessionStorage.setItem('usestado', true);
    sessionStorage.setItem('Desarrollo', JSON.stringify(DesarrolloCur.Programa));
    router.push("/desarrolloCurricular");
  } else {
    console.log("No se encontró un DesarrolloCur de formación con el ID de red especificado.");
  }
}

async function ListarNiveles() {
    load.value = true
    let Guias = await useNivel.getNivelesFormacion(useLogin.token);
    console.log(Guias);
    nive.value = Guias.data.Nivel;
    nivelFormacion.value = nive.value.map(item => ({
        value: item.denominacion,
        label: item.denominacion,
    }))
    console.log(nivelFormacion.value);
    load.value = false
}

async function ListarPorgrama() {
  load.value = true;

  // Obtener los programas de formación
  let programas = await useProgramas.getProgramasFormacion(useLogin.token);
  console.log(programas);
  
  Porgrama.value = programas.data.ProgramasFormacion;
  console.log(Porgrama.value);
  

  // Obtener el ID de red del sessionStorage
  let idRedSesion = sessionStorage.getItem('programa');
  console.log(idRedSesion);

  // Filtrar los programas de formación por el ID de red del sessionStorage
  if (idRedSesion) {
    try {
      let redSesion = JSON.parse(idRedSesion);
      Porgrama.value = Porgrama.value.filter(p => JSON.stringify(p.red) === JSON.stringify(redSesion));
      console.log(Porgrama.value);
    } catch (error) {
      console.error('Error al parsear el ID de red del sessionStorage:', error);
    }
  }

  load.value = false;
}

function mostrarAlerta(mensaje) {
  alert.value = true;
  check.value = mensaje;
}
async function validarYGuardar() {
  if (denominacion.value.trim() === "") {
    mostrarAlerta("La Denominacion es obligatoria");
  } else if (!version.value) {
    mostrarAlerta("La version es obligatoria");
  } else if (!nivelForma.value) {
    mostrarAlerta("el Nivel de formacion es oblogatorio");
  } else {
    guardar();
  }
}

async function guardar() {
  loading.value = true;
  try {
    let res = await useProgramas.addProgramasFormacion({
      denominacion: denominacion.value,
      version: version.value,
      niveldeformacion: nivelForma.value.value,
      archivo: archivo.value,
      nomDoc: nomDoc.value
    });

    if (res.status === 201) {
      console.log(res);
      console.log("Se guardó un nuevo Programa");
      alert.value = false;
      ListarPorgrama();
      limpiarFormulario();
      // Cierra la alerta
    } else {
      console.log(res);
      console.error("Error al guardar el programa");
      // Puedes mostrar un mensaje de error aquí si es necesario
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
    // Puedes manejar errores de red u otros errores aquí si es necesario
  } finally {
    loading.value = false;
  }
}

async function activar(props) {
  r.value = props.row;
  if (r.value.estado === true) {
    r.value.estado = false;
    console.log(r.value.estado, "resultado del if condicion");
  } else {
    r.value.estado = true;
    console.log(r.value.estado, "resultado del else condicion");
  }
  let est = await useProgramas.activarProgramasFormacion(r.value._id);
  console.log(est);
}
async function validareditar() {
  if (denominacion.value.trim() === "") {
    mostrarAlerta("La Denominacion es obligatoria");
  } else if (!version.value) {
    mostrarAlerta("La version es obligatoria");
  } else if (!nivelForma.value) {
    mostrarAlerta("el Nivel de formacion es oblogatorio");
  } else if (!archivo.value) {
    mostrarAlerta("el Diseño curricular es oblogatorio");
  } else {
    editarPrograma();
  }
}

function edito(props) {
  alert.value = true;
  bd.value = true;
  r.value = props.row;
  indice.value = r.value._id;
  denominacion.value = r.value.denominacion;
  version.value = r.value.version;
  nivelForma.value = r.value.niveldeformacion;
  archivo.value = r.value.archivo;
  legaNom.value = nomDoc.value
  console.log(legaNom.value);
}

async function editarPrograma() {
    loading.value = true;
    try {
        console.log("hola estoy editando");

        let ProgramaData = {
            denominacion: denominacion.value,
            version: version.value,
            niveldeformacion: nivelForma.value,
            archivo: archivo.value,
            nomDoc: nomDoc.value,
        }

        if (nivelForma.value && nivelForma.value.value) {
            ProgramaData.nivelForma = nivelForma.value.value
        }

        let r = await useNivel.editNivelesFormacion(
            indice.value,
            ProgramaData.denominacion,
            ProgramaData.version,
            ProgramaData.niveldeformacion,
            ProgramaData.archivo,
            ProgramaData.nomDoc,
        );
        console.log("se insertaron los datos");
        console.log(r.status, r);
        if (r.status === 201) {
            console.log(r);
            console.log("Se edito el Programa con exito");
            ListarPorgrama();
            limpiarFormulario();
            alert.value = false; // Cierra la alerta
        } else {
            console.error("Error al editar el Programa");
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
  console.log("limpiando formulario");
  denominacion.value = "";
  version.value = "";
  nivelForma.value = "";
  archivo.value = "";
  check.value = ""
  alert.value = false
  bd.value = false
}

function cerrar() {
  bd.value = false;
  alert.value = false;
}

function refresccar() {
    if (!hasReloaded) {
        window.location.reload();
        sessionStorage.setItem('hasReloaded', true);
    }
}

onMounted(() => {
  ListarPorgrama();
  ListarNiveles();
});
</script>

<style scoped>
.tabla {
  margin: 1%;
  border-color: rgba(0, 0, 0, 0.367);
}

.q-table__body td {
  font-weight: bold;

  /* Agrega otros estilos según tus necesidades */
}

#card {
  width: 35em;
  max-width: 100%;
}

.text {
  font-size: 200%;
}

.custom-modal {
  margin-top: -50%;
  height: 90%;
  width: 50%;
  margin: 10%;
  top: -20%;
}

.input {
  width: 107%;
  margin-left: -4%;
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
