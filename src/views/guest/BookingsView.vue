<script setup>
import { ref, onMounted } from 'vue'

import { useAuthStore } from '../../stores/auth';
const authStore = useAuthStore()
axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.authToken;

import {
    is_expanded,
    ToggleMenu,
    showReservas,
    showHistorial,
    toggleBookings,
    toggleHistory
} from '../../assets/v-functions/bookings';

const activeBookings = ref([]);
const inactiveBookings = ref([]);
const selectedBooking = ref([])
const selectedBookingName = ref([])
const selectedBookingHostName = ref([])
const selectedBookingHostEmail = ref([])
const selectedBookingPricePerNight = ref([])
const selectedBookingPricePerStay = ref([])
const selectedBookingCleaningFee = ref([])
const selectedBookingTotalPrice = ref([])

const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    return formatter.format(value);
};

const getBooking = (booking) => {
    selectedBooking.value = { ...booking }
    selectedBookingName.value = booking.property.name
    selectedBookingHostName.value = booking.property.host_name
    selectedBookingHostEmail.value = booking.property.host_email
    selectedBookingPricePerNight.value = formatCurrency(booking.price_per_day)
    selectedBookingCleaningFee.value = formatCurrency(booking.cleaning_fee)
    selectedBookingPricePerStay.value = formatCurrency(booking.price_for_stay)
    selectedBookingTotalPrice.value = formatCurrency(booking.price_total)
}

const filterActiveBookings = (bookings) => {
    return bookings.filter((booking) => booking.status == 1);
};

const filterInactiveBookings = (bookings) => {
    return bookings.filter((booking) => booking.status == 0);
};

onMounted(async () => {
    try {
        const bookResponse = await axios.get('/api/v1/bookingsuser');
        const data = bookResponse.data.data;
        activeBookings.value = filterActiveBookings(data)
        inactiveBookings.value = filterInactiveBookings(data)

    } catch (error) {
        console.error('Error al obtener la fecha desde la API:', error);
        console.error('Error de solicitud:', error.message);
    }
})
</script>

<template>
    <main class="container d-flex">
        <aside class="col-3 sticky-top" :class="`${is_expanded ? 'is-expanded' : ''}`">
            <div class="menu-toggle-wrap">
                <button class="menu-toggle btn" @click="ToggleMenu">
                    <span class="material-symbols-sharp material-icons">
                        keyboard_double_arrow_right
                    </span>
                </button>
            </div>

            <h3>
                Información sobre:
            </h3>
            <div class="menu">
                <button class="button" @click="toggleBookings" :class="{ 'button-exact-active': showReservas }">
                    <span class="material-symbols-sharp material-icons">
                        schedule
                    </span>
                    <span class="text">
                        Reservas
                    </span>
                </button>
            </div>
            <div class="menu">
                <button class="button" @click="toggleHistory" :class="{ 'button-exact-active': showHistorial }">
                    <span class="material-symbols-sharp material-icons">
                        history
                    </span>
                    <span class="text">
                        Historial
                    </span>
                </button>
            </div>
            <div class="flex"></div>
        </aside>

        <section class="col-9 mx-2">
            <div class="bookings-container" v-show="showReservas">
                <div class="card col-lg-12 mx-auto mb-3" v-for="guestBooking in activeBookings" :key="guestBooking.id">
                    <div class="card-body d-flex">
                        <div class="col-5 p-3 m-0">
                            <img class="booking-image-cover"
                                :src="'http://127.0.0.1:8000/storage/cover/' + guestBooking.property.cover" alt="">
                        </div>
                        <div class="col-7 p-3 m-0">
                            <div class="col-12">
                                <h2 class="booking-place-title">
                                    {{ guestBooking.property.name }}
                                </h2>
                                <div class="col-12 d-flex mt-3 column-gap-5">
                                    <h6 class="booking-date-range">
                                        Fecha de entrada
                                    </h6>
                                    <h6 class="booking-date-range" style="margin-left: 4.4rem;">
                                        Fecha de salida
                                    </h6>
                                </div>
                                <div class="col-12 d-flex mt-1 column-gap-3">
                                    <input class="form-control" type="text" :value="guestBooking.dateini" readonly>
                                    <input class="form-control" type="text" :value="guestBooking.datefini" readonly>
                                </div>
                            </div>

                            <div class="col-12 d-flex justify-content-between mt-5">
                                <div class="col d-flex align-items-center">
                                    <span class="material-symbols-sharp">
                                        hourglass_top
                                    </span>
                                    <span class="mx-1">
                                        En curso
                                    </span>
                                </div>

                                <button class="btn booking-actions" data-bs-toggle="modal" data-bs-target="#detailModal"
                                    @click="getBooking(guestBooking)">
                                    <span class="material-symbols-sharp">
                                        visibility
                                    </span>
                                    <span class="mx-1 me-3">
                                        Detalles
                                    </span>
                                </button>
                                <button class="btn booking-actions mx-2">
                                    <span class="material-symbols-sharp">
                                        cancel
                                    </span>
                                    <span class="mx-1">
                                        Cancelar
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 p-5 bg-light border d-flex align-items-center justify-content-center"
                    v-if="activeBookings.length === 0" style="height: 300px;">
                    <h3 class="text-center text-muted fs-5 mb-0">
                        No tienes reservas en proceso, explora y reserva.
                    </h3>
                </div>
            </div>

            <div class="history-container" v-show="showHistorial">
                <div class="card col-lg-12 mx-auto" v-for="guestBooking in inactiveBookings" :key="guestBooking.id">
                    <div class="card-body d-flex">
                        <div class="col-5 p-3 m-0">
                            <img class="booking-image-cover"
                                :src="'http://127.0.0.1:8000/storage/cover/' + guestBooking.property.cover" alt="">
                        </div>
                        <div class="col-7 p-3 m-0">
                            <div class="col-12">
                                <h2 class="booking-place-title">
                                    {{ guestBooking.property.name }}
                                </h2>
                                <div class="col-12 d-flex mt-3 column-gap-5">
                                    <h6 class="booking-date-range">
                                        Fecha de entrada
                                    </h6>
                                    <h6 class="booking-date-range" style="margin-left: 4.4rem;">
                                        Fecha de salida
                                    </h6>
                                </div>
                                <div class="col-12 d-flex mt-1 column-gap-3">
                                    <input class="form-control" type="text" :value="guestBooking.dateini"
                                        aria-label="readonly input example" readonly>
                                    <input class="form-control" type="text" :value="guestBooking.datefini"
                                        aria-label="readonly input example" readonly>
                                </div>
                            </div>

                            <div class="col-12 d-flex justify-content-between mt-5">
                                <div class="col d-flex align-items-center">
                                    <span class="material-symbols-sharp">
                                        hourglass_bottom
                                    </span>
                                    <span class="mx-1">
                                        Finalizada
                                    </span>
                                </div>

                                <button class="btn booking-actions" data-bs-toggle="modal" data-bs-target="#detailModal"
                                    @click="getBooking(guestBooking)">
                                    <span class="material-symbols-sharp">
                                        visibility
                                    </span>
                                    <span class="mx-1 me-3">
                                        Detalles
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 p-5 bg-light border d-flex align-items-center" v-if="inactiveBookings.length === 0"
                    style="height: 300px;">
                    <h3 class="text-center text-muted fs-5 mb-0">
                        Aquí irán apareciendo las reservas que han finalizado para que tengas un control de tus
                        transacciones.
                    </h3>
                </div>
            </div>
        </section>
    </main>

    <div class="modal fade" id="detailModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                        Anfitrion
                                    </h6>
                                    <h6 class="booking-detail-contain">
                                        {{ selectedBookingHostName }}
                                    </h6>
                                </div>
                                <div class="col text-center bg-light mt-3">
                                    <h6 class="booking-detail-label">
                                        Correo del anfitrión
                                    </h6>
                                    <h6 class="booking-detail-contain">
                                        {{ selectedBookingHostEmail }}
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
                                        Transacciones realizadas
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
                                                Monto extendido
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
@import url('../../assets/css/guest/bookings.css');
</style>