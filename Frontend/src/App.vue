<template>
  <q-layout view="hHh LpR lff">
    <q-header elevated class="text-white interFaz" id="header" :style="{ 'background-color': colors }">
      <q-toolbar>
        <q-avatar v-if="useLogin.inicio === false || bd === false && notMobile">
          <img src="../src/img/logo_sena.png" style="filter: invert(1);" alt="">
        </q-avatar>
        <div v-else>
          <q-btn-dropdown flat round dense v-if="isMobile" icon="menu"
            :class="{ 'justify-left': bd === false && isMobile }" style="float: left;">

            <q-item clickable v-ripple id="btn" to="/home" replace>
              <q-item-section avatar>
                <q-icon name="home" />
              </q-item-section>
              <q-item-section>Inicio</q-item-section>
            </q-item>

            <q-item clickable v-if="useLogin.rol === 'Super' || useLogin.rol === 'Administrador'" v-ripple
              to="/usuarios" replace>
              <q-item-section avatar>
                <q-icon name="people" />
              </q-item-section>
              <q-item-section>Usuarios</q-item-section>
            </q-item>

            <q-item clickable
              v-if="useLogin.rol === 'Super' || useLogin.rol === 'Administrador' || useLogin.rol === 'Gestor'" v-ripple
              to="/niveles" replace>
              <q-item-section avatar>
                <q-icon name="scale" />
              </q-item-section>
              <q-item-section>Niveles de Formación</q-item-section>
            </q-item>

            <q-item clickable
              v-if="useLogin.rol === 'Super' || useLogin.rol === 'Administrador' || useLogin.rol === 'Gestor'" v-ripple
              to="/instructores">
              <q-item-section avatar>
                <q-icon name="school" />
              </q-item-section>
              <q-item-section>Instructores</q-item-section>
            </q-item>

            <q-item clickable v-if="useLogin.rol === 'Super' || useLogin.rol === 'Gestor'" v-ripple
              to="/equipoEjecutor">
              <q-item-section avatar>
                <q-icon name="group_work" />
              </q-item-section>
              <q-item-section>Equipo Ejecutor</q-item-section>
            </q-item>

            <q-item clickable
              v-if="useLogin.rol === 'Super' || useLogin.rol === 'Instructor' || useLogin.rol === 'Gestor'" v-ripple
              to="/redConocimento">
              <q-item-section avatar>
                <q-icon name="share" />
              </q-item-section>
              <q-item-section>Red de Conocimiento</q-item-section>
            </q-item>

            <q-item clickable v-if="useLogin.rol === 'Super' || useLogin.useRed == true" v-ripple to="/programas">
              <q-item-section avatar>
                <q-icon name="book" />
              </q-item-section>
              <q-item-section>Programas de Formación</q-item-section>
            </q-item>

            <q-item clickable v-if="useLogin.rol === 'Super' || useLogin.usestado === true" v-ripple to="/ambientes">
              <q-item-section avatar>
                <q-icon name="dashboard" />
              </q-item-section>
              <q-item-section>Ambientes de Formación</q-item-section>
            </q-item>

            <q-item clickable v-if="useLogin.rol === 'Super'" v-ripple to="/ciudades">
              <q-item-section avatar>
                <q-icon name="place" />
              </q-item-section>
              <q-item-section>Ciudades</q-item-section>
            </q-item>

            <q-item clickable v-if="useLogin.rol === 'Super'" v-ripple to="/materialesApoyo">
              <q-item-section avatar>
                <q-icon name="library_books" />
              </q-item-section>
              <q-item-section>Materiales de Apoyo</q-item-section>
            </q-item>

            <q-item clickable v-if="useLogin.rol === 'Super'" v-ripple to="/proyectos">
              <q-item-section avatar>
                <q-icon name="schema" />
              </q-item-section>
              <q-item-section>Proyectos</q-item-section>
            </q-item>

            <q-item clickable v-if="useLogin.rol === 'Super'" v-ripple to="/registroCalificado">
              <q-item-section avatar>
                <q-icon name="assignment" />
              </q-item-section>
              <q-item-section>Registro Calificado</q-item-section>
            </q-item>

            <q-item clickable v-if="useLogin.rol === 'Super' || useLogin.usestado === true" v-ripple
              to="/desarrolloCurricular">
              <q-item-section avatar>
                <q-icon name="design_services" />
              </q-item-section>
              <q-item-section>Desarrollo Curricular</q-item-section>
            </q-item>

            <q-item clickable v-if="useLogin.rol === 'Super'" v-ripple to="/guias">
              <q-item-section avatar>
                <q-icon name="menu_book" />
              </q-item-section>
              <q-item-section>Guías de Aprendizaje</q-item-section>
            </q-item>

            <q-item clickable v-if="useLogin.rol === 'Super' || useLogin.rol === 'Administrador'" v-ripple to="/roles">
              <q-item-section avatar>
                <q-icon name="admin_panel_settings" />
              </q-item-section>
              <q-item-section>Roles de Usuario</q-item-section>
            </q-item>

            <q-item clickable v-if="useLogin.rol === 'Super' || useLogin.rol === 'Gestor'" v-ripple
              to="/retroalimentacionRed">
              <q-item-section avatar>
                <q-icon name="feedback" />
              </q-item-section>
              <q-item-section>Retroalimentación de Red</q-item-section>
            </q-item>

            <q-item clickable v-if="useLogin.rol === 'Super' || useLogin.usestado === true" v-ripple
              to="/investigacion">
              <q-item-section avatar>
                <q-icon name="search" />
              </q-item-section>
              <q-item-section>Investigación</q-item-section>
            </q-item>

            <q-item clickable v-if="useLogin.rol === 'Super' || useLogin.rol === 'Administrador'" v-ripple
              to="/centroforma">
              <q-item-section avatar>
                <q-icon name="school" />
              </q-item-section>
              <q-item-section>Centros de Formación</q-item-section>
            </q-item>

            <q-item clickable v-if="useLogin.rol === 'Super'" v-ripple to="/instrumentosEvaluacion">
              <q-item-section avatar>
                <q-icon name="quiz" />
              </q-item-section>
              <q-item-section>Instrumentos de Evaluación</q-item-section>
            </q-item>

            <q-item clickable v-if="useLogin.rol === 'Super' || useLogin.usestado === true" v-ripple
              to="/materialesforma">
              <q-item-section avatar>
                <q-icon name="collections_bookmark" />
              </q-item-section>
              <q-item-section>Materiales de Formación</q-item-section>
            </q-item>

            <q-separator />

            <q-item clickable v-ripple @click="cerrar()">
              <q-item-section avatar>
                <q-icon name="logout" />
              </q-item-section>
              <q-item-section>Salir</q-item-section>
            </q-item>

          </q-btn-dropdown>
        </div>
        <q-toolbar-title>
        </q-toolbar-title>
        <div>
          <img src="./img/perfil.png" flat round dense v-if="!isInLoginComponent && useLogin.inicio === true" clickable
            @click="configuracion()" class="absolute-top-right" id="img1" alt="Perfil">
        </div>
        <q-btn flat round dense v-if="!isInLoginComponent && useLogin.inicio === true" icon="login" @click="cerrar()">
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-drawer v-if="!isInLoginComponent && !isMobile && useLogin.inicio === true" bd=true v-model="drawer" show-if-above
      :mini="miniState" @mouseover="miniState = false" @mouseout="miniState = true" mini-to-overlay :max-width="100"
      :breakpoint="500" bordered :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'">
      <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }" style="background-color: white">
        <q-list padding>

          <q-item clickable v-ripple id="btn" to="/home">
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>Inicio</q-item-section>
          </q-item>

          <q-item clickable v-if="useLogin.rol === 'Super' || useLogin.rol === 'Administrador'" v-ripple to="/usuarios" replace>
            <q-item-section avatar>
              <q-icon name="people" />
            </q-item-section>
            <q-item-section>Usuarios</q-item-section>
          </q-item>

          <q-item clickable
            v-if="useLogin.rol === 'Super' || useLogin.rol === 'Administrador' || useLogin.rol === 'Gestor'" v-ripple
            to="/niveles">
            <q-item-section avatar>
              <q-icon name="scale" />
            </q-item-section>
            <q-item-section>Niveles de Formación</q-item-section>
          </q-item>

          <q-item clickable
            v-if="useLogin.rol === 'Super' || useLogin.rol === 'Administrador' || useLogin.rol === 'Gestor'" v-ripple
            to="/instructores">
            <q-item-section avatar>
              <q-icon name="school" />
            </q-item-section>
            <q-item-section>Instructores</q-item-section>
          </q-item>

          <q-item clickable v-if="useLogin.rol === 'Super' || useLogin.rol === 'Gestor'" v-ripple to="/equipoEjecutor">
            <q-item-section avatar>
              <q-icon name="group_work" />
            </q-item-section>
            <q-item-section>Equipo Ejecutor</q-item-section>
          </q-item>

          <q-item clickable
            v-if="useLogin.rol === 'Super' || useLogin.rol === 'Instructor' || useLogin.rol === 'Gestor'" v-ripple
            to="/redConocimento">
            <q-item-section avatar>
              <q-icon name="share" />
            </q-item-section>
            <q-item-section>Red de Conocimiento</q-item-section>
          </q-item>

          <q-item clickable v-if="useLogin.rol === 'Super' || useLogin.useRed == true" v-ripple to="/programas">
            <q-item-section avatar>
              <q-icon name="book" />
            </q-item-section>
            <q-item-section>Programas de Formación</q-item-section>
          </q-item>


          <q-item clickable v-if="useLogin.rol === 'Super'" v-ripple to="/ciudades">
            <q-item-section avatar>
              <q-icon name="place" />
            </q-item-section>
            <q-item-section>Ciudades</q-item-section>
          </q-item>

          <q-item clickable v-if="useLogin.rol === 'Super'" v-ripple to="/materialesApoyo">
            <q-item-section avatar>
              <q-icon name="library_books" />
            </q-item-section>
            <q-item-section>Materiales de Apoyo</q-item-section>
          </q-item>

          <q-item clickable v-if="useLogin.rol === 'Super' || useLogin.usestado === true" v-ripple
            to="/desarrolloCurricular">
            <q-item-section avatar>
              <q-icon name="design_services" />
            </q-item-section>
            <q-item-section>Desarrollo Curricular</q-item-section>
          </q-item>

          <q-item clickable v-if="useLogin.rol === 'Super' || useLogin.usestado === true" v-ripple to="/ambientes">
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>
            <q-item-section>Ambientes de Formación</q-item-section>
          </q-item>

          <q-item clickable v-if="useLogin.rol === 'Super' || useLogin.usestado === true" v-ripple
            to="/materialesforma">
            <q-item-section avatar>
              <q-icon name="collections_bookmark" />
            </q-item-section>
            <q-item-section>Materiales de Formación</q-item-section>
          </q-item>

          <q-item clickable v-if="useLogin.rol === 'Super' || useLogin.usestado === true" v-ripple to="/proyectos">
            <q-item-section avatar>
              <q-icon name="schema" />
            </q-item-section>
            <q-item-section>Proyectos</q-item-section>
          </q-item>

          <q-item clickable v-if="useLogin.rol === 'Super' || useLogin.rol === 'Gestor'" v-ripple
            to="/retroalimentacionRed">
            <q-item-section avatar>
              <q-icon name="feedback" />
            </q-item-section>
            <q-item-section>Retroalimentación de Red</q-item-section>
          </q-item>

          <q-item clickable v-if="useLogin.rol === 'Super'" v-ripple to="/registroCalificado">
            <q-item-section avatar>
              <q-icon name="assignment" />
            </q-item-section>
            <q-item-section>Registro Calificado</q-item-section>
          </q-item>

          <q-item clickable v-if="useLogin.rol === 'Super'" v-ripple to="/guias">
            <q-item-section avatar>
              <q-icon name="menu_book" />
            </q-item-section>
            <q-item-section>Guías de Aprendizaje</q-item-section>
          </q-item>

          <q-item clickable v-if="useLogin.rol === 'Super' || useLogin.rol === 'Administrador'" v-ripple to="/roles">
            <q-item-section avatar>
              <q-icon name="admin_panel_settings" />
            </q-item-section>
            <q-item-section>Roles de Usuario</q-item-section>
          </q-item>

          <q-item clickable v-if="useLogin.rol === 'Super' || useLogin.usestado === true" v-ripple to="/investigacion">
            <q-item-section avatar>
              <q-icon name="search" />
            </q-item-section>
            <q-item-section>Investigación</q-item-section>
          </q-item>

          <q-item clickable v-if="useLogin.rol === 'Super' || useLogin.rol === 'Administrador'" v-ripple
            to="/centroforma">
            <q-item-section avatar>
              <q-icon name="school" />
            </q-item-section>
            <q-item-section>Centros de Formación</q-item-section>
          </q-item>

          <q-item clickable v-if="useLogin.rol === 'Super'" v-ripple to="/instrumentosEvaluacion">
            <q-item-section avatar>
              <q-icon name="quiz" />
            </q-item-section>
            <q-item-section>Instrumentos de Evaluación</q-item-section>
          </q-item>

          <q-separator />

          <q-item clickable v-ripple @click="cerrar()">
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>
            <q-item-section>Salir</q-item-section>
          </q-item>

        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useLoginStore } from './stores/login.js';
import { useconfiguracionStore } from "./stores/configuracion.js"
let Storecolor = useconfiguracionStore();
let drawer = ref(false)
let miniState = ref(true)
let bd = ref(false)
let nota = ref(false)
let colorglobal = ref('');
const colors = ref('');
const useLogin = useLoginStore()
let drawerRight = ref(false)
const leftDrawerOpen = ref(false);
const router = useRouter();
const windowWidth = ref(window.innerWidth);

console.log(useLogin.useRed);

async function getcolor() {
  try {
    let color = await Storecolor.getColor(useLogin.token);
    colorglobal.value = color.data;

    let cortar = colorglobal.value.map(item => {
      const matches = item.color.match(/\((\d+),(\d+),(\d+)\)/);
      if (matches && matches.length === 4) {
        return `rgb(${matches[1]},${matches[2]},${matches[3]})`;
      } else {
        return '';
      }
    });

    let cortado = cortar.filter(item => item !== '').join(',');

    colors.value = cortado;
    console.log("color  " + colors.value);
  } catch (error) {
    console.error('Error al obtener colores:', error);
  }
}

const configuracion = () => {
  router.push("/configuracion");
};

function cerrar() {
  useLogin.logout();
  sessionStorage.setItem('usestado', JSON.stringify(false));
  sessionStorage.setItem('useRed', JSON.stringify(false));
  sessionStorage.setItem('programa', JSON.stringify(""));
  sessionStorage.setItem('Desarrollo', JSON.stringify(""));
  console.log("se cerro la sesion");
  useLogin.inicio = false;
  window.location.reload();
}

// Calcula si el ancho de la ventana es menor a 300px (para mostrar u ocultar el menú lateral)
const isMobile = computed(() => {
  nota.value = true
  return windowWidth.value < 600;
});

const notMobile = computed(() => {
  nota.value = false
  return windowWidth.value > 600;
});

// Agrega un listener para detectar cambios en el ancho de la ventana
window.addEventListener('resize', () => {
  windowWidth.value = window.innerWidth;
});

// Cierra el menú lateral cuando se carga la página en dispositivos móviles
onMounted(async () => {
  getcolor();
  if (isMobile.value) {
    drawer.value = false;
  }
  const savedState = sessionStorage.getItem('usestado');
  if (savedState !== null) {
    useLogin.usestado = JSON.parse(savedState); // Convertir a booleano
    sessionStorage.removeItem('usestado'); // Limpiar el almacenamiento local
  }
  const guardarRed = sessionStorage.getItem('useRed');
  if (guardarRed !== null) {
    useLogin.useRed = JSON.parse(guardarRed); // Convertir a booleano
    sessionStorage.removeItem('useRed'); // Limpiar el almacenamiento local
  }
});
// Observa cambios en el valor de isMobile para cerrar el menú lateral si es necesario
watch(isMobile, (newValue) => {
  if (newValue) {
    drawer.value = false;
  }
});

// Calcula si estás en el componente de inicio de sesión
const isInLoginComponent = computed(() => {
  return router.path === '/'; // La ruta del componente Login
});

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>


<style scoped>
#img1 {
  position: absolute;
  width: 30px;
  height: 30px;
  margin-top: 0.7rem;
  margin-right: 4rem;
  border-radius: 50%;
}

#header {
  background-color: var(--header-background-color);
  font-family: cursive;
}

:root {
  --header-background-color: {
      {
      rgbColor
    }
  }

  ;
}

/* Estilo del botón de hamburguesa en dispositivos móviles */
.q-btn.is-mobile {
  display: block;
  margin: 10px;
  /* Ajusta el margen según tus necesidades */
}

/* Estilo del menú lateral en dispositivos móviles */
.q-drawer.is-mobile {
  width: 100%;
  max-width: 100%;
}

#text {
  font-size: 20px;
  font-family: cursive;
}

#btnlat {
  margin-left: 5px;
  margin-top: 5px;
  filter: invert(100);
}

#avatar {
  height: 30px;
  width: 60px;
  filter: invert(1);
}

#avarat2 {
  width: 70px;
}

#lateral {
  background-color: green;
  font-family: cursive;
}

/*botones */
#vende {
  display: flex;
  background-color: rgb(255, 255, 255);

  color: white;
  font-size: 20px;
  margin-top: 10px;
  font-family: cursive;
  text-align: center;
  border-radius: 10px;
}

#vende:hover {
  transform: scale(1.1);
  background-color: rgba(255, 255, 255, 0.779);
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.626);
}

#vehicu {
  display: flex;


  color: white;
  font-size: 20px;
  margin-top: 10px;
  font-family: cursive;
  text-align: center;
  border-radius: 10px;
}

#vehicu:hover {
  transform: scale(1.1);

  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.626);
}

.custom-link {
  text-decoration: none;
  /* Eliminar subrayado */
  color: black;
}

#logout {
  width: 70%;
}
</style>