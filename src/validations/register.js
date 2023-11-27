export const validateName = () => {
    const nameInput = document.getElementById('firstName');
    const nameError = document.getElementById('nameError');
    const name = nameInput.value;

    if (!name) {
        nameError.textContent = 'Por favor ingresa tu nombre.';
        nameError.style.display = 'block'
        return
    } else if (!/^[A-Z]/.test(name)) {
        nameError.textContent = 'La primer letra de tu nombre debe ser mayúscula.';
        nameError.style.display = 'block'
        return
    } else if (/\d/.test(name)) {
        nameError.textContent = 'Este campo no admite números';
        nameError.style.display = 'block'
        return
    } else {
        nameError.textContent = '';
        nameError.style.display = 'none'
    }
}

export const validateLastName = () => {
    const lastNameInput = document.getElementById('lastName');
    const lastNameError = document.getElementById('lastNameError');
    const lastName = lastNameInput.value;

    if (!lastName) {
        lastNameError.textContent = 'Por favor ingresa tu apellido.';
        lastNameError.style.display = 'block'
        return
    } else if (!/^[A-Z]/.test(lastName)) {
        lastNameError.textContent = 'La primer letra de tu apellido debe ser mayúscula.';
        lastNameError.style.display = 'block'
        return
    } else if (/\d/.test(lastName)) {
        lastNameError.textContent = 'Este campo no admite números';
        lastNameError.style.display = 'block'
        return
    } else {
        lastNameError.textContent = '';
        lastNameError.style.display = 'none'
    }
}

export const validateRegEmail = () => {
    const emailRegInput = document.getElementById('email');
    const emailRegError = document.getElementById('emailRegError');
    const Regemail = emailRegInput.value;

    if (!Regemail) {
        emailRegError.textContent = 'Por favor ingresa un correo electrónico.';
        emailRegError.style.display = 'block'
        return
    } else if (!Regemail.match(/^\S+@\S+\.\S+$/)) {
        emailRegError.textContent = 'Por favor ingresa un correo electrónico válido.';
        emailRegError.style.display = 'block'
        return
    } else {
        emailRegError.textContent = '';
        emailRegError.style.display = 'none'
    }
}

export const validateRegPassword = () => {
    const passworRegInput = document.getElementById('password');
    const passwordRegError = document.getElementById('passwordRegError');
    const passwordReg = passworRegInput.value;

    if (!passwordReg) {
        passwordRegError.textContent = 'Por favor ingresa una contraseña.';
        passwordRegError.style.display = 'block'
        return
    } else {
        passwordRegError.textContent = '';
        passwordRegError.style.display = 'none'
    }
}

export const validateRegFormCompletion = () => {
    const nameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailRegInput = document.getElementById('email');
    const passwordRegInput = document.getElementById('password');
    const name = nameInput.value;
    const lastname = lastNameInput.value;
    const email = emailRegInput.value;
    const password = passwordRegInput.value;
    const formRegError = document.getElementById('formRegError')

    if (!name || !lastname || !email || !password) {
        formRegError.textContent = 'Por favor completa todos los campos.';
        formRegError.style.display = 'block'
        return
    }
    formRegError.textContent = '';
    formRegError.style.display = 'none'
}
