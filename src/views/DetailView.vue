<script setup>
import { useRoute } from 'vue-router';
import { RouterLink } from 'vue-router';
import { ref } from 'vue'

const images = ref([])
const route = useRoute()
const detailRequest = route.params.id
const sharedLink = ref('')
const showModal = ref(false)

const placeDetail = ref({
    id: null,
    name: "",
    location: "",
    cover: "",
    images: [],
    category: "",
    host_name: "",
    bed_count: "",
    rooms_count: "",
    bathroom_count: "",
    guest_count: "",
    description: "",
    price: "",
})

axios.get(`/api/v1/home/${detailRequest}`).then(response => {
    const data = response.data.data
    placeDetail.value.id = data.id
    placeDetail.value.name = data.name
    placeDetail.value.location = `${data.state.state}, ${data.country.country}`
    placeDetail.value.cover = data.cover
    placeDetail.value.images = data.images
    images.value = response.data.images
    placeDetail.value.category = data.subcategory.title
    placeDetail.value.host_name = data.author.user
    placeDetail.value.bed_count = data.bed_count
    placeDetail.value.rooms_count = data.bedroom_count
    placeDetail.value.bathroom_count = data.bathroom_count
    placeDetail.value.guest_count = data.accommodate_count
    placeDetail.value.description = data.description
    placeDetail.value.price = data.price
})

function sharePlaceLink() {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL)
        .then(() => {
            sharedLink.value = currentURL;
            showModal.value = true;

            setTimeout(() => {
                document.getElementById('exampleModal').querySelector('[data-bs-dismiss="modal"]').click();
            }, 2000);

        })
        .catch(error => {
            console.error('Error al copiar el enlace: ', error);
        });
}

const comeBack = () => {
    window.close()
}

</script>

<template>
    <section class="container mt-4 mb-4 d-none" id="custom-container">
        <h1 class="col-lg-12 stay-title">
            {{ placeDetail.name }}
        </h1>
        <div class="col-lg-12 icons d-flex align-items-center mb-2">
            <div class="col-lg-6 d-flex justify-content-start">
                <span class="material-symbols-sharp">
                    location_on
                </span>
                <h2 class="mx-1 p-0 mb-0 stay-location">
                    {{ placeDetail.location }}
                </h2>
            </div>
            <div class="col-lg-6 d-flex justify-content-end">
                <span class="material-symbols-sharp">
                    share
                </span>
                <span role="button" class="me-4 mx-1" @click="sharePlaceLink" data-bs-toggle="modal"
                    data-bs-target="#exampleModal">
                    Compartir
                </span>
                <span class="material-symbols-sharp">
                    favorite
                </span>
                <span class="mx-1">
                    Mi favorito
                </span>
            </div>
        </div>
    </section>

    <section class="container mt-4 mb-4" id="custom-container">
        <div class="col-12 d-flex">

            <div class="col-back-home" @click="comeBack">
                <span class="material-symbols-sharp">
                    arrow_back
                </span>
                <div class="col-tooltip">
                    <span>
                        Presione la flecha para regresar a la página principal.
                    </span>
                </div>
            </div>
            <div class="custom-width">
                <h1 class="col-lg-12 stay-title">
                    {{ placeDetail.name }}
                </h1>
                <div class="col-lg-12 icons d-flex align-items-center mb-2">
                    <div class="col-lg-6 d-flex justify-content-start">
                        <span class="material-symbols-sharp">
                            location_on
                        </span>
                        <h2 class="mx-1 p-0 mb-0 stay-location">
                            {{ placeDetail.location }}
                        </h2>
                    </div>
                    <div class="col-lg-6 d-flex justify-content-end">
                        <span class="material-symbols-sharp">
                            share
                        </span>
                        <span role="button" class="me-4 mx-1" @click="sharePlaceLink" data-bs-toggle="modal"
                            data-bs-target="#exampleModal">
                            Compartir
                        </span>
                        <span class="material-symbols-sharp">
                            favorite
                        </span>
                        <span class="mx-1">
                            Mi favorito
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="container mt-4 mb-4 d-none" id="custom-container">
        <div class="col-12 d-flex">
            <div class="col-back-home" @click="this.$router.go(-1)">
                <span class="material-symbols-sharp">
                    arrow_back
                </span>
            </div>
            <div class="custom-width">
                <h1 class="col-lg-12 stay-title bg-info">
                    {{ placeDetail.name }}
                </h1>
                <div class="col-lg-12 icons d-flex align-items-center mb-2 bg-warning">
                    <div class="col-lg-6 d-flex justify-content-start">
                        <span class="material-symbols-sharp">
                            location_on
                        </span>
                        <h2 class="mx-1 p-0 mb-0 stay-location">
                            {{ placeDetail.location }}
                        </h2>
                    </div>
                    <div class="col-lg-6 d-flex justify-content-end">
                        <span class="material-symbols-sharp">
                            share
                        </span>
                        <span role="button" class="me-4 mx-1" @click="sharePlaceLink" data-bs-toggle="modal"
                            data-bs-target="#exampleModal">
                            Compartir
                        </span>
                        <span class="material-symbols-sharp">
                            favorite
                        </span>
                        <span class="mx-1">
                            Mi favorito
                        </span>
                    </div>
                </div>
            </div>

        </div>
    </section>

    <section class="container" id="custom-container">
        <div class="row">
            <figure class="col-lg-6 pe-0">
                <img :src="'http://127.0.0.1:8000/storage/cover/' + placeDetail.cover" id="stay-cover"
                    :alt="placeDetail.cover" />
            </figure>
            <figure class="col-lg-6 px-0">
                <img v-for="(pictures) in images" :key="images.id"
                    :src="'http://127.0.0.1:8000/storage/property_images/' + pictures.property_image"
                    :alt="placeDetail.images" id="stay-images" />
            </figure>
        </div>
    </section>

    <section class="container mt-4" id="custom-container">
        <div class="row">
            <div class="col-md-8">
                <div class="row">
                    <h3 class="stay-category">
                        {{ placeDetail.category }}
                        <span v-if="placeDetail.category === 'Villa' || placeDetail.category === 'Cabaña'">
                            atendida
                        </span>
                        <span v-else>
                            atendido
                        </span>
                        por {{ placeDetail.host_name }}
                    </h3>
                    <div class="d-flex align-items-center">
                        <span class="material-symbols-sharp stay-attribute-icon">
                            king_bed
                        </span>
                        <p class="stay-attributes">
                            {{ placeDetail.bed_count }} camas
                        </p>
                        <span class="material-symbols-sharp stay-attribute-icon">
                            living
                        </span>
                        <p class="stay-attributes">
                            {{ placeDetail.rooms_count }} habitaciones
                        </p>
                        <span class="material-symbols-sharp stay-attribute-icon">
                            bathroom
                        </span>
                        <p class="stay-attributes">
                            {{ placeDetail.bathroom_count }} baños
                        </p>
                        <span class="material-symbols-sharp stay-attribute-icon">
                            group
                        </span>
                        <p class="stay-attributes">
                            {{ placeDetail.guest_count }} personas
                        </p>
                    </div>
                </div>
                <hr>
                <div class="row mt-3 mb-3" id="stay-info">
                    {{ placeDetail.description }}
                </div>
                <hr>
                <div class="row">
                    <h4 class="stay-item">
                        Sobre el lugar al que te diriges
                    </h4>
                </div>
                <div class="row" id="stay-info">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Obcaecati, in ut optio quidem corrupti
                    necessitatibus impedit aliquam, officiis hic placeat sapiente temporibus, deleniti voluptate
                    explicabo tempora repellat dignissimos. Quisquam, quis.
                </div>
                <hr>
                <div class="row">
                    <h4 class="stay-item">
                        Lo que te ofrece
                    </h4>
                </div>
                <div class="row" id="stay-info">
                    <div class="amenities-icon d-flex align-items-center p-0">
                        <img src="../assets/img/brands/stay-in-badge.svg" alt="amenity_badge">
                        <p class="amenities-amenity">
                            Lorem Ipsum
                        </p>
                    </div>
                </div>
                <hr>
                <div class="row">
                    <h4 class="stay-item">
                        Lo que debes tener en cuenta
                    </h4>
                </div>
                <div class="row" id="stay-info">
                    <div class="amenities-icon d-flex align-items-center p-0">
                        <img src="../assets/img/brands/stay-in-badge.svg" alt="amenity_badge">
                        <p class="amenities-amenity">
                            Lorem Ipsum
                        </p>
                    </div>
                </div>
                <hr>
                <div class="row">
                    <h4 class="stay-item">
                        Sobre el anfitrión
                    </h4>
                </div>
                <div class="row mt-3 d-flex justify-content-between" id="stay-info">
                    <div class="col-lg-4 m-0 p-0">
                        <figure class="img-top">
                            <img src="../assets/img/visual/person.svg" alt="host-picture" class="host-picture">
                        </figure>
                    </div>
                    <div class="col-lg-8">
                        <h4 class="host-name">
                            {{ placeDetail.host_name }}
                        </h4>
                        <p class="host-description">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, magnam quasi. Eligendi
                            velit eos fugiat amet quisquam non voluptatibus eveniet labore tempore maxime autem
                            dolores repudiandae, quos, quam exercitationem at!
                        </p>
                        <h4 class="host-lang">
                            <strong>
                                Idiomas
                            </strong>
                        </h4>
                        <p class="host-talks">
                            <strong>Principal:</strong>
                            Español
                        </p>
                        <p class="host-talks">
                            <strong>Secundario:</strong>
                            Inglés
                        </p>
                    </div>
                </div>
                <hr>
            </div>

            <div class="col-md-4">
                <div class="card sticky-top m-0" id="booking-card" style="top:8rem">
                    <div class="card-header d-flex justify-content-between" id="header-footer-card">
                        <p class="stay-price p-2 m-0">
                            <strong>
                                Precio por noche
                            </strong>
                        </p>
                        <p class="stay-price p-2 m-0">
                            <strong>
                                ${{ placeDetail.price }} USD
                            </strong>
                        </p>
                    </div>
                    <div class="card-body d-flex justify-content-center p-2">
                        <RouterLink class="btn" id="booking-consulting-button" :to="{ name: 'reservar' }">
                            <p class="nav-link mb-0 text-white">
                                Consultar disponibilidad
                            </p>
                        </RouterLink>
                    </div>
                    <div class="card-footer">
                        <small class="d-flex justify-content-center p-2">
                            Precios pueden variar según temporadas del año.
                        </small>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
        :class="{ 'show': showModal }">
        <div class="modal-dialog modal-dialog-slide-up">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title fw-bold text-white">
                        Copiado con exito
                    </h5>
                    <span class="material-symbols-sharp text-white" role="button" data-bs-dismiss="modal">
                        close
                    </span>
                </div>
                <div class="modal-body">
                    El enlace de
                    <strong>{{ placeDetail.name }}
                    </strong>
                    ¡está listo para compartirse!
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import url('../assets/css/details.css');

.col-back-home {
    width: 60px;
    display: flex;
    align-items: center;
    cursor: pointer;
}

.col-back-home span {
    font-size: 2.5rem;
    margin-left: -8px;
}

.custom-width {
    width: 80rem;
}

.col-tooltip {
    position: absolute;
    left: 10rem;
    background: var(--primary-color);
    padding: .5rem;
    border-radius: 6px;
    top: 11rem;
    font-size: 12px !important;
    color: white;
    opacity: 0;
    transition: opacity .6s ease-in-out;
}

.col-tooltip span {
    font-size: 1.3rem;
    display: flex;
    justify-content: center;
    margin: 0 auto;
}

.col-back-home:hover .col-tooltip {
    opacity: 1;
}
</style>