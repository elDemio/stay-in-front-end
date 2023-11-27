<script setup>
import { RouterLink, useRoute } from 'vue-router';
import { ref } from 'vue';

import { useAuthStore } from '../../stores/auth';
const authStore = useAuthStore()

import {
    validateEmail,
    validatePassword,
    validateFormCompletion
} from '../../validations/login'

import {
    validateName,
    validateLastName,
    validateRegEmail,
    validateRegPassword,
    validateRegFormCompletion
} from '../../validations/register'

const routeUsing = useRoute()
const userLogin = ref(true);
const userRegister = ref(false);

const form = ref({
    email: '',
    password: ''
})

const formRegister = ref({
    name: '',
    lastname: '',
    email: '',
    password: ''
})

const user_register = () => {
    userLogin.value = false;
    userRegister.value = true;
};

const user_login = () => {
    userLogin.value = true;
    userRegister.value = false;
};

</script>

<template>
    <header id="header" class="sticky-top d-flex align-items-center">

        <div class="d-flex justify-content-between"
            :class="{ 'container': routeUsing.name === 'detalles', 'container-fluid': routeUsing.name !== 'detalles' }">
            <div class="img-top d-flex align-items-center">
                <RouterLink class="nav-link" to="/">
                    <img src="../../assets/img/brands/stay-in-imagotype.svg" width="116" alt="imagotype" />
                </RouterLink>
            </div>
            <nav class="navbar">
                <ul>
                    <li class="me-3" v-if="!authStore.user && routeUsing.name !== 'reservar'">
                        <RouterLink class="nav-link" to="#">
                            Explorar Stay in
                        </RouterLink>
                    </li>
                    <li class="me-3"
                        v-if="authStore.user && authStore.role === 'isGuest' && routeUsing.name !== 'reservar'">
                        <button class="nav-link" @click="authStore.changeRole()">
                            Hacerme anfitrión en Stay in
                        </button>
                    </li>
                    <li v-if="!authStore.user && routeUsing.name !== 'reservar'">
                        <RouterLink class="nav-link" to="#" data-bs-target="#loginModal" data-bs-toggle="modal">
                            <span class="material-symbols-sharp icons">
                                person
                            </span>
                            Acceder
                        </RouterLink>
                    </li>
                    <li class="icons-host"
                        v-if="authStore.user && authStore.role === 'isHost' && routeUsing.name !== 'reservar' && routeUsing.name !== 'anfitrion' && routeUsing.name !== 'anuncios'">
                        <RouterLink class="nav-link" to="/anfitrion">
                            <span class="material-symbols-sharp me-2">
                                shield_person
                            </span>
                            Panel de anfitrión
                        </RouterLink>
                    </li>
                    <li class="dropdown" v-if="authStore.user">
                        <a class="nav-link" href="#">
                            <img src="../../assets/img/visual/picture.svg" alt="user-pic" class="avatar-no-auth me-2">
                            {{ authStore.user }}
                        </a>
                        <ul>
                            <li>
                                <RouterLink class="nav-link" to="/perfil">
                                    Mi perfil
                                </RouterLink>
                            </li>
                            <hr class="separator">
                            <li>
                                <RouterLink class="nav-link" to="/viajes">
                                    Mis viajes
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink class="nav-link" to="#">
                                    Mis favoritos
                                </RouterLink>
                            </li>
                            <hr class="separator">
                            <li>
                                <RouterLink class="nav-link" to="#">
                                    Sobre el modo anfitrión
                                </RouterLink>
                            </li>
                            <li>
                                <button class="nav-link close-session d-flex align-items-center"
                                    @click="authStore.logout()">
                                    Cerrar sesión
                                </button>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </div>
    </header>

    <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                <div class="modal-body" id="login-modal-body">
                    <div class="col-lg-12 user__login" v-if="userLogin">
                        <div class="px-lg-5">
                            <div class="img-top text-center">
                                <img id="login-badge" src="../../assets/img/brands/stay-in-badge.svg" width="100"
                                    height="115" alt="login_badge">
                            </div>
                        </div>

                        <div class="card-body p-lg-4">
                            <h3 class="mb-4 text-center">
                                Bienvenido nuevamente
                            </h3>
                            <span class="auth-form-errors mb-4" id="formError"></span>
                            <form>
                                <div class="form-floating mb-3">
                                    <input class="form-control" id="floatingEmail" type="email"
                                        placeholder="name@example.com" v-model="form.email" required @input="validateEmail">
                                    <span class="auth-errors" id="emailError"></span>
                                    <label for="floatingEmail">
                                        Correo electrónico
                                    </label>
                                </div>
                                <div class="form-floating mb-3">
                                    <input class="form-control" id="floatingPassword" type="password"
                                        placeholder="Contraseña" v-model="form.password" required @input="validatePassword">
                                    <span class="auth-errors" id="passwordError"></span>
                                    <label for="floatingPassword">
                                        Contraseña
                                    </label>
                                </div>
                                <button @click.prevent="validateFormCompletion(authStore.login(form))"
                                    class="btn btn-dark p-3 w-100 button-contenue">
                                    Continuar
                                </button>
                            </form>
                        </div>

                        <div class="card-footer px-lg-3 py-lg-3">
                            <div class="text-sm text-muted">
                                ¿Eres nuevo en Stay In?
                                <a @click="user_register()">
                                    <strong>Regístrate aquí</strong>
                                </a>.
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-12 user__register" v-if="userRegister">
                        <div class="px-lg-5">
                            <div class="img-top text-center">
                                <img id="register-badge" src="../../assets/img/brands/stay-in-badge.svg" width="100"
                                    alt="register_badge">
                            </div>
                        </div>

                        <div class="card-body p-lg-4">
                            <h3 class="mb-4 text-center">
                                Completa tu registro
                            </h3>
                            <span class="auth-form-errors mb-4" id="formRegError"></span>
                            <form>
                                <div class="col-lg-12 d-flex">
                                    <div class="form-floating me-2 mb-3">
                                        <input class="form-control" id="firstName" type="text" placeholder="Nombre"
                                            v-model="formRegister.name" required @input="validateName">
                                        <span class="auth-errors" id="nameError"></span>
                                        <label for="firstName">
                                            Nombre
                                        </label>
                                    </div>
                                    <div class="form-floating">
                                        <input class="form-control" id="lastName" type="text" placeholder="Apellido"
                                            v-model="formRegister.lastname" required @input="validateLastName">
                                        <span class="auth-errors" id="lastNameError"></span>
                                        <label for="lastName">
                                            Apellido
                                        </label>
                                    </div>
                                </div>
                                <div class="form-floating mb-3">
                                    <input class="form-control" id="email" type="email" placeholder="name@example.com"
                                        v-model="formRegister.email" required @input="validateRegEmail">
                                    <span class="auth-errors" id="emailRegError"></span>
                                    <label for="email">
                                        Correo electrónico
                                    </label>
                                </div>
                                <div class="form-floating mb-3">
                                    <input class="form-control" id="password" type="password" placeholder="Contraseña"
                                        v-model="formRegister.password" required @input="validateRegPassword">
                                    <span class="auth-errors" id="passwordRegError"></span>
                                    <label for="password">
                                        Contraseña
                                    </label>
                                </div>
                                <div class="form-check mb-3">
                                    <input class="form-check-input" type="checkbox" name="agree" id="agree">
                                    <label class="form-check-label" for="agree">Estoy de acuerdo con los <a
                                            class="text-reset" href="#">Términos y condiciones</a>.</label>
                                </div>
                                <div class="form-group">
                                    <button @click.prevent="validateRegFormCompletion(authStore.register(formRegister))"
                                        class="btn btn-dark p-3 w-100 button-contenue" id="register">
                                        Continuar
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div class="card-footer px-lg-3 py-lg-3">
                            <div class="text-sm text-muted">
                                ¿Ya formas parte de nuestra comunidad?
                                <a @click="user_login()">
                                    <strong>Inicia sesión</strong>
                                </a>.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import url('../../assets/css/header.css');
</style>