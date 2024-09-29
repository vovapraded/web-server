# Первый этап: сборка проекта с Maven
FROM maven:3.9.4-eclipse-temurin-17 AS build

# Копируем исходный код в контейнер
COPY . /usr/src/app
WORKDIR /usr/src/app

# Устанавливаем локальный fastcgi-lib.jar в локальный репозиторий Maven
COPY /fastcgi-lib.jar /usr/src/app/fastcgi-lib.jar
RUN mvn install:install-file -Dfile=/usr/src/app/fastcgi-lib.jar -DgroupId=com.example -DartifactId=fastcgi-lib -Dversion=1.0.0 -Dpackaging=jar

# Собираем проект с Maven (например, командой package)
RUN mvn clean package

# Второй этап: создание контейнера для выполнения
FROM eclipse-temurin:17-jre

# Указываем порт
EXPOSE 1333

# Создаем директорию для приложения
RUN mkdir /app
WORKDIR /app

# Копируем сгенерированный jar файл из этапа сборки
COPY --from=build /usr/src/app/target/web-server-1.0-SNAPSHOT-jar-with-dependencies.jar /app/app.jar
# COPY /var/www /static

# Указываем команду для запуска приложения
ENTRYPOINT ["java", "-DFCGI_PORT=1333", "-jar", "/app/app.jar"]