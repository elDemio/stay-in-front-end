<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
const routeUsing = useRoute()

import { useAuthStore } from '../../stores/auth';
const authStore = useAuthStore()
axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.authToken;

import {
    activeSection,
    nextSection,
    previousSection
} from '../../assets/v-functions/add-place'

const countries = ref([])
const departments = ref([])
const cities = ref([])
const categories = ref([])
const subcategories = ref([])
const roomstypes = ref([])
const coverImageSrc = ref('')
const photos = ref([])
const selectedCategory = ref(null)
const selectedSubCategory = ref(null)
const selectedRoomType = ref(null)

const formValues = {
    id: '',
    name: '',
    description: '',
    price: null,
    country_id: '',
    state_id: '',
    city_id: '',
    accommodate_count: null,
    bedroom_count: null,
    bed_count: null,
    bathroom_count: null,
};

onMounted(async () => {
    try {
        const countriesResponse = await axios.get('/api/v1/countries')
        countries.value = countriesResponse.data.data

        const departmentsResponse = await axios.get('/api/v1/states')
        departments.value = departmentsResponse.data.data

        const citiesResponse = await axios.get('/api/v1/cities')
        cities.value = citiesResponse.data.data

    } catch {
        console.error('Fallo en la obtención de datos')
    }
})

onMounted(async () => {
    try {
        const categoriesResponse = await axios.get('/api/v1/categories')
        categories.value = categoriesResponse.data.data

        const subcategoriesResponse = await axios.get('/api/v1/subcategories')
        subcategories.value = subcategoriesResponse.data.data

        const roomstypesResponse = await axios.get('/api/v1/roomstypes')
        roomstypes.value = roomstypesResponse.data.data

    } catch {
        console.error('Fallo en la obtención de datos')
    }
})

function readURL(event) {
    const input = event.target;
    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = (e) => {
            coverImageSrc.value = e.target.result;
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function readFile(event) {
    const inputImages = event.target;
    photos.value = [];

    const counter = inputImages.files.length;
    let x = 0;

    for (x = 0; x < counter; x++) {
        if (inputImages.files && inputImages.files[x]) {
            const reader = new FileReader();

            reader.onload = (e) => {
                photos.value.push(e.target.result);
            };
            reader.readAsDataURL(inputImages.files[x]);
        }
    }
}

function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}

function submitForm() {
    const apiUrl = '/api/v1/properties/';

    const formData = new FormData();

    formData.append('name', formValues.name);
    formData.append('description', formValues.description);
    formData.append('price', formValues.price);
    formData.append('country_id', formValues.country_id);
    formData.append('state_id', formValues.state_id);
    formData.append('city_id', formValues.city_id);
    formData.append('accommodate_count', formValues.accommodate_count);
    formData.append('bedroom_count', formValues.bedroom_count);
    formData.append('bed_count', formValues.bed_count);
    formData.append('bathroom_count', formValues.bathroom_count);
    formData.append('category_id', selectedCategory.value);
    formData.append('subcategory_id', selectedSubCategory.value);
    formData.append('room_type_id', selectedRoomType.value);

    if (coverImageSrc.value) {
        formData.append('cover', dataURItoBlob(coverImageSrc.value), 'cover_image.jpg');
    }

    for (let i = 0; i < photos.value.length; i++) {
        formData.append('property_images[]', dataURItoBlob(photos.value[i]), 'photo_' + i + '.jpg');
    }

    axios.post(apiUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data', }
    })
        .then(response => {
            console.log('Solicitud POST exitosa:', response.data.data);
            window.location.href = '/anuncios'
        })
        .catch(error => {
            console.error('Error al realizar la solicitud POST:', error);
        });
}
</script>

<template>
    <div class="container">
        <div class="section mt-3 margin-botton shadow-sm" v-if="activeSection === 1">
            <h2>
                <strong>
                    Describe tu espacio
                </strong>
            </h2>
            <div class="add-place-info">
                <div class="col-12 d-grid align-items-center mt-4 mb-4">
                    <div class="col-10 d-flex justify-content-between align-items-center rounded p-3 mx-auto bg-light">
                        <div class="add-place-info-placement d-flex justify-content-center">
                            <span class="material-symbols-sharp">
                                emoji_objects
                            </span>
                        </div>
                        <p class="mx-3 mb-0">
                            Mientras más original sea tu expresar, mayor atención captará tu espacio, asgúrate de rellenar
                            cada uno de los espacios que se te solicitan.
                        </p>
                    </div>
                </div>
                <div class="card col-lg-10 mt-3 mb-3 mx-auto">
                    <h4 class="mt-5 text-center">
                        Datos generales
                    </h4>
                    <div class="card-body p-lg-5">
                        <div class="row d-flex">
                            <div class="col-lg-8">
                                <div class="form-floating mb-4">
                                    <input class="form-control" id="floatingInput" type="text" placeholder=""
                                        v-model="formValues.name" required>
                                    <label for="floatingInput">
                                        Idea un título llamativo
                                    </label>
                                </div>
                                <div class="form-floating mb-4">
                                    <textarea class="form-control" id="floatingTextarea" placeholder=""
                                        v-model="formValues.description" required></textarea>
                                    <label for="floatingTextarea">
                                        Agrega una breve descripción
                                    </label>
                                </div>
                                <div class="form-floating">
                                    <input class="form-control" id="floatingInput" type="text" placeholder=""
                                        v-model="formValues.price" required>
                                    <label for="floatingInput">
                                        ¿Cuánto costará tu alojamiento?
                                    </label>
                                </div>
                            </div>
                            <div class="col-lg-4">
                                <div class="form-floating mb-4">
                                    <select class="form-select" id="floatingSelect" v-model="formValues.country_id"
                                        required>
                                        <option v-for="country in countries" v-bind:key="country" v-bind:value="country.id">
                                            {{ country.name }}
                                        </option>
                                    </select>
                                    <label for="floatingSelect">País</label>
                                </div>
                                <div class="form-floating mb-4">
                                    <select class="form-select" id="floatingSelect" v-model="formValues.state_id" required>
                                        <option v-for="department in departments" v-bind:key="department"
                                            v-bind:value="department.id">
                                            {{ department.name }}
                                        </option>
                                    </select>
                                    <label for="floatingSelect">
                                        Departamento
                                    </label>
                                </div>
                                <div class="form-floating">
                                    <select class="form-select" id="floatingSelect" v-model="formValues.city_id" required>
                                        <option v-for="city in cities" v-bind:key="city" v-bind:value="city.id">
                                            {{ city.name }}
                                        </option>
                                    </select>
                                    <label for="floatingSelect">
                                        Ciudad
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card col-lg-10 mx-auto mt-5 mb-5">
                    <h4 class="mt-5 text-center">
                        Admisiones y estancia
                    </h4>
                    <div class="card-body p-lg-5">
                        <div class="row">
                            <div class="col-lg-12 d-flex column-gap-3">
                                <div class="form-floating">
                                    <input class="form-control" id="floatingInput" type="text" placeholder="" required
                                        v-model="formValues.accommodate_count">
                                    <label for="floatingInput">
                                        ¿Cuántos huéspedes?
                                    </label>
                                </div>
                                <div class="form-floating">
                                    <input class="form-control" id="floatingInput" type="text" placeholder="" required
                                        v-model="formValues.bedroom_count">
                                    <label for="floatingInput">
                                        ¿Cúantas habitaciones?
                                    </label>
                                </div>
                                <div class="form-floating">
                                    <input class="form-control" id="floatingInput" type="text" placeholder="" required
                                        v-model="formValues.bed_count">
                                    <label for="floatingInput">
                                        ¿Cuántas camas?
                                    </label>
                                </div>
                                <div class="form-floating">
                                    <input class="form-control" id="floatingInput" type="text" placeholder="" required
                                        v-model="formValues.bathroom_count">
                                    <label for="floatingInput">
                                        ¿Cuántos baños?
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="section mt-2 shadow-sm margin-botton" v-if="activeSection === 2">
            <h2>
                <strong>
                    Haz que tu espacio destaque
                </strong>
            </h2>
            <div class="col-12 d-grid align-items-center mt-4 mb-4">
                <div class="col-10 d-flex justify-content-between align-items-center rounded p-3 mx-auto bg-light">
                    <div class="add-place-info-placement d-flex justify-content-center">
                        <span class="material-symbols-sharp">
                            emoji_objects
                        </span>
                    </div>
                    <p class="mx-3 mb-0">
                        Para que tu espacio luzca atractivo a la vista de huéspedes potenciales, asegúrate de elegir las
                        mejores fotografías en los mejores ángulos visuales.
                    </p>
                </div>
            </div>
            <div class="add-place-info">
                <div class="card col-lg-10 mx-auto mt-5 mb-5">
                    <div class="card-body p-lg-5">
                        <div class="col-lg-12 mx-auto">
                            <p>
                                En este espacio, sube una fotografía que servirá como punto de atracción.
                            </p>
                            <div class="input-group rounded-pill bg-light d-flex">
                                <input id="upload" type="file" accept=".png, .jpg, .jpeg" @change="readURL"
                                    class="form-control border-0 add-place-hidden-label" />
                                <label for="upload" class="add-place-upload-label fw-bold text-muted">
                                    Subir foto portada
                                </label>
                                <div class="input-group-append d-flex align-items-center">
                                    <label for="upload" class="btn btn-light m-0 rounded-pill px-4">
                                        <span class="material-symbols-sharp">
                                            upload_file
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <div class="row d-flex justify-content-center">
                                <div class="add-place-cover-image">
                                    <img id="imageResult" src="../../assets/img/visual/empty.svg" alt=""
                                        v-if="coverImageSrc === ''" />
                                    <img id="imageResult" :src="coverImageSrc" alt="" v-else />
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-12">
                            <p>
                                <strong>Nota importante:</strong>
                                Este campo acepta como máximo 4 imágenes, asegúrate de
                                elegir las mejores, si te equivocas puedes editar de manera individual
                                después.
                            </p>
                            <div class="input-group rounded-pill bg-light d-flex">
                                <input :name="'property_images'" type="file" id="photo" accept=".png, .jpg, .jpeg"
                                    @change="readFile" multiple class="form-control border-0 add-place-hidden-label">
                                <label for="photo" class="add-place-upload-label fw-bold text-muted">
                                    Subir fotos de tu espacio
                                </label>
                                <div class="input-group-append d-flex align-items-center">
                                    <label for="photo" class="btn btn-light m-0 rounded-pill px-4">
                                        <span class="material-symbols-sharp">
                                            upload_file
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <div class="add-place-images-container mt-5">
                                <div v-for="(photo) in photos" class="add-place-images">
                                    <img :src="photo" alt="add-place-images">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="section mt-2 shadow-sm margin-botton" v-if="activeSection === 3">
            <h2>
                <strong>
                    Bienestar y categorización
                </strong>
            </h2>
            <div class="col-12 d-grid align-items-center mt-4 mb-4">
                <div class="col-10 d-flex justify-content-between align-items-center rounded p-3 mx-auto bg-light">
                    <div class="add-place-info-placement d-flex justify-content-center">
                        <span class="material-symbols-sharp">
                            emoji_objects
                        </span>
                    </div>
                    <p class="mx-3 mb-0">
                        Cuéntale a tus huéspedes lo que tu espacio ofrece para hacer de su estancia una excelente
                        experiencia, y así, llegar a oídos de muchos más.
                    </p>
                </div>
            </div>
            <div class="add-place-info">
                <div class="card col-lg-10 mb-5 mx-auto">
                    <h4 class="mt-5 text-center">
                        ¿Qué categoría describe mejor el espacio que ofreces?
                    </h4>
                    <div class="card-body p-lg-5">
                        <ul>
                            <li v-for="(category, index) in categories" :key="category.id + index">
                                <input class="add-place-hidden-radios" type="radio" :id="'myRadioItem' + index"
                                    :name="'category_id'" v-model="selectedCategory" v-bind:value="category.id" required />
                                <label class="add-place-checkboxes flex-wrap align-items-center shadow-sm"
                                    :for="'myRadioItem' + index">
                                    <div class="col-2">
                                        <img :src="'http://127.0.0.1:8000/storage/category/' + category.icon_image"
                                            width="50">
                                    </div>
                                    <div class="col">
                                        <h5 class="add-place-icon-title mb-2">
                                            {{ category.title }}
                                        </h5>
                                        <p class="mb-0 text-muted text-start">
                                            {{ category.description }}
                                        </p>
                                    </div>
                                </label>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="card col-lg-10 mx-auto mb-5">
                    <h4 class="mt-5 text-center">
                        ¿Cuál de estas opciones le da identidad a tu espacio?
                    </h4>
                    <div class="card-body p-lg-5">
                        <ul>
                            <li v-for="(subcategory, index) in subcategories" :key="subcategory.id + index">
                                <input class="add-place-hidden-radios" type="radio" :id="'myRadioItem2' + index"
                                    :name="'subcategory_id'" v-model="selectedSubCategory" v-bind:value="subcategory.id"
                                    required />
                                <label class="add-place-checkboxes d-flex flex-wrap align-items-center shadow-sm"
                                    :for="'myRadioItem2' + index">
                                    <h5 class="add-place-icon-title mb-2">
                                        {{ subcategory.title }}
                                    </h5>
                                    <p class="mb-0 text-start text-muted">
                                        {{ subcategory.description }}
                                    </p>
                                </label>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="card col-lg-10 mx-auto mb-5">
                    <h4 class="mt-5 text-center">
                        ¿Qué tipo de espacio alojará tus huéspedes?
                    </h4>
                    <div class="card-body p-lg-5">
                        <ul>
                            <li v-for="(roomtype, index) in roomstypes" :key="roomtype.id + index">
                                <input class="add-place-hidden-radios" type="radio" :id="'myRadioItem3' + index"
                                    :name="'room_type_id'" v-model="selectedRoomType" v-bind:value="roomtype.id" required />
                                <label class="add-place-checkboxes flex-wrap align-items-center shadow-sm"
                                    :for="'myRadioItem3' + index">
                                    <div class="col-2">
                                        <img :src="'http://127.0.0.1:8000/storage/room-type/' + roomtype.icon_image"
                                            width="50">
                                    </div>
                                    <div class="col text-start">
                                        <h5 class="add-place-icon-title mb-2">
                                            {{ roomtype.title }}
                                        </h5>
                                        <p class="mb-0 text-start text-muted">
                                            {{ roomtype.description }}
                                        </p>
                                    </div>
                                </label>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="navigation-buttons fixed-bottom bg-light">
        <div class="container p-4 d-flex justify-content-between">
            <button class="btn btn-placements" @click="previousSection" :disabled="activeSection === 1">
                Anterior
            </button>
            <button class="btn btn-placements" @click="nextSection" :disabled="activeSection === 3">
                Siguiente
            </button>
            <button class="btn btn-placements" @click.prevent="submitForm" v-if="activeSection === 3">
                Finalizar
            </button>
        </div>
    </div>
</template>
  
<style scoped>
@import url('../../assets/css/host/new-publication.css');
</style>
  
  