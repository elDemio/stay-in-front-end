<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

import { useAuthStore } from '../../stores/auth';
const authStore = useAuthStore();
axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.authToken;

import { timeLapsed, getTimeLapsed } from '../../assets/v-functions/covert'

const currentIndex = ref(0);
const cardWidth = ref(0);
const profileProperties = ref([])

const items = ref(['Tarjeta 1', 'Tarjeta 2', 'Tarjeta 3', 'Tarjeta 4', 'Tarjeta 5', 'Tarjeta 6', 'Tarjeta 7', 'Tarjeta 8']);

const prevCard = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--;
        updateCarousel();
    }
};

const nextCard = () => {
    if (currentIndex.value < items.value.length - 1) {
        currentIndex.value++;
        updateCarousel();
    }
};

const updateCarousel = () => {
    const offset = -currentIndex.value * 365;
    const carousel = document.querySelector('.carousel');
    carousel.style.transform = `translateX(${offset}px)`;
};

async function getInProfileHostProperties() {
    const profileHostPropertiesResponse = await axios.get('/api/v1/homeusers')
    profileProperties.value = profileHostPropertiesResponse.data.data
}

const checkUserRoleAndMount = () => {
    if (authStore.user && authStore.role === 'isHost') {
        getInProfileHostProperties();
    } else {
        console.log('Datos reservados para el anfitrión.')
    }
}

onMounted(() => {
    getTimeLapsed();
    checkUserRoleAndMount();
    cardWidth.value = document.querySelector('.card').offsetWidth;
});

onBeforeUnmount(() => {
});
</script>

<template>
    <div class="container profile-container">
        <div class="profile-body mx-auto">
            <div class="col-lg-12 d-flex justify-content-center">
                <img src="../../assets/img/visual/picture.svg" alt="" class="body-image" />
            </div>
            <div class="header-container d-flex justify-content-center">
                <div class="header">
                    <h1 class="col-lg-12 text-center main-heading">
                        {{ authStore.user }}
                    </h1>
                    <div class="col-lg-12 d-flex justify-content-center">
                        <span class="tag" v-if="authStore.user && authStore.role === 'isHost'">
                            Anfitrión -
                        </span>
                        <span class="tag" v-else>
                            Huésped -
                        </span>
                        <span class="tag">
                            {{ timeLapsed }} en Stay In
                        </span>
                    </div>
                </div>
            </div>
            <div class="row d-flex mt-3">
                <div class="profile-body-info col-lg-6 p-4">
                    <div class="col-lg-12 d-flex">
                        <span class="material-symbols-sharp me-2">
                            info
                        </span>
                        <h2 class="profile-subheadings">
                            Acerca de Ángel
                        </h2>
                    </div>
                    <p class="profile-text-descriptions">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure eaque eum ullam praesentium! Vel
                        in sit culpa quia obcaecati autem suscipit harum exercitationem. Est exercitationem et, minus
                        consequuntur ea officiis?
                    </p>
                    <button class="btn btn-dark d-flex align-items-center text-center" id="profile-edit">
                        <span class="material-symbols-sharp me-1">
                            edit
                        </span>
                        Editar perfil
                    </button>
                </div>
                <div class="profile-body-info col-lg-6 p-4">
                    <div class="col-lg-12 d-flex">
                        <span class="material-symbols-sharp me-2">
                            interests
                        </span>
                        <h2 class="profile-subheadings">
                            Sus intereses
                        </h2>
                    </div>

                    <div class="col-lg-12 g-lg-2 align-items-center mt-3">
                        <ul class="profile-interests-container px-0">
                            <li class="profile-interest d-flex align-items-center">
                                <img src="../../assets/img/brands/stay-in-badge.svg" width="34" alt="interests_badge">
                                <p class="mb-0 mx-1">
                                    Lorem Ipsum
                                </p>
                            </li>
                            <li class="profile-interest d-flex align-items-center">
                                <img src="../../assets/img/brands/stay-in-badge.svg" width="34" alt="interests_badge">
                                <p class="mb-0 mx-1">
                                    Lorem Ipsum
                                </p>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>

        <div class="profile-visited-container mx-auto">
            <div class="col-lg-12 pb-3">
                <h2 class="profile-out-subheadings pb-0">
                    Lugares visitados por {{ authStore.user }}
                </h2>
            </div>
            <div class="carousel-container">
                <button @click="prevCard" class="prev-button btn btn-dark" v-if="currentIndex > 0">
                    <span class="material-symbols-sharp d-flex">
                        chevron_left
                    </span>
                </button>
                <div class="carousel-wrapper">
                    <div class="carousel">
                        <div class="card" v-for="(item, index) in items" :key="index">
                            <div class="col d-flex align-items-center">
                                <figure class="profile-visited-img">
                                    <img src="../../assets/img/brands/stay-in-badge.svg" alt="">
                                </figure>
                                <div class="col px-3">
                                    <h6>
                                        <strong>
                                            {{ item }}
                                        </strong>
                                    </h6>
                                    <h6>
                                        Detalle del lugar - 20/12/23
                                    </h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button @click="nextCard" class="next-button btn btn-dark">
                    <span class="material-symbols-sharp d-flex">
                        chevron_right
                    </span>
                </button>
            </div>
        </div>

        <div class="profile-visited-container mx-auto" v-show="authStore.user && authStore.role === 'isHost'">
            <div class="col-lg-12 pb-3 d-flex justify-content-between">
                <h2 class="profile-out-subheadings pb-0">
                    Lugares publicados por {{ authStore.user }}
                </h2>
                <button class="btn border-0 me-2">
                    <RouterLink class="nav-link" to="/anuncios">
                        <u>
                            Ver todo
                        </u>
                    </RouterLink>
                </button>
            </div>
            <div class="col-12 p-5 bg-light border" v-if="profileProperties.length === 0">
                <h3 class="text-center text-muted fs-5 mb-0">
                    Aún no has publicado anuncios.
                </h3>
            </div>
            <div class="carousel-container" v-else>
                <div class="carousel-wrapper">
                    <div class="carousel">
                        <div class="card" v-for="(profileProperty, index) in profileProperties" :key="index">
                            <div class="col d-flex align-items-center">
                                <figure class="profile-visited-img me-2">
                                    <img :src="'http://127.0.0.1:8000/storage/cover/' + profileProperty.cover" alt="">
                                </figure>
                                <div class="col">
                                    <h6>
                                        <strong>
                                            {{ profileProperty.name }}
                                        </strong>
                                    </h6>
                                    <h6>
                                        {{ profileProperty.subcategory.title }}
                                    </h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import url('../../assets/css/guest/profile.css');
</style>