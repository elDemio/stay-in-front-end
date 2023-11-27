<script setup>
import { ref, computed, watch, onMounted } from 'vue'

import { useAuthStore } from '../stores/auth';
const authStore = useAuthStore()
axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.authToken;

import { useRoute } from 'vue-router'
const requireId = useRoute()
const getId = requireId.params.id

import {
    startDate,
    endDate,
    showCalendar,
    currentYear,
    currentMonth,
    months,
    daysInMonth,
    selectedDate,
    selectedInput,
    toggleCalendar,
    prevYear,
    nextYear,
    prevMonth,
    nextMonth,
    selectDate,
    formatDate,
} from '../assets/v-functions/booking-calendar'

const selectedPropertyId = ref(getId)
const datesReserved = ref([])
const pricePerNight = ref(0)
const numberOfNights = ref(0)
const totalBeforeTax = ref(0)
const cleaningFee = ref(0)
const totalPrice = ref(0)
const paymentMethods = ref([])
const selectedPayMod = ref('')

const bookingData = ref({
    id: null,
    name: "",
    location: "",
    coverImage: "",
    category: "",
    host: "",
    email: ""
})

onMounted(async () => {
    try {
        const payResponse = await axios.get('/api/v1/paymentmethods');
        console.log('Respuesta de la API:', payResponse.data);
        paymentMethods.value = payResponse.data.data;

    } catch (error) {
        console.error('Error al obtener la fecha desde la API:', error);
        console.error('Error de solicitud:', error.message);
    }
})

axios.get(`/api/v1/home/${getId}`).then(response => {
    const data = response.data.data
    bookingData.value.id = data.id
    bookingData.value.name = data.name
    bookingData.value.location = `${data.city.city}, ${data.state.state}`
    bookingData.value.coverImage = data.cover
    bookingData.value.category = data.subcategory.title
    bookingData.value.host = data.author.user
    bookingData.value.email = data.author.email
    pricePerNight.value = parseFloat(data.price)
})

const loadReservedDates = async () => {
    try {
        const reservedResponse = await axios.get(`/api/v1/bookings/property/${selectedPropertyId.value}/dates`);
        datesReserved.value = reservedResponse.data.flatMap(booking => {
            const bookingStartDate = new Date(booking.dateini);
            const bookingEndDate = new Date(booking.datefini);

            const dateRange = [];
            let currentDate = new Date(bookingStartDate);

            while (currentDate <= bookingEndDate) {
                dateRange.push(currentDate.toISOString().split('T')[0]);
                currentDate.setDate(currentDate.getDate() + 1);
            }

            return dateRange;
        });
    } catch (error) {
        console.error('Error al obtener fechas reservadas:', error);
    }
}

const isDayReserved = (day) => datesReserved.value.includes(day)

const recalculatePrices = () => {
    console.log('startDate:', startDate.value);
    console.log('endDate:', endDate.value);

    if (startDate.value && endDate.value) {
        const start = new Date(startDate.value);
        const end = new Date(endDate.value);

        console.log('start:', start);
        console.log('end:', end);

        const timeDiff = end - start;

        console.log('timeDiff:', timeDiff);

        numberOfNights.value = Math.ceil(timeDiff / (1000 * 3600 * 24));
        totalBeforeTax.value = Number(pricePerNight.value) * numberOfNights.value;
        cleaningFee.value = totalBeforeTax.value * 0.15;
        totalPrice.value = totalBeforeTax.value + cleaningFee.value;

        console.log('numberOfNights:', numberOfNights.value);
        console.log('totalBeforeTax:', totalBeforeTax.value);
        console.log('cleaningFee:', cleaningFee.value);
        console.log('totalPrice:', totalPrice.value);
    } else {
        numberOfNights.value = 0;
        totalBeforeTax.value = 0;
        cleaningFee.value = 0;
        totalPrice.value = 0;
    }
}

const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    return formatter.format(value);
}

const closeWindow = () => {
    window.history.back()
}

const formattedPricePerNight = computed(() => formatCurrency(pricePerNight.value))
const formattedCleaningFee = computed(() => formatCurrency(cleaningFee.value))
const formattedTotalBeforeTax = computed(() => formatCurrency(totalBeforeTax.value))
const formattedTotalPrice = computed(() => formatCurrency(totalPrice.value))

watch([startDate, endDate], () => {
    recalculatePrices();
})

function simulateTransfer() {
    var button = document.querySelector('button');
    var loader = document.getElementById('loader');
    var check = document.getElementById('check');
    var transferText = document.getElementById('transferText');

    transferText.style.display = 'none';
    button.disabled = true;
    loader.style.display = 'inline-block';

    setTimeout(function () {
        loader.style.display = 'none';
        check.style.display = 'inline';
        button.disabled = false;
    }, 6000);
}

function submitReservation() {
    const apiUrl = '/api/v1/bookings';

    const formData = new FormData();

    formData.append('dateini', startDate.value);
    formData.append('datefini', endDate.value);
    formData.append('price_per_day', pricePerNight.value);
    formData.append('price_for_stay', totalBeforeTax.value);
    formData.append('total_days', numberOfNights.value);
    formData.append('cleaning_fee', cleaningFee.value);
    formData.append('price_total', totalPrice.value);
    formData.append('property_id', selectedPropertyId.value);
    formData.append('payment_method_id', selectedPayMod.value);

    axios.post(apiUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data', }
    })
        .then(response => {
            console.log('Solicitud POST exitosa:', response.data.data);
            window.location.href = '/viajes'
        })
        .catch(error => {
            console.error('Error al realizar la solicitud POST:', error);
        });
}

onMounted(loadReservedDates)
</script>

<template>
    <main class="p-3">
        <div class="container mt-3" id="custom-container">
            <div class="col-lg-12 mb-3">
                <h1 class="stay-booking-title mb-0">
                    <strong>
                        Consultar disponibilidad y reservar
                    </strong>
                </h1>
            </div>
            <div class="row">
                <div class="col-lg-7">
                    <div class="card stay-booking-check">
                        <div class="row mt-2">
                            <p class="stay-booking-item">
                                <strong>
                                    Tu estadía
                                </strong>
                            </p>
                        </div>
                        <div class="row mt-2" id="stay-booking-contain">
                            <div class="row mb-2">
                                <input class="booking-dates form-control mx-2 fw-bold" v-model="startDate"
                                    @click="toggleCalendar('startDate')" placeholder="Fecha de entrada" required
                                    autofocus />
                                <input class="booking-dates form-control fw-bold" v-model="endDate"
                                    @click="toggleCalendar('endDate')" placeholder="Fecha de salida" :disabled="!startDate"
                                    required autofocus />

                                <div v-if="showCalendar" class="calendar">
                                    <div class="header">
                                        <button class="booking-prev-year" @click="prevYear">
                                            &lt;&lt;
                                        </button>
                                        <button class="booking-prev-month" @click="prevMonth">
                                            &lt;
                                        </button>
                                        {{ currentYear }} - {{ months[currentMonth] }}
                                        <button class="booking-next-month" @click="nextMonth">
                                            &gt;
                                        </button>
                                        <button class="booking-next-year" @click="nextYear">
                                            &gt;&gt;
                                        </button>
                                    </div>
                                    <div class="days">
                                        <div class="day" v-for="day in daysInMonth" :key="day">
                                            <button class="booking-day" @click="selectDate(day)" :class="{
                                                selected: day === selectedDate, reserved: isDayReserved(formatDate(new Date(currentYear, currentMonth, day))),
                                                disabled: (selectedInput === 'startDate' && day < selectedDate) ||
                                                    (selectedInput === 'startDate' && startDate &&
                                                        new Date(currentYear, currentMonth, day) < new Date(startDate)) ||
                                                    (selectedInput === 'endDate' && startDate &&
                                                        new Date(currentYear, currentMonth, day) <= new Date(startDate))
                                            }">
                                                {{ day }}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div class="row mt-2">
                            <p class="stay-booking-item">
                                <strong>
                                    Elige el método de pago que se ajuste a tu gusto
                                </strong>
                            </p>
                        </div>

                        <div class="col-12 p-5 bg-light border d-flex justify-content-center align-items-center"
                            v-if="!authStore.user" style="height: 200px;">
                            <h3 class="text-muted fs-5 mb-0">
                                Debes estar registrado para ver los métodos de pago existentes.
                            </h3>
                        </div>

                        <div class="card col-12 mt-3 mb-3 mx-auto" v-if="authStore.user">
                            <div class="card-body ">
                                <ul>
                                    <li v-for="( item, index ) in  paymentMethods " :key="'item' + index">
                                        <input class="add-place-hidden-radios" type="radio" :id="'myRadioItem' + index"
                                            :name="'category'" v-model="selectedPayMod" :value="item.id" />
                                        <label class="add-place-checkboxes shadow-sm" :for="'myRadioItem' + index">
                                            <div class="col-12 d-flex align-items-center">
                                                <img :src="'http://127.0.0.1:8000/storage/payments/' + item.payment_icon"
                                                    width="26" alt="">
                                                <h5 class="add-place-icon-title mx-1">
                                                    {{ item.name }}
                                                </h5>
                                            </div>
                                        </label>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div class="card p-4" v-if="selectedPayMod === 1">
                            <div class="col-12 d-flex mt-2 mb-4">
                                <div class="col-6 d-flex align-items-center">
                                    <p class="paymode-card-title m-0">
                                        Puedes usar:
                                        <strong>
                                            Crédito o Débito
                                        </strong>
                                    </p>
                                </div>
                                <div class="col-6 d-flex justify-content-end align-items-center">
                                    <img class="me-3" src="../assets/img/visual/visa.png" alt="" width="45">
                                    <img class="me-3" src="../assets/img/visual/mastercard.png" alt="" width="45">
                                    <img src="../assets/img/visual/amex.png" alt="" width="45">
                                </div>
                            </div>
                            <div class="form-floating mb-3">
                                <input class="form-control" id="floatingInput" type="text" placeholder="" required>
                                <label for="floatingInput">
                                    Número de tarjeta
                                </label>
                            </div>
                            <div class="col-12 column-gap-3 d-flex mx-auto">
                                <div class="form-floating mt-4 mb-4 payment-mode-cards">
                                    <select class="form-select" id="floatingSelect"
                                        aria-label="Floating label select example" required>
                                        <option selected class="options">
                                            Elegir
                                        </option>
                                    </select>
                                    <label for="floatingSelect">
                                        Mes de expiración
                                    </label>
                                </div>
                                <div class="payment-mode-cards form-floating mt-4 mb-4">
                                    <select class="form-select" id="floatingSelect"
                                        aria-label="Floating label select example" required>
                                        <option selected class="options">
                                            Elegir
                                        </option>
                                    </select>
                                    <label for="floatingSelect">
                                        Fecha de expiración
                                    </label>
                                </div>
                                <div class="form-floating mt-4">
                                    <input class="form-control" id="floatingInput" type="text" placeholder="" required>
                                    <label for="floatingInput">
                                        Código de seguridad
                                    </label>
                                </div>
                            </div>
                            <div class="form-floating mt-3">
                                <input class="form-control" id="floatingInput" type="text" placeholder="" required>
                                <label for="floatingInput">
                                    Nombre del titular
                                </label>
                            </div>
                        </div>

                        <div class="" v-if="selectedPayMod === 2">
                            <button class="btn btn-bitcoin" data-bs-target="#bitcoinModal" data-bs-toggle="modal">
                                Transferir a dirección
                            </button>
                        </div>

                        <div class="card p-4" v-if="selectedPayMod === 3">
                            <div class="col-12 d-flex mt-2 mb-4 text-center">
                                <div class="col-12">
                                    <p class="m-0 h3 mb-2">
                                        Transferir
                                    </p>
                                    <strong class="h2 fw-bold">
                                        {{ formattedTotalPrice }}
                                    </strong>
                                </div>
                            </div>
                            <div class="col-12 mb-3">
                                <label class="mb-2" for="">
                                    <span class="transfer-label">
                                        Banco
                                    </span>
                                </label>
                                <input class="form-control" type="text" readonly value="BANCO CREDOMATIC">
                            </div>
                            <div class="col-12 mb-3">
                                <label class="mb-2" for="">
                                    <span class="transfer-label">
                                        Nombre del receptor
                                    </span>
                                </label>
                                <input class="form-control" type="text" readonly :value="bookingData.host">
                            </div>
                            <div class="col-12">
                                <label class="mb-2" for="">
                                    <span class="transfer-label">
                                        Código de cuenta
                                    </span>
                                </label>
                                <input class="form-control" type="text" readonly value="B1A45HT">
                            </div>
                        </div>
                        <hr />
                        <div class="row">
                            <p class="stay-booking-item">
                                <strong>
                                    Política de cancelación
                                </strong>
                            </p>
                        </div>
                        <div class="row mt-2" id="stay-booking-contain">
                            <div class="amenities-icon d-flex align-items-center p-0">
                                <span class="material-symbols-sharp">
                                    check_circle
                                </span>
                                <p class="stay-booking-policy">
                                    Lorem Ipsum
                                </p>
                            </div>
                        </div>
                        <hr />
                        <button class="btn w-100 mt-2 confirm-button" data-bs-target="#redirectModal" data-bs-toggle="modal"
                            v-if="!authStore.user">
                            Confirmar reserva
                        </button>
                        <button class="btn w-100 mt-2 confirm-button" @click="submitReservation" v-if="authStore.user">
                            Confirmar reserva
                        </button>
                        <button class="btn w-100 mt-2 cancel-button" @click="this.$router.go(-1)">
                            Cancelar
                        </button>
                    </div>
                </div>
                <div class="col-lg-5">
                    <div class="card sticky-top stay-booking-descripion">
                        <div class="row d-flex align-items-center">
                            <div class="col-lg-12">
                                <img class="card-img border stay-booking-cover"
                                    :src="'http://127.0.0.1:8000/storage/cover/' + bookingData.coverImage" height="250px"
                                    :alt="bookingData.coverImage" />
                            </div>
                            <div class="card-body pb-0 mb-0">
                                <p class="stay-booking-titles mb-2">
                                <h4>
                                    {{ bookingData.name }}
                                </h4>
                                </p>
                                <div class="col-lg-12 d-flex justify-content-between">
                                    <span>
                                        <strong>
                                            Anfitrión:
                                        </strong>
                                        <p class="stay-booking-titles text-start">
                                            {{ bookingData.host }}
                                        </p>
                                    </span>
                                    <span>
                                        <strong>
                                            Ubicación:
                                        </strong>
                                        <p class="stay-booking-titles">
                                            {{ bookingData.location }}
                                        </p>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="bg-light bg-opacity-10" v-if="totalPrice">
                            <hr />
                            <p class="card-title mb-3">
                                <strong>
                                    Resumen
                                </strong>
                            </p>
                            <div class="d-flex justify-content-between mb-1">
                                <span>
                                    Precio por noche
                                </span>
                                <span>
                                    {{ formattedPricePerNight }}
                                </span>
                            </div>
                            <div class="d-flex justify-content-between mb-1">
                                <span>
                                    Tarifa por servicios de limpieza
                                </span>
                                <span>
                                    {{ formattedCleaningFee }}
                                </span>
                            </div>
                            <div class="d-flex justify-content-between mb-1">
                                <span>
                                    Precio por
                                    <span>
                                        {{ numberOfNights }}
                                    </span>
                                    noches
                                </span>
                                <span>
                                    {{ formattedTotalBeforeTax }}
                                </span>
                            </div>
                            <hr />
                            <div class="d-flex justify-content-between" v-if="totalPrice">
                                <span>
                                    Precio con impuestos incluidos
                                </span>
                                <strong class="text-dark">
                                    {{ formattedTotalPrice }}
                                </strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <div class="modal fade" id="redirectModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="col-lg-12">
                        <div class="px-lg-5">
                            <div class="img-top text-center">
                                <img src="../assets/img/brands/stay-in-badge.svg" width="100" alt="login_badge">
                            </div>
                        </div>

                        <div class="card-body p-lg-3">
                            <h5 class="mb-2 text-center">
                                <strong>
                                    El equipo de Stay In
                                </strong>
                            </h5>
                        </div>

                        <div class="card-body p-lg-3">
                            <p class="mb-4 text-center">
                                Para poder reservar, debes iniciar sesión o registrarte, por
                                políticas de seguridad ésta página será redirigida.
                            </p>
                        </div>

                        <div class="form-group">
                            <button class="btn btn-dark p-3 w-100 text-white button-accept" type="button"
                                @click="closeWindow" data-bs-dismiss="modal">
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="bitcoinModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="col-lg-12">
                        <div class="card-body p-lg-3">
                            <h5 class="mb-2 text-center">
                                <strong>
                                    Pagar con Bitcoin
                                </strong>
                            </h5>
                        </div>
                        <div class="img-top text-center qr-code">
                            <img src="../assets/img/visual/qr.svg" width="100" alt="login_badge">
                        </div>
                        <div class="col-12 d-flex mt-2 mb-4 text-center">
                            <div class="col-12">
                                <p class="m-0 h3 mb-2">
                                    Transferir
                                </p>
                                <strong class="h2 fw-bold">
                                    {{ formattedTotalPrice }}
                                </strong>
                                <p class="m-0 h3 mb-2">
                                    a
                                </p>
                                <p class="m-0 h3 mb-2">
                                    {{ bookingData.host }}
                                </p>
                            </div>
                        </div>
                        <div class="card-body p-lg-3">
                            <p class="mb-4 text-center">
                                El monto será convertido a Bitcoin una vez se haya realizado la transacción.
                            </p>
                        </div>
                        <div class="form-group">
                            <button class="btn btn-dark p-3 w-100 text-white button-accept" @click="simulateTransfer">
                                <span id="loader" class="loader"></span>
                                <span id="transferText">
                                    Transferir
                                </span>
                                <span id="check">
                                    Transferencia realizada con éxito
                                </span>
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import url('../assets/css/booking.css');
</style>