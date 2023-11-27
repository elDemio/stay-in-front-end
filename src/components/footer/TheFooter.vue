<script setup>
import { useRoute } from 'vue-router'
const routeFoot = useRoute();
</script>

<template>
    <footer class="text-center text-lg-start bg-white text-muted">
        <section class="footer-contain" v-show="routeFoot.name !== 'reservar'">
            <div class="container text-center text-md-start mt-5"
                :class="{ 'custom-container': routeFoot.name === 'detalles' }">
                <div class="row mt-3">
                    <div class="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                        <h6 class="text-uppercase fw-bold mb-4 d-flex align-items-center">
                            <span class="material-symbols-sharp icons">
                                info
                            </span>
                            Sobre Stay In
                        </h6>
                        <p>
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusantium quae veniam quo totam
                            dolore sint exercitationem voluptatem, aspernatur mollitia, illo neque laudantium quidem,
                            doloribus explicabo iste harum. Nulla, vero ratione!
                        </p>
                    </div>

                    <div class="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                        <h6 class="text-uppercase fw-bold mb-4">
                            Comunidad
                        </h6>
                        <p>
                            <a href="#!" class="text-reset">Lorem Ipsum</a>
                        </p>
                        <p>
                            <a href="#!" class="text-reset">Lorem Ipsum</a>
                        </p>
                        <p>
                            <a href="#!" class="text-reset">Lorem Ipsum</a>
                        </p>
                        <p>
                            <a href="#!" class="text-reset">Lorem Ipsum</a>
                        </p>
                    </div>

                    <div class="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                        <h6 class="text-uppercase fw-bold mb-4">
                            Soporte
                        </h6>
                        <p>
                            <a href="#!" class="text-reset">Lorem Ipsum</a>
                        </p>
                        <p>
                            <a href="#!" class="text-reset">Lorem Ipsum</a>
                        </p>
                        <p>
                            <a href="#!" class="text-reset">Lorem Ipsum</a>
                        </p>
                        <p>
                            <a href="#!" class="text-reset">Lorem Ipsum</a>
                        </p>
                    </div>

                    <div class="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                        <h6 class="text-uppercase fw-bold mb-4">Encuentranos</h6>
                        <p class="d-flex">
                            <span class="material-symbols-sharp icons">
                                home
                            </span> San Miguel, SM 00321, El Salvador
                        </p>
                        <p class="d-flex">
                            <span class="material-symbols-sharp icons">
                                mail
                            </span>
                            tellme@stayin.corp
                        </p>
                        <p class="d-flex">
                            <span class="material-symbols-sharp icons">
                                call
                            </span> + 503 2612 - 1325
                        </p>
                        <p class="d-flex">
                            <span class="material-symbols-sharp icons">
                                print
                            </span> + 503 2612 - 1328
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <div class="col d-flex" :class="{ 'custom-container-social': routeFoot.name === 'detalles' }">
            <div class="col-lg-6 d-flex align-items-center p-4">
                © 2022
                <RouterLink class="text-reset mx-3 me-3" to="/"><strong>Stay In Corp.</strong></RouterLink>
                <RouterLink class="text-reset me-3" to="#">Políticas de privacidad</RouterLink>
                <RouterLink class="text-reset me-3" to="#">Términos y condiciones</RouterLink>
            </div>
            <div class="col-lg-6 d-flex justify-content-end align-items-center p-4">
                <RouterLink class="text-reset mx-3 me-2 social-media-link" to="/">
                    <img class="social-media-icon" src="../../assets/img/brands/facebook.png" alt="">
                </RouterLink>
                <RouterLink class="text-reset mx-3 me-2 social-media-link" to="/">
                    <img class="social-media-icon" src="../../assets/img/brands/instagram.png" alt="">
                </RouterLink>
                <RouterLink class="text-reset mx-3 me-2 social-media-link" to="/">
                    <img class="social-media-icon" src="../../assets/img/brands/twitter.png" alt="">
                </RouterLink>
                <RouterLink class="text-reset mx-3 me-2 social-media-link" to="/">
                    <img class="social-media-icon" src="../../assets/img/brands/tiktok.png" alt="">
                </RouterLink>
            </div>
        </div>
    </footer>
</template>

<style scoped>
.custom-container {
    padding: 0 2.4% 0 2.4%;
}

.custom-container-social {
    padding: 0 18% 0 18%;
}

.text-reset {
    text-decoration: none;
}

.text-reset:hover {
    text-decoration: underline;
    color: var(--secondary-color) !important;
}

.icons {
    padding-right: 10px;
    font-weight: 500;
}

.footer-contain {
    padding-top: 1rem;
    background-color: #f7f7f7;
}

.social-media-icon {
    width: 25px;
    height: 25px;
}

.social-media-link {
    transition: 0.5s;
    border-radius: 6px;
}

.social-media-link:hover {
    box-shadow: 0px 12px 30px var(--primary-color);
}

#second-custom-container {
    padding: 0 2.6% 0 2.6%;
    background-color: #f7f7f7;
}
</style>