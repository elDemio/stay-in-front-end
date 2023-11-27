import { ref, computed } from "vue";

export const startDate = ref('');
export const endDate = ref('');
export const showCalendar = ref(false);
export const currentYear = ref(new Date().getFullYear());
export const currentMonth = ref(new Date().getMonth());
export const today = new Date().getDate();

export const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto',
    'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export const daysInMonth = computed(() => {
    const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
    return Array.from({ length: lastDay }, (_, i) => i + 1);
});

export const selectedDate = ref(null);
export const selectedInput = ref(null);

export const toggleCalendar = (input) => {
    showCalendar.value = !showCalendar.value;
    selectedInput.value = input;
};

export const prevYear = () => {
    currentYear.value--;
};

export const nextYear = () => {
    currentYear.value++;
};

export const prevMonth = () => {
    if (currentMonth.value === 0) {
        currentMonth.value = 11;
        currentYear.value--;
    } else {
        currentMonth.value--;
    }
};

export const nextMonth = () => {
    if (currentMonth.value === 11) {
        currentMonth.value = 0;
        currentYear.value++;
    } else {
        currentMonth.value++;
    }
};

export const formatDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    const formattedDay = day < 10 ? `0${day}` : `${day}`;

    return `${year}-${formattedMonth}-${formattedDay}`;
};

export const selectDate = (day) => {
    const selectedDateObj = new Date(currentYear.value, currentMonth.value, day);
    const formattedDate = formatDate(selectedDateObj);

    if (selectedInput.value === 'startDate') {
        startDate.value = formattedDate;
        endDate.value = '';
    } else if (selectedInput.value === 'endDate') {
        const startDateObj = new Date(startDate.value);
        const endDateObj = new Date(currentYear.value, currentMonth.value, day);

        if (startDateObj <= endDateObj) {
            endDate.value = formattedDate;
        } else {
            endDate.value = formattedDate;
            startDate.value = formattedDate;
        }
    }

    showCalendar.value = false;
    selectedDate.value = day;
};