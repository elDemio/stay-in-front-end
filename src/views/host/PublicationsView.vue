<script setup>
import { ref, onMounted, watch } from 'vue';

import { useAuthStore } from '../../stores/auth';
const authStore = useAuthStore()
axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.authToken;

const hostProperties = ref([])
const searchQuery = ref('')
const filteredProperties = ref([]);
const noResultsFound = ref(false);
const totalData = ref(0)

const selectedProperty = ref([]);
const countries = ref([])
const departments = ref([])
const cities = ref([])
const categories = ref([])
const subcategories = ref([])
const roomstypes = ref([])

const selectedCountry = ref('')
const selectedState = ref('')
const selectedCity = ref('')
const selectedCategory = ref('')
const selectedSubCategory = ref('')
const selectedRoomtype = ref('')
const coverImageSrc = ref('');
const photos = ref([]);
const editIndex = ref(-1);
const imageSrc = ref('');

const formData = {
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

let selectedPropertyData = {
    id: null,
    name: ''
}

async function getHostProperties() {
    try {
        const hostPropertiesResponse = await axios.get('/api/v1/homeusers');
        hostProperties.value = hostPropertiesResponse.data.data;

        if (hostProperties.value) {
            totalData.value = Object.keys(hostProperties.value).length
        }

    } catch {
        console.log('Fallo en la obtención de datos');
    }
}

const propertyMatchesSearch = (property) => {
    if (!searchQuery.value) {
        return true;
    }

    const searchValue = searchQuery.value.toLowerCase();
    const propertyName = property.name.toLowerCase();

    return propertyName.includes(searchValue);
};

watch(hostProperties, (newHostProperties) => {
    if (typeof newHostProperties === 'object' && newHostProperties !== null) {
        const propertiesArray = Object.values(newHostProperties);

        if (searchQuery.value) {
            filteredProperties.value = propertiesArray.filter(property => propertyMatchesSearch(property));
            noResultsFound.value = filteredProperties.value.length === 0;
        } else {
            filteredProperties.value = propertiesArray;
            noResultsFound.value = false;
        }
    } else {
        console.error('Los datos de propiedades no son un objeto válido:', newHostProperties);
    }
});

watch(searchQuery, () => {
    if (Array.isArray(hostProperties.value)) {
        filteredProperties.value = hostProperties.value.filter(property => propertyMatchesSearch(property));
        noResultsFound.value = filteredProperties.value.length === 0;
    } else if (typeof hostProperties.value === 'object' && hostProperties.value !== null) {
        const propertiesArray = Object.values(hostProperties.value);

        filteredProperties.value = propertiesArray.filter(property => propertyMatchesSearch(property));
        noResultsFound.value = filteredProperties.value.length === 0;
    } else {
        console.error('Los datos de propiedades no son un array ni un objeto válido:', hostProperties.value);
    }
});

const loadAdditionalData = async (property) => {
    try {
        const countriesResponse = await axios.get('/api/v1/countries')
        countries.value = countriesResponse.data.data

        const departmentsResponse = await axios.get('/api/v1/states')
        departments.value = departmentsResponse.data.data

        const citiesResponse = await axios.get('/api/v1/cities')
        cities.value = citiesResponse.data.data

        const categoriesResponse = await axios.get('/api/v1/categories')
        categories.value = categoriesResponse.data.data

        const subcategoriesResponse = await axios.get('/api/v1/subcategories')
        subcategories.value = subcategoriesResponse.data.data

        const roomstypesResponse = await axios.get('/api/v1/roomstypes')
        roomstypes.value = roomstypesResponse.data.data

    } catch {
        console.error('Fallo en la obtención de datos');
    }
};

const editProperty = (property) => {
    selectedProperty.value = { ...property };
    selectedCountry.value = property.country.country_id;
    selectedState.value = property.state.state_id;
    selectedCity.value = property.city.city_id;
    selectedCategory.value = property.category.category_id;
    selectedSubCategory.value = property.subcategory.subcategory_id;
    selectedRoomtype.value = property.room_type.room_type_id;
    coverImageSrc.value = `http://127.0.0.1:8000/storage/cover/${property.cover}`;
    photos.value = property.images.map(image => `http://127.0.0.1:8000/storage/property_images/${image.property_image}`);

    loadAdditionalData(property)
};

const handleCoverImageChange = (event) => {
    coverImageSrc.value = URL.createObjectURL(event.target.files[0]);
};

function editImage(index) {
    editIndex.value = index;
}

function editImageFile() {
    const input = document.getElementById("edit-photo");
    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = (e) => {
            imageSrc.value = e.target.result;
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function finishEditingImage(newImageSrc) {
    if (editIndex.value !== -1) {
        if (newImageSrc) {
            photos.value[editIndex.value] = newImageSrc;
        }
        editIndex.value = -1;
    }
}

const updateProperty = async () => {

    const formData = new FormData();

    formData.append('name', selectedProperty.value.name);
    formData.append('description', selectedProperty.value.description);
    formData.append('price', selectedProperty.value.price);
    formData.append('country_id', selectedCountry.value);
    formData.append('state_id', selectedState.value);
    formData.append('city_id', selectedCity.value);
    formData.append('accommodate_count', selectedProperty.value.accommodate_count);
    formData.append('bedroom_count', selectedProperty.value.bedroom_count);
    formData.append('bed_count', selectedProperty.value.bed_count);
    formData.append('bathroom_count', selectedProperty.value.bathroom_count);
    formData.append('category_id', selectedCategory.value);
    formData.append('subcategory_id', selectedSubCategory.value);
    formData.append('room_type_id', selectedRoomtype.value);

    const fileInputCover = document.getElementById('coverInput');

    if (fileInputCover.files.length > 0) {
        formData.append('cover', fileInputCover.files[0], 'cover_image.jpg');
    }
    const fileInput = document.getElementById('photo');

    if (fileInput.files.length > 0) {

        for (let i = 0; i < fileInput.files.length; i++) {
            formData.append('property_images[]', fileInput.files[i]);
        }

    } else {
        formData.append('keep_images', 'true');
    }

    await axios.post(`/api/v1/properties/${selectedProperty.value.id}?_method=PUT`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }).then(response => {
        console.log('Solicitud POST exitosa:', response.data.data);
        location.reload()

    }).catch(error => {
        console.error('Error al realizar la solicitud POST:', error);

    });
    console.log(formData)
};

const deleteProperty = (id) => {

    axios.delete(`/api/v1/properties/${id}`).then(res => {
        console.log('Property deleted:', res);

        document.getElementById('deleteModal').querySelector('[data-bs-dismiss="modal"]').click();
        location.reload();

    }).catch(error => {
        console.error('Error deleting property:', error);

    });
}

const openDeleteModal = (id, name) => {
    selectedPropertyData.id = id;
    selectedPropertyData.name = name;
}

const closeWindow = () => {
    if (selectedPropertyData.id) {
        deleteProperty(selectedPropertyData.id);
    }
}

onMounted(() => {
    getHostProperties()
})
</script>

<template>
    <main class="container-fluid host-panel-container">
        <div class="row mt-5 mb-4 px-3">
            <div class="col-lg-4">
                <span class="host-places-count">
                    {{ totalData }}
                    <span v-if="totalData === 1">
                        anuncio
                    </span>
                    <span v-else>
                        anuncios
                    </span>
                    <span v-if="totalData === 1">
                        publicado
                    </span>
                    <span v-else>
                        publicados
                    </span>
                    por {{ authStore.user }}
                </span>
            </div>
            <div class="col-lg-8 d-flex justify-content-end">
                <button class="host-add-stay btn btn-dark d-flex justify-content-center">
                    <RouterLink to="/nueva" class="nav-link d-flex align-items-center">
                        <span class="material-symbols-sharp text-white">
                            add
                        </span>
                        <h6 class="host-add-stay-title">
                            Nuevo anuncio
                        </h6>
                    </RouterLink>
                </button>
            </div>
        </div>

        <div class="container-fluid">
            <div class="row d-flex align-items-center host-filters-container">
                <div class="col-lg-4">
                    <div class="input-group">
                        <div class="input-group-text">
                            <span class="material-symbols-sharp">
                                search
                            </span>
                        </div>
                        <input type="text" class="search-form-input" placeholder="Buscar por nombre" v-model="searchQuery">
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="col-12 p-5 bg-light border" v-if="hostProperties.length === 0">
                <h3 class="text-center text-muted fs-5 mb-0">
                    No tienes anuncios publicados a tu nombre.
                </h3>
            </div>
            <table class="table border-top" v-else>
                <thead>
                    <tr>
                        <th scope="col">Lugar</th>
                        <th scope="col">Categoría</th>
                        <th scope="col">Tipo de alojamiento</th>
                        <th scope="col">Habitaciones</th>
                        <th scope="col">Precio</th>
                        <th scope="col" class="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="hostProperty in filteredProperties">
                        <tr>
                            <td>
                                <div class="row">
                                    <div class="col-4">
                                        <img :src="'http://127.0.0.1:8000/storage/cover/' + hostProperty.cover" alt="cover"
                                            id="host-table-place-cover">
                                    </div>
                                    <div class="col-6 d-flex align-items-center">
                                        <h6 class="host-table-place-title">
                                            {{ hostProperty.name }}
                                        </h6>
                                    </div>
                                </div>
                            </td>
                            <td>{{ hostProperty.category.title }}</td>
                            <td>{{ hostProperty.room_type.title }}</td>
                            <td>{{ hostProperty.bedroom_count }}</td>
                            <td>${{ hostProperty.price }} USD</td>
                            <td class="text-center">
                                <button type="button" class="btn btn-just-icon btn-sm" id="action-buttons"
                                    @click="editProperty(hostProperty)" data-bs-toggle="modal"
                                    data-bs-target="#propertyModal">
                                    <span class="material-symbols-sharp">
                                        edit
                                    </span>
                                </button>
                                <button type="button" class="btn btn-just-icon btn-sm" id="action-buttons"
                                    @click="openDeleteModal(hostProperty.id, hostProperty.name)" data-bs-toggle="modal"
                                    data-bs-target="#deleteModal">
                                    <span class="material-symbols-sharp">
                                        delete
                                    </span>
                                </button>
                            </td>
                        </tr>
                    </template>
                    <td colspan="6" v-show="noResultsFound">
                        <div class="col-12 p-5 bg-light border">
                            <h3 class="text-center text-muted fs-5 mb-0">
                                Ningún anuncio coincide con tu busqueda.
                            </h3>
                        </div>
                    </td>
                </tbody>
            </table>
        </div>

        <div class="modal fade" id="propertyModal" tabindex="-1" aria-labelledby="propertyModalLabel" aria-hidden="true"
            role="dialog" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-xl modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header" id="edit-place-header">
                        <h5 class="modal-title">
                            Editar espacio
                        </h5>
                        <span class="material-symbols-sharp text-white" role="button" data-bs-dismiss="modal">
                            close
                        </span>
                    </div>
                    <div class="modal-body">
                        <div class="col-12 d-flex justify-content-between align-items-center px-5">
                            <h3 class="edit-place-section-heading mt-4">
                                Editar datos generales
                            </h3>
                        </div>
                        <div class="card col-lg-11 mt-3 mb-3 mx-auto">
                            <div class="card-body p-lg-4">
                                <div class="row d-flex">
                                    <div class="col-lg-8">
                                        <div class="form-floating">
                                            <input class="form-control" id="floatingInput" v-model="selectedProperty.name">
                                            <label for="floatingInput">
                                                Nombre del espacio
                                            </label>
                                        </div>
                                        <div class="form-floating mt-3">
                                            <textarea class="form-control" id="floatingTextArea"
                                                v-model="selectedProperty.description"></textarea>
                                            <label for="floatingTextarea">
                                                Descripción del espacio
                                            </label>
                                        </div>
                                        <div class="form-floating mt-3">
                                            <input class="form-control" id="floatingInput" v-model="selectedProperty.price">
                                            <label for="floatingInput">
                                                Precio
                                            </label>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <select class="form-select" id="floatingSelect"
                                            aria-label="Floating label select example" v-model="selectedCountry" required>
                                            <option v-for="country in countries" v-bind:key="country.id"
                                                v-bind:value="country.id" class="options">
                                                {{ country.name }}
                                            </option>
                                        </select>
                                        <select class="form-select mt-3" id="floatingSelect"
                                            aria-label="Floating label select example" v-model="selectedState" required>
                                            <option v-for="state in departments" v-bind:key="state.id"
                                                v-bind:value="state.id" class="options">
                                                {{ state.name }}
                                            </option>
                                        </select>
                                        <select class="form-select mt-3" id="floatingSelect"
                                            aria-label="Floating label select example" v-model="selectedCity" required>
                                            <option v-for="city in cities" v-bind:key="city.id" v-bind:value="city.id"
                                                class="options">
                                                {{ city.name }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="card col-lg-10 mt-3 mb-3 mx-auto">
                                <div class="card-body p-lg-5">
                                    <div class="row">
                                        <div class="col-lg-12 d-flex column-gap-3">
                                            <div class="form-floating">
                                                <input class="form-control" id="floatingInput" type="text" required
                                                    v-model="selectedProperty.accommodate_count">
                                                <label for="floatingInput">
                                                    ¿Cuántos huéspedes?
                                                </label>
                                            </div>
                                            <div class="form-floating">
                                                <input class="form-control" id="floatingInput" type="text" required
                                                    v-model="selectedProperty.bedroom_count">
                                                <label for="floatingInput">
                                                    ¿Cúantas habitaciones?
                                                </label>
                                            </div>
                                            <div class="form-floating">
                                                <input class="form-control" id="floatingInput" type="text" required
                                                    v-model="selectedProperty.bed_count">
                                                <label for="floatingInput">
                                                    ¿Cuántas camas?
                                                </label>
                                            </div>
                                            <div class="form-floating">
                                                <input class="form-control" id="floatingInput" type="text" required
                                                    v-model="selectedProperty.bathroom_count">
                                                <label for="floatingInput">
                                                    ¿Cuántos baños?
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 d-flex justify-content-between align-items-center px-5">
                            <h3 class="edit-place-section-heading mt-4">
                                Editar imagen de portada y del espacio
                            </h3>
                        </div>
                        <div class="card col-lg-11 mt-3 mb-3 mx-auto">
                            <div class="card-body p-lg-5">
                                <div class="col d-flex flex-wrap align-items-center">
                                    <div
                                        class="col-12 d-flex justify-content-between align-items-center rounded p-3 mx-auto bg-light mb-4">
                                        <div class="edit-place-info-placement d-flex justify-content-center">
                                            <span class="material-symbols-sharp">
                                                emoji_objects
                                            </span>
                                        </div>
                                        <p class="mx-3 mb-0">
                                            Debes considerar que tu imagen de portada está para captar la atención de tus
                                            huéspedes de entre todos los lugares que se listan, así que si no es necesario
                                            cambiarla, puedes mantenerla así.
                                        </p>
                                    </div>
                                    <figure class="edit-place-cover-image mx-auto">
                                        <img :src="coverImageSrc" alt="Cover Image" v-if="coverImageSrc" />
                                    </figure>
                                    <input :name="'cover'" id="coverInput"
                                        class="add-place-update-cover-label mx-auto mt-3 mb-5" type="file"
                                        @change="handleCoverImageChange" accept="image/*" />
                                </div>
                                <div class="col">
                                    <div
                                        class="col-12 d-flex justify-content-between align-items-center rounded p-3 mx-auto bg-light">
                                        <div class="edit-place-info-placement d-flex justify-content-center">
                                            <span class="material-symbols-sharp">
                                                emoji_objects
                                            </span>
                                        </div>
                                        <p class="mx-3 mb-0">
                                            Puedes elegir nuevas imagenes solo si es necesario, ten en cuenta que las nuevas
                                            imagenes reemplazarán las que estás viendo, así que si no necesitas cambiarlas,
                                            puedes dejar éste campo así como está.
                                        </p>
                                    </div>
                                    <div class="col-lg-12 mt-4 mb-4 mx-auto text-center">
                                        <input :name="'property_images'" type="file" id="photo" accept=".png, .jpg, .jpeg"
                                            @change="readFile" multiple class="add-place-update-cover-label mx-auto">
                                    </div>
                                    <div class="col p-2 edit-place-images-container">
                                        <div v-for="(photo, index) in photos"
                                            :class="{ 'edit-place-images': true, 'editing': index === editIndex, 'blur': index === editIndex }">
                                            <div class="edit-place-image-container">
                                                <img :src="photo">
                                                <div class="button-container">
                                                    <button class="btn d-flex align-items-center" @click="editImage(index)">
                                                        <span class="material-symbols-sharp me-2">
                                                            edit
                                                        </span>
                                                        Editar
                                                    </button>
                                                    <button class="btn d-flex align-items-center"
                                                        @click="deleteImage(index)">
                                                        <span class="material-symbols-sharp me-2">
                                                            delete
                                                        </span>
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-12 d-flex mt-3" v-if="editIndex !== -1">
                                            <input type="file" id="edit-photo" accept=".png, .jpg, .jpeg"
                                                @change="editImageFile" class="add-place-update-label">
                                            <button class="btn btn-save-changes" @click="finishEditingImage(imageSrc)">
                                                Guardar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-12 d-flex justify-content-between align-items-center px-5">
                            <h3 class="edit-place-section-heading mt-4">
                                Editar categoría a la que pertenece tu espacio
                            </h3>
                        </div>
                        <div class="card col-lg-11 mt-3 mb-3 mx-auto">
                            <div class="card-body p-lg-4">
                                <ul>
                                    <li v-for="(category, index) in categories" :key="category.id + index">
                                        <input class="edit-place-hidden-radios" type="radio" :id="'myRadioItem' + index"
                                            :name="'category_id'" v-model="selectedCategory" v-bind:value="category.id" />
                                        <label class="edit-place-checkboxes flex-wrap align-items-center shadow-sm"
                                            :for="'myRadioItem' + index">
                                            <div class="col-2">
                                                <img :src="'http://127.0.0.1:8000/storage/category/' + category.icon_image"
                                                    width="50">
                                            </div>
                                            <div class="col">
                                                <h5 class="edit-place-icon-title mb-2">
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
                        <div class="col-12 d-flex justify-content-between align-items-center px-5">
                            <h3 class="edit-place-section-heading mt-4">
                                Editar la subcategoría que le da identidad a tu espacio
                            </h3>
                        </div>
                        <div class="card col-lg-11 mt-3 mb-3 mx-auto">
                            <div class="card-body p-lg-4">
                                <ul>
                                    <li v-for="(subcategory, index) in subcategories" :key="subcategory.id + index">
                                        <input class="edit-place-hidden-radios" type="radio" :id="'myRadioItem2' + index"
                                            :name="'subcategory_id'" v-model="selectedSubCategory"
                                            v-bind:value="subcategory.id" />
                                        <label class="edit-place-checkboxes flex-wrap align-items-center shadow-sm"
                                            :for="'myRadioItem2' + index">

                                            <div class="col">
                                                <h5 class="edit-place-icon-title mb-2">
                                                    {{ subcategory.title }}
                                                </h5>
                                                <p class="mb-0 text-muted text-start">
                                                    {{ subcategory.description }}
                                                </p>
                                            </div>
                                        </label>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-12 d-flex justify-content-between align-items-center px-5">
                            <h3 class="edit-place-section-heading mt-4">
                                Editar el tipo de espacio que alojará a tus huéspedes
                            </h3>
                        </div>
                        <div class="card col-lg-11 mt-3 mb-3 mx-auto">
                            <div class="card-body p-lg-4">
                                <ul>
                                    <li v-for="(roomtype, index) in roomstypes" :key="roomtype.id + index">
                                        <input class="edit-place-hidden-radios" type="radio" :id="'myRadioItem3' + index"
                                            :name="'room_type_id'" v-model="selectedRoomtype" v-bind:value="roomtype.id" />
                                        <label class="edit-place-checkboxes flex-wrap align-items-center shadow-sm"
                                            :for="'myRadioItem3' + index">
                                            <div class="col-2">
                                                <img :src="'http://127.0.0.1:8000/storage/room-type/' + roomtype.icon_image"
                                                    widthce-="50">
                                            </div>
                                            <div class="col">
                                                <h5 class="edit-place-icon-title mb-2">
                                                    {{ roomtype.title }}
                                                </h5>
                                                <p class="mb-0 text-muted text-start">
                                                    {{ roomtype.description }}
                                                </p>
                                            </div>
                                        </label>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-center">
                        <button type="button" class="btn btn-cancel" data-bs-dismiss="modal">
                            Cancelar
                        </button>
                        <button type="button" class="btn btn-save" @click.prevent="updateProperty">
                            Actualizar espacio
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header" id="delete-place-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">
                            Eliminar espacio
                        </h1>
                    </div>
                    <div class="modal-body">
                        <div class="col-lg-12">
                            <div class="px-lg-5">
                                <div class="text-center">
                                    <span class="material-symbols-sharp" id="warning-icon">
                                        warning
                                    </span>
                                </div>
                            </div>

                            <div class="card-body p-3">
                                <h5 class="mb-2 text-center">
                                    <strong>
                                        ¿Eliminar éste espacio?
                                    </strong>.
                                </h5>
                            </div>

                            <div class="card-body p-lg-3">
                                <p class="mb-4 text-center">
                                    Debes tener en cuenta que si lo eliminas, no podrás recuperar los datos de ninguna
                                    manera.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-center">
                        <button type="button" class="btn btn-cancel" data-bs-dismiss="modal">
                            Cancelar
                        </button>
                        <button type="button" class="btn btn-save" @click="closeWindow">
                            Sí, eliminar espacio
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
@import url('../../assets/css/host/publications.css');
@import url('../../assets/css/host/edit-publication.css');
</style>