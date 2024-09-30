package backend.academy;

import com.fastcgi.FCGIInterface;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.Locale;
import java.time.ZoneId; // Импортируйте этот класс

import java.util.logging.FileHandler;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;

public class Main {
    private static final String HTTP_RESPONSE = "HTTP/1.1: 200 OK\n" +
            "Content-Type: application/json\n" +
            "Content-Length: %d\n\n" +
            "%s";
    private static final String HTTP_ERROR = "HTTP/1.1: 400 Bad Request\n" +
            "Content-Type: application/json\n" +
            "Content-Length: %d\n\n" +
            "%s";
    private static final String ERROR_JSON = "{\"reason\": \"%s\"}";
    private static final String RESULT_JSON = """
            {
                "result": %b,
                "executionTime": "%s",
                "serverTime": "%s"
            }
            """;

    // Инициализация логгера
    private static final Logger logger = Logger.getLogger(Main.class.getName());

    static {
        try {
            // Добавляем FileHandler для записи логов в файл
            FileHandler fileHandler = new FileHandler("/home/studs/s409397/logs/webserver.log", true); // Лог-файл в директории пользователя            fileHandler.setFormatter(new SimpleFormatter());
            logger.addHandler(fileHandler);
            logger.setLevel(Level.INFO); // Уровень логирования
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) throws IOException {
        Checker checker = new Checker();
        var fcgi = new FCGIInterface();

        // Начало работы сервера
        logger.info("FastCGI сервер запущен...");

        while (fcgi.FCGIaccept() >= 0) {
            try {
                FCGIInterface.request.inStream.fill();
                var startTime = System.currentTimeMillis();
                // Получаем параметры запроса
                var queryParams = System.getProperty("QUERY_STRING");
                logger.info("Получены параметры запроса: " + queryParams);

                if (queryParams == null || queryParams.isEmpty()) {
                    throw new ValidationException("Missing query string");
                }


                var params = new Params(queryParams);

                // Проверяем параметры и вычисляем результат
                var result = checker.check(params.getX(), params.getY(), params.getR());
                var endTime = System.currentTimeMillis();
                Instant instant = Instant.ofEpochMilli(endTime-startTime);
                // Преобразование Instant в LocalTime
                LocalTime localTime = instant.atZone(ZoneId.of("UTC")).toLocalTime();
                // Форматирование времени в формате ISO
                String time = DateTimeFormatter.ISO_TIME.format(localTime);
                var serverTime = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

                var json = String.format(RESULT_JSON, result,  time,serverTime);
                var response = String.format(HTTP_RESPONSE, json.getBytes(StandardCharsets.UTF_8).length, json);
                System.out.print(response);

                // Логируем успешный ответ
                logger.info("Ответ: " + response);

                // Отправляем ответ через FastCGI интерфейс

            } catch (ValidationException e) {
                var json = String.format(ERROR_JSON, e.getMessage());
                var response = String.format(HTTP_ERROR, json.getBytes(StandardCharsets.UTF_8).length, json);

                // Логируем ошибку валидации
                logger.severe("Ошибка валидации: " + e.getMessage());
                logger.severe("Ответ: " + response);

                // Отправляем ответ с ошибкой через FastCGI интерфейс
                System.out.print(response);

            } catch (Exception e) {
                // Логируем любую другую ошибку
                logger.log(Level.SEVERE, "Ошибка во время обработки запроса", e);
            }
        }

        // Логируем завершение работы сервера
        logger.info("FastCGI сервер остановлен.");
    }
}
