<template>
  <div class="q-pa-md">
    <div>
      <q-table flat bordered title="Treats" :rows="user" :columns="columns" row-key="id" :filter="filter"
        :loading="loading" table-header-class="" virtual-scroll :virtual-scroll-item-size="10"
        :virtual-scroll-sticky-size-start="10" :pagination="pagination" :rows-per-page-options="[15]"
        @virtual-scroll="onScroll">
        <template v-slot:top>
          <q-btn style="background-color: whitesmoke; color: white; filter: invert(1); margin-right: 10px;"
                @click="goBack" label=""> <span style='font-size: 1.5rem;'>🔙</span> </q-btn>
          <q-btn style="background-color: green; color: white" :disable="loading" label="Agregar" @click="alert = true" />
          <div style="margin-left: 5%" class="text-h4">Centros de Formacion</div>
          <q-space />
          <q-input borderless dense debounce="300" color="primary" v-model="filter"
            style="border-radius: 10px; border: grey solid 0.5px; padding: 5px">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
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
            <q-btn class="q-mx-sm" color="green" outline @click="activar(props)"
              v-if="props.row.estado == false">✅</q-btn>
            <q-btn class="q-mx-sm" color="red" outline @click="activar(props)" v-else>❌</q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog v-model="alert" persistent>
      <q-spinner-ios v-if="loading == true" color="green" size="20em" :thickness="100" />
      <q-card v-else id="card">
        <div style="display: flex;">
          <q-card-section>
            <div class="text-h4">Registro</div>
          </q-card-section>
          <div style="margin-left: auto;    margin-bottom: auto;">
            <q-btn @click="toggleX, limpiarFormulario()" class="close-button" icon="close" />
          </div>
        </div>
        <q-card-section class="q-pt-none" id="card">
          <q-card flat bordered class="my-card">
            <q-card-section class="q-pa-md">
              <div class="q-gutter-md">
                <q-input v-model="codigo" label="Codigo" :rules="[(val) => !!val || 'Campo requerido']">
                </q-input>
              </div>
              <div class="q-gutter-md">
                <q-input v-model="nombre" label="Nombre" :rules="[(val) => !!val || 'Campo requerido']" />
              </div>
              <div class="q-gutter-md">
                <q-input v-model="direccion" label="Direccion" :rules="[(val) => !!val || 'Campo requerido']" />
              </div>

            </q-card-section>
            <q-card-section>
              <div role="alert" style="
                    border: 2px solid red;
                    border-radius: 20px;
                    text-align: center;
                    background-color: rgba(255, 0, 0, 0.304);
                  " v-if="check !== ''">
                <div>
                  {{ check }}
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" @click="limpiarFormulario()" color="primary" v-close-popup />
          <q-btn flat label="Guardar" v-if="bd === false" @click="validarYGuardar" color="primary" />
          <q-btn flat label="Editar Usuario" v-else @click="validaredit" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
  
<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCentrosFormacionStore } from "../stores/CentrosFormacion.js";
import { useLoginStore } from "../stores/login.js"
import { load } from "../routes/direccion.js"
const useCentros = useCentrosFormacionStore();
const useLogin = useLoginStore()
const router = useRouter();
let alert = ref(false);
let bd = ref(false);
let check = ref("");
let isPwd = ref(true);
let Centros = ref("")
let user = ref([]);
let nombre = ref("");
let codigo = ref("");
let direccion = ref("");
let loading = ref(false);
let indice = ref(null);
let r = ref("");

let columns = [
  { name: "codigo", align: "center", label: "Codigo", field: "codigo" },
  { name: "nombre", align: "center", label: "Nombre", field: "nombre" },
  { name: "direccion", align: "center", label: "Direccion", field: "direccion" },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
];
const originalRows = [];
const filter = ref("");
const rowCount = ref(10);
const rows = ref([...originalRows]);
console.log(indice.value);

function mostrarAlerta(mensaje) {
  alert.value = true;
  check.value = mensaje;
}
async function validarYGuardar() {

  if (nombre.value.trim() === "") {
    mostrarAlerta("el nombre es Requerido");
  } else if (codigo.value.trim() === "") {
    mostrarAlerta("El Codigo es Requerido");
  } else if (!direccion.value) {
    mostrarAlerta("la direccion es Requerida");
  } else {
    alert.value = false;
    guardar()

  }
}

async function guardar() {
  loading.value = true;
  try {
    const response = await useCentros.addCentrosFormacion({
      nombre: nombre.value,
      codigo: codigo.value,
      direccion: direccion.value,
    });

    if (response.status === 200) {
      console.log("Se guardó un nuevo rol usuario");
      listarUsuarios();
      limpiarFormulario();
      alert.value = false; // Cierra la alerta
    } else {
      console.error("Error al guardar el usuario");
      // Puedes mostrar un mensaje de error aquí si es necesario
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
    // Puedes manejar errores de red u otros errores aquí si es necesario
  } finally {
    loading.value = false;
  }
}
async function validaredit() {

  if (!nombre.value) {
    mostrarAlerta("El nombre es obligatorio");
  } else if (!codigo.value) {
    mostrarAlerta("El correo electrónico es obligatorio");
  } else if (!direccion.value) {
    mostrarAlerta("la direccion es obligatoria");
  } else {
    // Todos los campos están completos y válidos, guarda los datos
    console.log("paso validacion");
    await editarUser()
    // Cierra el modal
  }

}
async function editarUser() {
  loading.value = true;
  console.log("hola estoy editando");
  let r = await useCentros.editCentrosFormacion(indice.value, {
    nombre: nombre.value,
    codigo: codigo.value,
    direccion: direccion.value,
  });
  console.log(r);
  bd.value = false;
  loading.value = false;
  console.log("limpiando datos");
  listarUsuarios();
  limpiarFormulario();
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
  let est = await useCentros.activarCentrosFormacion(r.value._id);
  console.log(est);
}

function edito(props) {
  bd.value = true;
  r.value = props.row;
  alert.value = true;
  indice.value = r.value._id;
  nombre.value = r.value.nombre;
  codigo.value = r.value.codigo;
  direccion.value = r.value.direccion;

}

function limpiarFormulario() {
  console.log("limpiar datos");
  nombre.value = "";
  codigo.value = "";
  direccion.value = "";

  alert.value = false;
}

listarUsuarios(useLogin, user, load);
async function listarUsuarios() {
  load.value = true;
  console.log(useLogin.token);

  try {
    let centros = await useCentros.getCentrosFormacion(useLogin.token);

    if (centros && centros.data && centros.data.CentrosFormacion) {
      console.log(centros);
      user.value = centros.data.CentrosFormacion;
    } else {
      console.error("La respuesta no contiene los datos esperados.");
    }
  } catch (error) {
    console.error("Error al obtener los centros de formación:", error);
  }

  load.value = false;
}

function goBack() {
  router.go(-1);
}

function agregar() {
  alert.value = true;
}
onMounted(() => {
  listarUsuarios(useLogin, user, load);
  limpiarFormulario();
});
</script>
<style scoped>
#card {
  width: 35em;
  max-width: 100%;
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