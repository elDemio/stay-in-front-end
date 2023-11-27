import axios from 'axios';
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        authId: null,
        authUser: null,
        authToken: null,
        role: '',
        created: null
    }),

    getters: {
        id: (state) => state.authId,
        user: (state) => state.authUser,
        token: (state) => state.authToken,
        isRole: (state) => state.role
    },

    actions: {
        async getToken() {
            await axios.get('/sanctum/csrf-cookie');
        },
        async login(form) {
            await this.getToken();

            await axios.post('/api/v1/login', form).then(
                (res) => {
                    this.authId = res.data.usuario.id;
                    this.authToken = res.data.token;
                    this.authUser = res.data.usuario.name;
                    this.role = res.data.usuario.role;
                    this.created = res.data.usuario.created_at;
                    localStorage.setItem('authToken', res.data.token);
                    localStorage.setItem('role', res.data.usuario.role);
                    localStorage.setItem('created', res.data.usuario.created_at);

                    document.getElementById('loginModal').querySelector('[data-bs-dismiss="modal"]').click();
                }

            ).catch(error => {
                if (error.response && error.response.data && error.response.data.message) {
                    this.error = error.response.data.message;
                } else {
                    this.error = 'Error en la solicitud';
                }
                console.error('Error en la solicitud:', this.error);
            });
        },

        async register(form) {
            await this.getToken();

            await axios.post('/api/v1/register', form).then(
                (res) => {
                    this.authId = res.data.usuario.id;
                    this.authToken = res.data.token;
                    this.authUser = res.data.usuario.name;
                    this.role = res.data.usuario.role;
                    this.created = res.data.usuario.created_at;
                    console.log('Usuario registrado');

                    localStorage.setItem('authToken', res.data.token);
                    localStorage.setItem('role', res.data.usuario.role);
                    localStorage.setItem('created', res.data.usuario.created_at);

                    document.getElementById('loginModal').querySelector('[data-bs-dismiss="modal"]').click();
                }

            ).catch(error => {
                if (error.response && error.response.data && error.response.data.message) {
                    this.error = error.response.data.message;
                } else {
                    this.error = 'Error en la solicitud';
                }
                console.error('Error en la solicitud:', this.error);
            });
        },

        async logout() {
            const authToken = localStorage.getItem('authToken');

            if (!authToken) {
                console.error('El token de autenticación no está disponible.');
                return;
            }

            try {
                await axios.get('/api/v1/cerrarsesion', { headers: { Authorization: `Bearer ${authToken}` } });

                this.authToken = null;
                this.authUser = null;
                this.authId = null;
                this.role = '';
                this.created = null;

                localStorage.removeItem('authToken');

                this.router.push('/');

            } catch (error) {
                console.error('Error al cerrar sesión:', error);
            }
            window.location.reload()
        },

        async changeRole() {
            try {
                const authToken = this.authToken;
                const userId = this.authId;

                if (!authToken) {
                    console.error('El token de autenticación no está disponible.');
                    return;
                }

                const response = await axios.post(`/api/v1/propertiesrole/${userId}`, null, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });

                if (response.status === 200) {
                    this.role = 'isHost';
                    console.log('El rol del usuario se cambió a Host');
                } else {
                    console.error('Error al cambiar el rol del usuario:', response.statusText);
                }
            } catch (error) {
                console.error('Error al cambiar el rol del usuario:', error);
            }
        },
    },
    persist: true
});