import { ref } from 'vue'

export const is_expanded = ref(localStorage.getItem("is_expanded") === "true")

export const ToggleMenu = () => {
    is_expanded.value = !is_expanded.value
    localStorage.setItem("is_expanded", is_expanded.value)
}

export const showReservas = ref(true)
export const showHistorial = ref(false)

export const toggleBookings = () => {
    showReservas.value = true
    showHistorial.value = false
}

export const toggleHistory = () => {
    showReservas.value = false
    showHistorial.value = true
}