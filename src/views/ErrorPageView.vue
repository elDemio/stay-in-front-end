<template>
    <main>
        <div class="container mx-auto">
            <div class="row d-flex">
                <div class="img d-flex justify-content-center">
                    <img class="error-image" src="../assets/img/brands/stay-in-badge.svg" alt="forbiden_route">
                </div>
                <div class="col-lg-12 d-flex mx-auto justify-content-center">
                    <h1 class="giant-title">
                        401
                    </h1>
                </div>
                <div class="col-lg-12 d-flex justify-content-center">
                    <p class="text-muted error-description">
                        Al parecer intentas acceder a un sitio no autorizado, te recomendamos contactar a nuestro equipo de
                        soporte si tienes problemas con acceder.
                    </p>
                </div>
                <RouterLink class="nav-link d-flex" to="/">
                    <button class="back-button btn">
                        Regresar
                    </button>
                </RouterLink>
            </div>
        </div>
        <div class="col-lg-12 d-flex justify-content-between images-contain">
            <img class="error-image-1" src="../assets/img/visual/not_found.svg" alt="not_found_image">
            <img class="error-image-2" src="../assets/img/visual/best_place.svg" alt="not_found_image">
        </div>
    </main>
</template>
  
<style scoped>
.error-image {
    width: 160px;
    height: auto;
    object-fit: fill;
}

.giant-title {
    font-size: 180px;
    font-weight: 700;
    text-shadow: 3px 1px 5px rgb(194, 186, 186);
}

.error-description {
    width: 40%;
    font-size: 24px;
    text-align: center;
    font-weight: lighter;
}

.back-button {
    background-color: var(--secondary-color);
    width: 120px;
    padding: 1rem;
    margin: auto;
    border-radius: 8px;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
}

.back-button:active {
    background-color: var(--secondary-color);
    color: #fff;
}

.images-contain {
    height: 400px;
    position: fixed;
    top: 550px;
    right: .1rem;
    overflow: hidden;
}

.error-image-1 {
    width: 95%;
    height: 610px;
}

.error-image-2 {
    width: 95%;
    height: 610px;
}
</style>