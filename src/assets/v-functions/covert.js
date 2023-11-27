import { ref } from 'vue';

import { useAuthStore } from '../../stores/auth';
const authStore = useAuthStore();

export const timeLapsed = ref('');

export const translateCreatedAt = (createdAt) => {
    if (createdAt.includes('second')) {
        const secondsAgo = parseInt(createdAt);
        if (!isNaN(secondsAgo)) {
            return `hace ${secondsAgo} ${secondsAgo === 1 ? 'segundo' : 'segundos'}`;
        }
    } else if (createdAt.includes('minute')) {
        const minutesAgo = parseInt(createdAt);
        if (!isNaN(minutesAgo)) {
            return `hace ${minutesAgo} ${minutesAgo === 1 ? 'minuto' : 'minutos'}`;
        }
    } else if (createdAt.includes('hour')) {
        const hoursAgo = parseInt(createdAt);
        if (!isNaN(hoursAgo)) {
            return `hace ${hoursAgo} ${hoursAgo === 1 ? 'hora' : 'horas'}`;
        }
    }
    else if (createdAt.includes('day')) {
        const daysAgo = parseInt(createdAt);
        if (!isNaN(daysAgo)) {
            return `hace ${daysAgo} ${daysAgo === 1 ? 'día' : 'días'}`;
        }
    } else if (createdAt.includes('month')) {
        const monthsAgo = parseInt(createdAt);
        if (!isNaN(monthsAgo)) {
            return `hace ${monthsAgo} ${monthsAgo === 1 ? 'mes' : 'meses'}`;
        }
    } else if (createdAt.includes('week')) {
        const weeksAgo = parseInt(createdAt);
        if (!isNaN(weeksAgo)) {
            return `hace ${weeksAgo} ${weeksAgo === 1 ? 'semana' : 'semanas'}`;
        }
    } else if (createdAt.includes('year')) {
        const yearsAgo = parseInt(createdAt);
        if (!isNaN(yearsAgo)) {
            return `hace ${yearsAgo} ${yearsAgo === 1 ? 'año' : 'años'}`;
        }
    }
    return createdAt;
}

export const getTimeLapsed = () => {
    const currentDate = new Date();
    const createdDate = new Date(authStore.created);
    const MSdiference = currentDate - createdDate;

    const seconds = Math.floor(MSdiference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);

    if (months > 0) {
        timeLapsed.value = `${months} ${months > 1 ? 'meses' : 'mes'}`;
    } else if (days > 0) {
        timeLapsed.value = `${days} ${days > 1 ? 'días' : 'día'}`;
    } else if (hours > 0) {
        timeLapsed.value = `${hours} ${hours > 1 ? 'horas' : 'hora'}`;
    } else if (minutes > 0) {
        timeLapsed.value = `${minutes} ${minutes > 1 ? 'minutos' : 'minuto'}`;
    } else {
        timeLapsed.value = `${seconds} ${seconds > 1 ? 'segundos' : 'segundo'}`;
    }
}