export function drawFullPlot(R) {
    console.log(`Function drawFullPlot is working. Radius: ${R}`);

    function maxByAbsolute(a, b) {
        return Math.abs(a) > Math.abs(b) ? a : b;
    }

    function createPoint(cx, cy) {
        let svgNamespace = "http://www.w3.org/2000/svg";
        let svg = document.getElementById('mySvg');

        // Создаем круг
        let pointR = document.createElementNS(svgNamespace, 'circle');
        pointR.setAttribute('class', 'point');
        pointR.setAttribute('r', '2'); // Размер точки
        pointR.setAttribute('cx', cx * 25 + 100); // Масштабирование и смещение
        pointR.setAttribute('cy', 100 - cy * 25); // Масштабирование и смещение

        // Создаем текст
        let labelR = document.createElementNS(svgNamespace, 'text');
        labelR.setAttribute('class', 'label');
        labelR.setAttribute('x', cx * 25 + 100+ 1); // Масштабирование и смещение
        labelR.setAttribute('y', 100 - cy * 25 - 5); // Масштабирование и смещение
        labelR.textContent = maxByAbsolute(cx, cy); // Подпись для точки

        // Добавляем элементы в SVG
        svg.appendChild(pointR);
        svg.appendChild(labelR);
    }

    function create4Points(R) {
        createPoint(R, 0); // Пример точки
        createPoint(-R, 0); // Пример другой точки
        createPoint(0, R); // Пример точки
        createPoint(0, -R);
    }

    function createQuarterCircle(radius) {
        let svgNamespace = "http://www.w3.org/2000/svg";
        let svg = document.getElementById('mySvg');

        // Создаем путь для полукруга
        let path = document.createElementNS(svgNamespace, 'path');
        let d = `M 100 100
             L ${100 - radius * 25} 100
             A ${radius * 25} ${radius * 25} 0 0 1 100 ${100 - radius * 25}
             Z`;
        path.setAttribute('d', d);
        path.setAttribute("class","figure");
        // Добавляем путь в SVG перед другими элементами
        svg.appendChild(path);
    }

    function createRectangle(width, height) {
        let svgNamespace = "http://www.w3.org/2000/svg";
        let svg = document.getElementById('mySvg');

        // Создаем путь для полукруга
        let path = document.createElementNS(svgNamespace, 'path');
        let d = `M 100 100
             L ${100 - width * 25} 100
             L ${100 - width * 25} ${100 + height * 25}
             L 100 ${100 + height * 25}

             Z`;
        path.setAttribute('d', d);
        path.setAttribute("class","figure");


        // Добавляем путь в SVG перед другими элементами
        svg.appendChild(path);
    }

    function createTriangle(bigCatheter, smallCatheter) {
        let svgNamespace = "http://www.w3.org/2000/svg";
        let svg = document.getElementById('mySvg');

        // Создаем путь для полукруга
        let path = document.createElementNS(svgNamespace, 'path');
        let d = `M 100 100
             L 100 ${100 + smallCatheter * 25}
             L ${100 + bigCatheter * 25} 100

             Z`;
        path.setAttribute('d', d);
        path.setAttribute("class","figure");

        // Добавляем путь в SVG перед другими элементами
        svg.appendChild(path);
    }

    createRectangle(R / 2, R);
    createTriangle(R, R / 2);

    createQuarterCircle(R);
    createPoint(0, 0);
    create4Points(R);
    create4Points(R / 2);

}// Пример другой точки
export function clearPlot() {
    const svg = document.getElementById('mySvg'); // Находим элемент SVG по ID
    if (svg) {
        // Собираем все дочерние элементы в массив, чтобы избежать изменения коллекции во время итерации
        const children = Array.from(svg.children);
        children.forEach(child => {
            // Проверяем, если класс элемента не содержит 'grid', то удаляем его
            if (!child.classList.contains('grid')) {
                svg.removeChild(child);
            }
        });
    }
}