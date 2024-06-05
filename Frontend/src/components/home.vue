<template>
  <div class="container">
    <div class="center">
      <a>
        <img src="../img/perfil.png" clickable @click="configuracion()" class="absolute-top-right" id="img1" alt="Perfil">
      </a>
      <img src="../img/icono.png" id="img2" alt="" />
    </div>
  </div>  
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from "vue-router";
let router = useRouter();

const configuracion = () => {
  router.push("/configuracion");
};

</script>

<style scoped>
.center {
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 90vh;
}

#img2 {
  width: 35rem;
  height: auto;
  max-width: 100%;
  /* Aumentar el tamaño de la imagen */
  opacity: 40%;
  filter: brightness(0%) grayscale(100%);
}

#img1 {
  position: absolute;
  width: 100px;
  height: 100px;
  margin-top: 3rem;
  border-radius: 50%;
}
</style>