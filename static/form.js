// Объявляем функцию и экспортируем её
export function initForm() {
    document.getElementById('myForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Предотвращаем стандартную отправку формы

        const formData = new FormData(this);
        const queryString = new URLSearchParams(formData).toString();

        fetch(`/fcgi-bin/app.jar?${queryString}`)
            .then(response => response.json())
            .then(data => {
                // Отображаем результат
                document.getElementById('result').innerText = `Result: ${data.result}`;

                // Получаем значения полей формы
                const xValue = formData.get('x');
                const yValue = formData.get('y');
                const rValue = formData.get('R');
                const resultValue = data.result; // Результат вычислений с сервера

                // Получаем тело таблицы и проверяем количество строк
                const tableBody = document.getElementById('dataTable').querySelector('tbody');
                const rowCount = tableBody.rows.length;

                // Если количество строк больше или равно 10, удаляем последнюю строку
                if (rowCount >= 10) {
                    tableBody.deleteRow(9);
                }

                // Добавляем новую строку в таблицу
                const newRow = tableBody.insertRow(0);

                // Добавляем ячейки в новую строку
                const xCell = newRow.insertCell(0);
                const yCell = newRow.insertCell(1);
                const rCell = newRow.insertCell(2);
                const resultCell = newRow.insertCell(3);

                // Заполняем ячейки данными
                xCell.textContent = xValue;
                yCell.textContent = yValue;
                rCell.textContent = rValue;
                resultCell.textContent = resultValue;
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
    setValidation();



}
   function setValidation() {
   setValidationX();
    setValidationY();
}
function setValidationX(){
    document.getElementById('xInput').addEventListener('input', function (event) {
        const input = event.target;
        const value = input.value;

        // Удаляем все символы, кроме цифр, минуса и точки
        const sanitizedValue = value.replace(/[^-?\d.]/g, '');

        // Разрешаем только один минус в начале и одну точку
        if ((sanitizedValue.match(/-/g) || []).length > 1 || sanitizedValue.indexOf('-') > 0) {
            input.value = ''; // Если есть лишний минус, очищаем поле
            return;
        }
        if ((sanitizedValue.match(/\./g) || []).length > 1) {
            input.value = ''; // Если есть лишняя точка, очищаем поле
            return;
        }
        const numberValue = parseFloat(sanitizedValue);

        // Проверяем, является ли значение числом, и в диапазоне (-3, 3)
        if (!isNaN(numberValue) && numberValue > -3 && numberValue < 3) {
            document.getElementById('error-message').innerText = ''; // Убираем сообщение об ошибке
            input.value = sanitizedValue; // Оставляем только валидные символы
        } else if (sanitizedValue === '' || sanitizedValue === '-') {
            input.value = sanitizedValue; // Разрешаем пустое или минус как промежуточное состояние
        } else {
            document.getElementById('error-message').innerText = 'Введите число от -3 до 3';
            input.value = ''; // Очищаем поле, если не соответствует диапазону
        }
    });
}
function setValidationY(){
    document.getElementById('yInput').addEventListener('input', function (event) {
        const input = event.target;

        console.log(input.getAttribute('value')); // Это нужно, если вы хотите обновить значение атрибута value в HTML

        if ((!input.checkValidity() && input.value !== '' && input.value !== '-')
        || (input.value.includes('.') || input.value.includes(','))) {
            // Здесь можно обрабатывать случай, когда поле не валидно
            document.getElementById('error-message').innerText = 'Введите допустимое значение!';
            input.setAttribute('text', ''); // Это нужно, если вы хотите обновить значение атрибута value в HTML
        }else {
            // Если значение валидно, убираем сообщение об ошибке
            document.getElementById('error-message').innerText = '';
        }
    })
}