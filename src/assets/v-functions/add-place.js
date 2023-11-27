import { ref } from "vue";

export const activeSection = ref(1);

export function toggleSection(section) {
    if (activeSection.value === section) {
        activeSection.value = 0;
    } else {
        activeSection.value = section;
    }
}

export function nextSection() {
    if (activeSection.value < 3) {
        activeSection.value++;
    }
}

export function previousSection() {
    if (activeSection.value > 1) {
        activeSection.value--;
    }
}