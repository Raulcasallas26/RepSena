<template>
    <q-layout view="lHh lpR lFf">
        <div class="row" style="display: flex; flex-wrap: wrap; max-width: 100%;">
            <div style="flex: 1 1 400px; height: 0px;">
                <div class="col-5" id="imagen">
                    <img :src="currentImage" style="width: 1000px;" class="bg" alt="Cargando imagen..." id="img">
                </div>
            </div>
            <div style="flex: 2 1 400px;">
                <div class="col-7" id="col7" style="position: relative; height: 100vh; max-width: 100%; ">
                    <div id="cart" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                        <q-card id="card" flat bordered class="my-card">
                            <q-card-section>
                                <h5 id="h1" style="display: flex; justify-content: center;">Iniciar sesion</h5>
                            </q-card-section>
                            <q-card-section class="q-pa-md">
                                <!-- <p>Usuarios y contraseña <br>
                                    Administrador:-- 456 <br>
                                    Gestor:--------- 789 <br>
                                    Instructor:----- 147 <br>
                                    Super Usuario:-- 123
                                </p> -->
                                <div role="alert"
                                    style="border: 2px solid red; border-radius: 20px; text-align: center; background-color: rgba(255, 0, 0, 0.304);"
                                    v-if="checking !== ''">
                                    <div>
                                        {{ checking }}
                                    </div>
                                </div>
                                <div class="q-gutter-md">
                                    <q-input v-model="cedula" type="number" label="Cedula"
                                        :rules="[val => !!val || 'Campo requerido']" />
                                </div>
                                <div class="q-gutter-md">
                                    <q-input v-model="password" :type="isPwd ? 'password' : 'text'"
                                        :rules="[val => !!val || 'Campo requerido']" label="Ingresar password">
                                        <template v-slot:append>
                                            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'"
                                                class="cursor-pointer" @click="isPwd = !isPwd" />
                                        </template>
                                    </q-input>
                                </div>
                            </q-card-section>
                            <div style="display: flex;  justify-content: center;">
                                <q-spinner-ios v-if="loading == true" color="green" size="2em" :thickness="10" />
                                <q-btn v-else
                                    style="background-color: green;display: flex; justify-content: center; color: white;"
                                    @keyup.enter="validar()" @click="validar()">
                                    Iniciar</q-btn>
                            </div>
                            <q-card-section>
                                <div class="cursor-pointer" style="color: blue;" @click="olvideContra()">
                                    {{ label }}
                                </div>
                            </q-card-section>
                        </q-card>
                    </div>
                </div>
            </div>
        </div>
        <q-dialog v-model="ingresaCorreo">
            <q-card id="card">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#008000" fill-opacity="0.5"
                        d="M0,288L12.6,250.7C25.3,213,51,139,76,112C101.1,85,126,107,152,117.3C176.8,128,202,128,227,149.3C252.6,171,278,213,303,224C328.4,235,354,213,379,181.3C404.2,149,429,107,455,96C480,85,505,107,531,106.7C555.8,107,581,85,606,85.3C631.6,85,657,107,682,122.7C707.4,139,733,149,758,176C783.2,203,808,245,834,272C858.9,299,884,309,909,304C934.7,299,960,277,985,261.3C1010.5,245,1036,235,1061,208C1086.3,181,1112,139,1137,138.7C1162.1,139,1187,181,1213,202.7C1237.9,224,1263,224,1288,229.3C1313.7,235,1339,245,1364,229.3C1389.5,213,1415,171,1427,149.3L1440,128L1440,0L1427.4,0C1414.7,0,1389,0,1364,0C1338.9,0,1314,0,1288,0C1263.2,0,1238,0,1213,0C1187.4,0,1162,0,1137,0C1111.6,0,1086,0,1061,0C1035.8,0,1011,0,985,0C960,0,935,0,909,0C884.2,0,859,0,834,0C808.4,0,783,0,758,0C732.6,0,707,0,682,0C656.8,0,632,0,606,0C581.1,0,556,0,531,0C505.3,0,480,0,455,0C429.5,0,404,0,379,0C353.7,0,328,0,303,0C277.9,0,253,0,227,0C202.1,0,177,0,152,0C126.3,0,101,0,76,0C50.5,0,25,0,13,0L0,0Z">
                    </path>
                </svg>
                <q-card-section>
                    <div class="text-h4">Restablecer contraseña</div>
                </q-card-section>
                <q-card-section class="q-pt-none" id="">
                    <p>Ingrese su direccion de correo electronico para restablecer su contraseña.</p>
                    <q-card flat bordered class="my-card">
                        <q-card-section class="q-pa-md">
                            <div class="q-gutter-md">
                                <q-input v-model="email" type="email" label="E-mail" :rules="[validarEmail]">

                                    <template v-slot:append>
                                        <q-icon name="email" />
                                    </template>
                                </q-input>
                            </div>
                        </q-card-section>
                        <q-card-section>
                            <div role="alert"
                                style="border: 2px solid red; border-radius: 20px; text-align: center; background-color: rgba(255, 0, 0, 0.304);"
                                v-if="net !== ''">
                                <div>
                                    {{ net }}
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Cerrar" color="primary" v-close-popup />
                    <q-btn flat label="Siguiente" @click="validarCorreo()" color="primary" />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <q-dialog v-model="compruevaCorreo">
            <q-spinner-ios v-if="loading === true" color="green" size="20em" :thickness="10" />
            <q-card v-else id="card">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#008000" fill-opacity="0.5"
                        d="M0,288L12.6,250.7C25.3,213,51,139,76,112C101.1,85,126,107,152,117.3C176.8,128,202,128,227,149.3C252.6,171,278,213,303,224C328.4,235,354,213,379,181.3C404.2,149,429,107,455,96C480,85,505,107,531,106.7C555.8,107,581,85,606,85.3C631.6,85,657,107,682,122.7C707.4,139,733,149,758,176C783.2,203,808,245,834,272C858.9,299,884,309,909,304C934.7,299,960,277,985,261.3C1010.5,245,1036,235,1061,208C1086.3,181,1112,139,1137,138.7C1162.1,139,1187,181,1213,202.7C1237.9,224,1263,224,1288,229.3C1313.7,235,1339,245,1364,229.3C1389.5,213,1415,171,1427,149.3L1440,128L1440,0L1427.4,0C1414.7,0,1389,0,1364,0C1338.9,0,1314,0,1288,0C1263.2,0,1238,0,1213,0C1187.4,0,1162,0,1137,0C1111.6,0,1086,0,1061,0C1035.8,0,1011,0,985,0C960,0,935,0,909,0C884.2,0,859,0,834,0C808.4,0,783,0,758,0C732.6,0,707,0,682,0C656.8,0,632,0,606,0C581.1,0,556,0,531,0C505.3,0,480,0,455,0C429.5,0,404,0,379,0C353.7,0,328,0,303,0C277.9,0,253,0,227,0C202.1,0,177,0,152,0C126.3,0,101,0,76,0C50.5,0,25,0,13,0L0,0Z">
                    </path>
                </svg>
                <q-card-section>
                    <div class="text-h4">Restablecer contraseña</div>
                </q-card-section>
                <q-card-section class="q-pt-none">
                    <q-card flat bordered class="my-card">
                        <q-card-section class="q-pa-md">
                            <p>Revice su correo '<strong>{{ email }}</strong>', recibirá un correo electronico con
                                instrucciones para
                                restablecer su contraseña. Si no llega, asegurese de revisar su carpeta Span</p>
                        </q-card-section>
                        <q-card-section>

                        </q-card-section>
                    </q-card>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Iniciar sesion" to="/" @click=" comprovar()" color="primary" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <q-dialog v-model="passwordNueva">
            <q-card id="card">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#008000" fill-opacity="0.5"
                        d="M0,288L12.6,250.7C25.3,213,51,139,76,112C101.1,85,126,107,152,117.3C176.8,128,202,128,227,149.3C252.6,171,278,213,303,224C328.4,235,354,213,379,181.3C404.2,149,429,107,455,96C480,85,505,107,531,106.7C555.8,107,581,85,606,85.3C631.6,85,657,107,682,122.7C707.4,139,733,149,758,176C783.2,203,808,245,834,272C858.9,299,884,309,909,304C934.7,299,960,277,985,261.3C1010.5,245,1036,235,1061,208C1086.3,181,1112,139,1137,138.7C1162.1,139,1187,181,1213,202.7C1237.9,224,1263,224,1288,229.3C1313.7,235,1339,245,1364,229.3C1389.5,213,1415,171,1427,149.3L1440,128L1440,0L1427.4,0C1414.7,0,1389,0,1364,0C1338.9,0,1314,0,1288,0C1263.2,0,1238,0,1213,0C1187.4,0,1162,0,1137,0C1111.6,0,1086,0,1061,0C1035.8,0,1011,0,985,0C960,0,935,0,909,0C884.2,0,859,0,834,0C808.4,0,783,0,758,0C732.6,0,707,0,682,0C656.8,0,632,0,606,0C581.1,0,556,0,531,0C505.3,0,480,0,455,0C429.5,0,404,0,379,0C353.7,0,328,0,303,0C277.9,0,253,0,227,0C202.1,0,177,0,152,0C126.3,0,101,0,76,0C50.5,0,25,0,13,0L0,0Z">
                    </path>
                </svg>
                <q-card-section>
                    <div class="text-h4">Restablecer contraseña</div>
                </q-card-section>
                <q-card-section class="q-pt-none">
                    <p>Ingrese su nueva contraseña para restablecer el acceso a su cuenta.</p>
                    <q-card flat bordered class="my-card">
                        <q-card-section class="q-pa-md">
                            <div class="q-gutter-md">
                                <q-input v-model="password" label="Contraseña" />
                            </div>
                            <div class="q-gutter-md">
                                <q-input v-model="password" label="Confirme contraseña" />
                            </div>
                        </q-card-section>
                        <q-card-section>

                        </q-card-section>
                    </q-card>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Cancelar" color="primary" v-close-popup />
                    <q-btn flat label="Cambiar contraseña" @click="guardar()" color="primary" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-layout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useLoginStore } from '../stores/login.js';
import { useRouter } from "vue-router";
const useLogin = useLoginStore();
let router = useRouter();
let ingresaCorreo = ref(false);
let compruevaCorreo = ref(false);
let passwordNueva = ref(false);
let label = ref('Olvidaste la contraseña')
let isPwd = ref(true);
let loading = ref(false)
let email = ref("rcasallas26@gmail.com")
let subject = ref("prueva de que envie el correo")
let body = ref("Si se envio el correo con exito y llega al usuario")
let net = ref('')
let r = ref("")
let check = ref('')
let cedula = ref("");
let password = ref("");
let checking = ref("");
let resp = ref("");
let verdadero = ref("");
let falso = ref("");
// subject.value, body.value
const emailValido = ref(true); // Inicialmente se asume que el correo es válido

const validarEmail = (val) => {
    // Expresión regular para validar una dirección de correo electrónico
    const patron = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // Utiliza la expresión regular para verificar el formato
    if (!patron.test(val)) {
        emailValido.value = false;
        return "Formato de correo electrónico no válido";
    } else {
        emailValido.value = true;
        return true;
    }
};

function limpiar() {
    email.value = ""
}

function olvideContra() {
    ingresaCorreo.value = true;
}

function validarCorreo() {
    if (email.value.trim() === "") {
        net.value = "Digite el E-mail (campo obligatorio)"
    } else if (emailValido.value === false) {
        net.value = "Digite el E-mail correctamente"
    } else {
        net.value = ""
        console.log(email.value);
        ingresaCorreo.value = false
        compruevaCorreo.value = true
    }

}

function limpiarEstado() {
    check.value = '';
}

async function comprovar() {
    try {
        loading.value = true
        const res = await useLogin.reset(email.value, subject.value, body.value)
        resp = res.status
        if (resp == 200) {
            watch(check, () => {
                limpiarEstado();
            });
            router.replace('/home'); // Redirige al usuario a la página '/home'
            verdadero.value = Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Continua para restablecer tu contraseña',
                showConfirmButton: false,
                timer: 2000
            })
        } else {
        }
    } catch (error) {
        loading.value = true
    }
    loading.value = false
    compruevaCorreo.value = false
    return true
}

function guardar() {
    passwordNueva.value = true
}

function validar() {
    console.log("estoy en validar");
    if (cedula.value.trim() == "") {
        checking.value = "Inserta tus datos en los campos"
    } else if (password.value.trim() == "") {
        checking.value = "Inserta tus datos en los campos"
    } else {
        checking.value = ""
        /* Read more about handling dismissals below */

        if (Login() == true && resp == 200) {
            verdadero.value
        } else if (resp !== 200) {
            console.log(resp);
            falso.value
        }
    }
}

async function Login() {
    try {
        loading.value = true
        r = await useLogin.validar(cedula.value, password.value)
        console.log(r);
        resp = r.status
        console.log("estado");
        console.log(resp);
        if (resp == 200) {
            console.log("sesion exitosa");
            router.push("/home");
            verdadero.value = Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Bienvenido',
                showConfirmButton: false,
                timer: 2000
            })
        } else {
            console.log("esty en la parte negativa");
            checking.value = "Error al iniciar sesion"

        }
    } catch (error) {
        loading.value = true
        falso.value = Swal.fire({
            icon: 'error',
            title: 'Oopsss..',
            text: 'Los datos son incorrectos intente nuevamente',
        })
    }
    loading.value = false
    return true
}

const images = [
    'https://fulbright.edu.co/wp-content/uploads/2021/09/BARE-5.jpeg',
    'https://agenciapublicadeempleo.sena.edu.co/imgLayout/Boletines%20de%20prensa/Instructor%20SENA-min%20(1).jpg',
    'https://www.portafolio.co/files/article_multimedia/uploads/2019/03/13/5c89a35b58374.jpeg',
    'https://www.culturarecreacionydeporte.gov.co/sites/default/files/styles/1300/public/noticias/imagen/2023-04/sena-scrd_001.jpg?itok=KUwK_eI7',
];
const currentImageIndex = ref(0);
const currentImage = ref(null);

const changeImage = () => {
    currentImageIndex.value = (currentImageIndex.value + 1) % images.length;
    currentImage.value = images[currentImageIndex.value];
};

let timer;

onMounted(() => {
    setTimeout(() => {
        changeImage();
        timer = setInterval(changeImage, 10000);
    }, 0);

    return () => {
        clearInterval(timer);
    };
});

</script>

<style scoped>
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

#col7 {
    position: relative;
    /* Necesario para posicionar el pseudo-elemento */
    width: 100%;
    height: 100vh;
    display: flex;
    /* Opcional: Usar flexbox para alinear contenido */
    align-items: center;
    /* Opcional: Centrar contenido verticalmente */
    justify-content: center;
    /* Opcional: Centrar contenido horizontalmente */
    overflow: hidden;
    /* Asegura que el pseudo-elemento no se salga del contenedor */
}

#col7::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("../img/logo_sena.png");
    background-size: cover;
    /* Ajusta la imagen para cubrir el área del contenedor */
    background-position: center;
    /* Centra la imagen en el contenedor */
    background-repeat: no-repeat;
    /* Evita que la imagen se repita */
    opacity: 0.1;
    /* Ajusta la opacidad de la imagen */
    z-index: 1;
    /* Coloca el pseudo-elemento detrás del contenido */
}

#col7>* {
    position: relative;
    /* Asegura que el contenido se muestre encima del pseudo-elemento */
    z-index: 2;
}

#cart {
    width: 25rem;
    height: 30rem;
    max-width: 100%;
    max-height: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

#card {
    background-color: #e1e1e18c;
    /* Color de fondo suave */
    border-radius: 10px;
    /* Bordes redondeados */
    padding: 20px;
    /* Espaciado interno */
    position: relative;
    /* Necesario para el pseudo-elemento */
    transition: box-shadow 0.3s;
    /* Transición suave para el resaltado */
}

#card:hover {
    color: #070707;
    box-shadow: 0 4px 8px rgb(0, 0, 0);
    /* Sombra al pasar el mouse */
}

/* Degradado para el borde */
#card::before {
    content: "";
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    background: linear-gradient(45deg, rgba(255, 255, 255, 0.764), rgba(246, 246, 246, 0.74), rgba(219, 218, 218, 0.789), rgba(188, 188, 188, 0.5));
    background-size: 400% 400%;
    border-radius: 15px;
    opacity: 0;
    transition: opacity 0.8s, transform 0.5s;
    filter: blur(8px);
    /* Difuminado del borde */
}

#card:hover::before {
    opacity: 1;
    transform: scale(1.05);
}

/* Estilo para el texto */
h2 {
    margin-bottom: 10px;
}

p {
    color: #070707;
}


#img {
    max-width: 100%;
    max-height: 100%;
    height: 100vh;
    display: flex;
    margin-bottom: 0;
    border-radius: 2px;
    border: 0.5px solid #c4c4c4a5;
    object-fit: cover;
    object-position: center;
}

.h1 {
    color: white;
    /* A light text makes a nice bright flame source */
    background: black;
    /* A dark background gives some contrast */
    letter-spacing: 3em;
    /* Big text shows off the effect best */
    font-weight: bold;
}
</style>