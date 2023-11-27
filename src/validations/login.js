export const validateEmail = () => {
    const emailInput = document.getElementById('floatingEmail');
    const emailError = document.getElementById('emailError');
    const email = emailInput.value;

    if (!email) {
        emailError.textContent = 'Por favor ingresa tu correo electrónico.';
        emailError.style.display = 'block'
        return
    } else if (!email.match(/^\S+@\S+\.\S+$/)) {
        emailError.textContent = 'Por favor ingresa un correo electrónico válido.';
        emailError.style.display = 'block'
        return
    } else {
        emailError.textContent = '';
        emailError.style.display = 'none'
    }
}

export const validatePassword = () => {
    const passworInput = document.getElementById('floatingPassword');
    const passwordError = document.getElementById('passwordError');
    const password = passworInput.value;

    if (!password) {
        passwordError.textContent = 'Por favor ingresa tu contraseña.';
        passwordError.style.display = 'block'
        return
    } else {
        passwordError.textContent = '';
        passwordError.style.display = 'none'
    }
}

export const validateFormCompletion = () => {
    const emailInput = document.getElementById('floatingEmail');
    const passworInput = document.getElementById('floatingPassword');
    const email = emailInput.value;
    const password = passworInput.value;
    const formError = document.getElementById('formError')

    if (!email || !password) {
        formError.textContent = 'Por favor completa todos los campos.';
        formError.style.display = 'block'
        return
    }
    formError.textContent = '';
    formError.style.display = 'none'
}