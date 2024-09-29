import { drawFullPlot,clearPlot } from './plot.js';
import {initForm} from "./form.js";

// Получить выбранное значение радио-кнопки
function getSelectedR() {
    const selectedRadio = document.querySelector('input[name="R"]:checked');
    if (selectedRadio) {
        return parseFloat(selectedRadio.value);
    } else {
        return null; // или любое другое значение по умолчанию
    }
}

// Обновление графика на основе выбранного значения
function updatePlot() {
    clearPlot();
    const R = getSelectedR(); // Получаем выбранное значение R
    if (R !== null) {
        drawFullPlot(R); // Передаем значение R в функцию
    } else {
        console.log('No R value selected');
    }
}

// Добавление слушателя событий на изменение выбора радио-кнопок
function addEventListeners() {
    const radios = document.getElementsByName('R');
    radios.forEach(radio => {
        radio.addEventListener('change', updatePlot); // Обновляем график при изменении выбора
    });
}
document.addEventListener('DOMContentLoaded', () => {
    initialize();
});
// Инициализация
function initialize() {
    addEventListeners(); // Добавляем слушатели событий
    updatePlot(); // Обновляем график при загрузке страницы
    initForm();
}

