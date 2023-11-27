<script setup>
import { RouterLink } from 'vue-router'
import { ref, watch, onMounted } from 'vue'

const places = ref([])
const selectedCategory = ref(null)
const filteredPlaces = ref([]);

const categories = ref([
    { id: 1, title: 'Apartamentos' },
    { id: 2, title: 'Casas' },
    { id: 3, title: 'Alojamientos únicos' }
])

const catIcons = {
    1: 'apartment',
    2: 'house',
    3: 'room_preferences'
}

onMounted(async () => {
    try {
        const placesResponse = await axios.get('/api/v1/home')
        places.value = placesResponse.data.data

        filteredPlaces.value = places.value

        if (filteredPlaces.value) {
            filteredPlaces.value.sort((a, b) => {
                return b.id - a.id
            })
        }
    } catch {
        console.error('Fallo en la obtención de datos')
    }
})

const filterByCategory = (categoryId) => {
    selectedCategory.value = categoryId;
};

watch(selectedCategory, (newValue) => {
    if (newValue === null) {
        filteredPlaces.value = places.value;
    } else {
        filteredPlaces.value = places.value.filter(place => place.category.category_id === newValue);
    }
});
</script>

<template>
    <section class="static-filters sticky-top">
        <div class="categories d-flex justify-content-center">
            <div v-for="category in categories" :key="category.id" @click="filterByCategory(category.id)"
                :class="{ active: selectedCategory === category.id }">
                <figure class="filter-icon d-flex justify-content-center">
                    <span class="material-symbols-sharp category-icon">
                        {{ catIcons[category.id] }}
                    </span>
                </figure>
                <h6 class="category-name mb-0 d-flex align-items-center">
                    {{ category.title }}
                </h6>
            </div>
        </div>
    </section>

    <div class="places-container" :key="selectedCategory">
        <div class="col-sm-auto col-md-auto col-lg-auto mt-3" v-for="stays in filteredPlaces" :key="places.id">
            <RouterLink class="nav-link" :to="'/detalles/' + stays.id + '/' + stays.name" target="_blank">
                <div class="card-place">
                    <figure class="card-place-cover">
                        <img :src="'http://127.0.0.1:8000/storage/cover/' + stays.cover" :alt="stays.cover" />
                    </figure>
                    <h1 class="card-place-heading">
                        <strong>{{ stays.name }}</strong>
                    </h1>
                    <h2 class="card-place-category">
                        {{ stays.subcategory.title }} en {{ stays.state.state }}
                    </h2>
                    <h3 class="card-place-elements">
                        {{ stays.bed_count }} camas -
                        {{ stays.bathroom_count }} baños -
                        {{ stays.accommodate_count }} huéspedes
                    </h3>
                    <h4 class="card-place-price">
                        <strong class="card-place-usd">${{ stays.price }} USD</strong> por noche
                    </h4>
                </div>
            </RouterLink>
        </div>
    </div>
</template>

<style scoped>
@import url('../assets/css/home.css');
</style>