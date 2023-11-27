<script setup>
import { ref, onMounted } from 'vue';

import { useAuthStore } from '../../stores/auth';
const authStore = useAuthStore()
axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.authToken;

import { translateCreatedAt } from '../../assets/v-functions/covert'
import {
    showReservas,
    showHistorial,
    toggleBookings,
    toggleHistory
} from '../../assets/v-functions/bookings';

const hostPanelProperties = ref([])
const hostBookings = ref([]);
const hostFinishedBookings = ref([])
const selectedBooking = ref([])
const selectedBookingName = ref([])
const selectedBookingGuestName = ref([])
const selectedBookingGuestEmail = ref([])
const selectedBookingPricePerNight = ref([])
const selectedBookingPricePerStay = ref([])
const selectedBookingCleaningFee = ref([])
const selectedBookingTotalPrice = ref([])

async function getHostPanelProperties() {
    try {
        const hostPanelPropertiesResponse = await axios.get('/api/v1/homeusers');
        hostPanelProperties.value = hostPanelPropertiesResponse.data.data;

    } catch (error) {
        console.log('Fallo en la obtención de datos');
    }
}

async function getHostBookings() {
    try {
        const response = await axios.get('/api/v1/bookings');

        const userHostBookings = response.data.data.filter(booking => {
            return booking.property.host_name == authStore.user;
        });
        console.log(userHostBookings)

        hostBookings.value = filterActiveBookings(userHostBookings);
        hostFinishedBookings.value = filterInactiveBookings(userHostBookings);
    } catch (error) {
        console.error('Error al obtener las reservas:', error);
    }
}

const getBooking = (booking) => {
    selectedBooking.value = { ...booking }
    selectedBookingName.value = booking.property.name
    selectedBookingGuestName.value = booking.author.user
    selectedBookingGuestEmail.value = booking.author.email
    selectedBookingPricePerNight.value = formatCurrency(booking.price_per_day)
    selectedBookingCleaningFee.value = formatCurrency(booking.cleaning_fee)
    selectedBookingPricePerStay.value = formatCurrency(booking.price_for_stay)
    selectedBookingTotalPrice.value = formatCurrency(booking.price_total)
}

const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    })

    return formatter.format(value);
}

const filterActiveBookings = (bookings) => {
    return bookings.filter((booking) => booking.status == 1);
}

const filterInactiveBookings = (bookings) => {
    return bookings.filter((booking) => booking.status == 0);
}

const markAsCompleted = async (bookingId) => {
    try {
        await axios.put(`/api/v1/bookings/${bookingId}/complete`);
        location.reload()
        console.log('La reserva ha sido finalizada')

    } catch (error) {
        console.error('Error al marcar la reserva como completada:', error);
    }
}

onMounted(() => {
    getHostPanelProperties();
    getHostBookings();
})

</script>

<template>
    <main>
        <div class="container-fluid host-panel-container mt-5">

            <h1 class="host-welcome-heading d-flex">
                <div class="col-back-home me-3" @click="this.$router.go(-1)">
                    <a>
                        
                    </a>
                </div>
                Bienvenido, {{ authStore.user }}
            </h1>

            <div class="host-panel-body mx-auto mt-5">
                <div class="col-lg-12 pb-3">
                    <h2 class="host-bookings-panel pb-0">
                        Gestiona el estado de tus reservaciones
                    </h2>
                </div>

                <div class="container-fluid">
                    <div class="row">
                        <div class="col-lg-12 d-flex column-gap-3">
                            <button class="host-panel-filter btn mb-3 d-none">
                                En camino
                            </button>
                            <button class="host-panel-filter btn mb-3" @click="toggleBookings"
                                :class="{ 'selected-label': showReservas }">
                                En proceso
                            </button>
                            <button class="host-panel-filter btn mb-3 d-none">
                                En espera de salida
                            </button>
                            <button class="host-panel-filter btn mb-3" @click="toggleHistory"
                                :class="{ 'selected-label': showHistorial }">
                                Finalizadas
                            </button>
                        </div>
                    </div>
                    <div v-show="showReservas">
                        <div class="col-12 p-5 bg-light border d-flex justify-content-center align-items-center"
                            v-if="hostBookings.length === 0" style="height: 200px;">
                            <h3 class="text-muted fs-5 mb-0">
                                Aquí irán apareciendo las reservas de los huéspedes que reserven algún anuncio de tu
                                propiedad.
                            </h3>
                        </div>
                        <table class="table border-top" v-else>
                            <thead>
                                <tr>
                                    <th scope="col">Lugar</th>
                                    <th scope="col">Fecha de entrada</th>
                                    <th scope="col">Fecha de salida</th>
                                    <th scope="col">Por recibir</th>
                                    <th scope="col" style="text-align: center;">Acción</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr v-for="hostBooking in hostBookings" :key="hostBooking.id">
                                    <td>
                                        <div class="row">
                                            <div class="col-4">
                                                <img :src="'http://127.0.0.1:8000/storage/cover/' + hostBooking.property.cover"
                                                    alt="cover-airbnb" id="host-table-place-cover">
                                            </div>
                                            <div class="col-6 d-flex align-items-center">
                                                <h6 class="host-table-place-title">{{ hostBooking.property.name }}</h6>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{{ hostBooking.dateini }}</td>
                                    <td>{{ hostBooking.datefini }}</td>
                                    <td>{{ formatCurrency(hostBooking.price_total) }}</td>
                                    <td class="text-center">
                                        <button type="button" class="btn btn-just-icon btn-sm text-white fw-bold"
                                            id="action-buttons" data-bs-toggle="modal" data-bs-target="#detailHostModal"
                                            @click="getBooking(hostBooking)">
                                            <span class="material-symbols-sharp me-1">
                                                visibility
                                            </span>
                                            Detalles
                                        </button>
                                        <button type="button" class="btn btn-just-icon btn-sm mx-2 text-white fw-bold"
                                            id="action-buttons">
                                            <span class="material-symbols-sharp me-1"
                                                @click="markAsCompleted(hostBooking.id)">
                                                check
                                            </span>
                                            Finalizar
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div v-show="showHistorial">
                        <div class="col-12 p-5 bg-light border d-flex justify-content-center align-items-center"
                            v-if="hostFinishedBookings.length === 0" style="height: 200px;">
                            <h3 class="text-muted fs-5 mb-0">
                                Aquí irán apareciendo las reservas finalizadas.
                            </h3>
                        </div>
                        <table class="table border-top" v-else>
                            <thead>
                                <tr>
                                    <th scope="col">Lugar</th>
                                    <th scope="col">Fecha de entrada</th>
                                    <th scope="col">Fecha de salida</th>
                                    <th scope="col">Por recibir</th>
                                    <th scope="col" style="text-align: center;">Acción</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr v-for="hostBooking in hostFinishedBookings" :key="hostBooking.id">
                                    <td>
                                        <div class="row">
                                            <div class="col-4">
                                                <img :src="'http://127.0.0.1:8000/storage/cover/' + hostBooking.property.cover"
                                                    alt="cover-airbnb" id="host-table-place-cover">
                                            </div>
                                            <div class="col-6 d-flex align-items-center">
                                                <h6 class="host-table-place-title">{{ hostBooking.property.name }}</h6>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{{ hostBooking.dateini }}</td>
                                    <td>{{ hostBooking.datefini }}</td>
                                    <td>{{ formatCurrency(hostBooking.price_total) }}</td>
                                    <td class="text-center">
                                        <button type="button" class="btn btn-just-icon btn-sm text-white fw-bold"
                                            id="action-buttons" data-bs-toggle="modal" data-bs-target="#detailHostModal"
                                            @click="getBooking(hostBooking)">
                                            <span class="material-symbols-sharp me-1">
                                                visibility
                                            </span>
                                            Detalles
                                        </button>
                                        <button type="button"
                                            class="btn btn-just-icon btn-sm mx-2 text-white fw-bold disabled"
                                            id="action-buttons">
                                            <span class="material-symbols-sharp me-1"
                                                @click="markAsCompleted(hostBooking.id)">
                                                check
                                            </span>
                                            Finalizada
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="host-panel-body mx-auto mt-5">
                <div class="header-container d-flex align-items-center justify-content-between p-2">
                    <h2 class="host-recent-heading">
                        Anuncios recientes
                    </h2>
                    <button class="btn border-0 me-2">
                        <RouterLink class="nav-link" to="/anuncios">
                            <u>Ver todos mis anuncios</u>
                        </RouterLink>
                    </button>
                </div>
                <div class="row d-flex p-2">
                    <div class="col-12 p-5 bg-light border" v-if="hostPanelProperties.length === 0">
                        <h3 class="text-center text-muted fs-5 mb-0">
                            No tienes anuncios recientes.
                        </h3>
                    </div>
                    <div class="carousel-container" v-else>
                        <div class="carousel-wrapper">
                            <div class="carousel">
                                <div class="card-carousel" v-for="(panelProperty, index) in hostPanelProperties"
                                    :key="index">
                                    <div class="col-12 d-flex align-items-center">
                                        <figure class="col-6 recent-panel-place-img m-0">
                                            <img :src="'http://127.0.0.1:8000/storage/cover/' + panelProperty.cover"
                                                alt="cover-airbnb">
                                        </figure>
                                        <div class="col-6 d-flex flex-wrap align-items-center">
                                            <h6 class="mx-3">
                                                <strong>
                                                    {{ panelProperty.name }}
                                                </strong>
                                            </h6>
                                            <h6 class="text-muted mx-3">
                                                <small>
                                                    Publicado {{ translateCreatedAt(panelProperty.created_at) }}
                                                </small>
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>


    <div class="modal fade" id="detailHostModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        Detalle de reserva en {{ selectedBookingName }}
                    </h5>
                    <span class="material-symbols-sharp text-white" role="button" data-bs-dismiss="modal">
                        close
                    </span>
                </div>
                <div class="modal-body">
                    <div class="card col-lg-12 mt-3 mb-3 mx-auto">
                        <div class="card-body p-lg-4">
                            <div class="col-12 d-flex flex-wrap mt-3 column-gap-5">
                                <div class="col-6 text-center bg-light">
                                    <h6 class="booking-detail-label">
                                        Fecha de entrada
                                    </h6>
                                    <h6 class="booking-detail-contain">
                                        {{ selectedBooking.dateini }}
                                    </h6>
                                </div>
                                <div class="col text-center bg-light">
                                    <h6 class="booking-detail-label">
                                        Fecha de salida
                                    </h6>
                                    <h6 class="booking-detail-contain">
                                        {{ selectedBooking.datefini }}
                                    </h6>
                                </div>
                                <div class="col-6 text-center bg-light mt-3">
                                    <h6 class="booking-detail-label">
                                        Huésped
                                    </h6>
                                    <h6 class="booking-detail-contain">
                                        {{ selectedBookingGuestName }}
                                    </h6>
                                </div>
                                <div class="col text-center bg-light mt-3">
                                    <h6 class="booking-detail-label">
                                        Correo del huésped
                                    </h6>
                                    <h6 class="booking-detail-contain">
                                        {{ selectedBookingGuestEmail }}
                                    </h6>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card col-lg-12 mt-3 mb-3 mx-auto">
                        <div class="card-body p-lg-4">
                            <div class="col-12 d-flex flex-wrap mt-3 column-gap-5">
                                <div class="col text-center bg-light">
                                    <h6 class="booking-detail-label">
                                        Cargos
                                    </h6>
                                    <div class="bg-light bg-opacity-10 p-3">
                                        <div class="d-flex justify-content-between mb-1">
                                            <span>
                                                Precio por noche
                                            </span>
                                            <span class="booking-detail-contain">
                                                {{ selectedBookingPricePerNight }}
                                            </span>
                                        </div>
                                        <div class="d-flex justify-content-between mb-1">
                                            <span>
                                                Tarifa por servicios de limpieza
                                            </span>
                                            <span class="booking-detail-contain">
                                                {{ selectedBookingCleaningFee }}
                                            </span>
                                        </div>
                                        <div class="d-flex justify-content-between mb-1">
                                            <span>
                                                Precio por
                                                <span>
                                                    {{ selectedBooking.total_days }}
                                                </span>
                                                noches
                                            </span>
                                            <span class="booking-detail-contain">
                                                {{ selectedBookingPricePerStay }}
                                            </span>
                                        </div>
                                        <hr />
                                        <div class="d-flex justify-content-between">
                                            <span>
                                                Precio con impuestos incluidos
                                            </span>
                                            <strong class="text-dark">
                                                {{ selectedBookingTotalPrice }}
                                            </strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div class="card col-lg-12 mt-3 mb-3 mx-auto">
                        <div class="card-body p-lg-4">
                            <div class="col-12 d-flex flex-wrap mt-3 column-gap-5">
                                <div class="col text-center bg-light">
                                    <h6 class="booking-detail-label">
                                        Transacciones
                                    </h6>
                                    <div class="bg-light bg-opacity-10 p-3">
                                        <div class="d-flex justify-content-between mb-1">
                                            <span>
                                                Método de pago
                                            </span>
                                            <span class="booking-detail-contain">
                                                {{ selectedBooking.payment_method }}
                                            </span>
                                        </div>
                                        <hr />
                                        <div class="d-flex justify-content-between mb-1">
                                            <span>
                                                Monto recibido
                                            </span>
                                            <span class="booking-detail-contain">
                                                <strong>
                                                    {{ selectedBookingTotalPrice }}
                                                </strong>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer d-flex justify-content-center">
                    <button class="btn btn-cancel " data-bs-dismiss="modal">
                        Cerrar detalle
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import url('../../assets/css/host/panel.css');

@import url('../../assets/css/guest/bookings.css');

.selected-label {
    border: 2px solid var(--primary-color);
    text-shadow: 1px 1px 2px var(--acent-color);
}
</style>