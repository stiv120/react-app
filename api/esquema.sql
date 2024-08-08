CREATE DATABASE historial_db;
USE historial_db;
CREATE TABLE IF NOT EXISTS historial(
    `id` INT NOT NULL AUTO_INCREMENT,
    `ciudad` VARCHAR(250) NOT NULL,
    `latitud` FLOAT NOT NULL,
    `longitud` FLOAT NOT NULL,
    `humedad` FLOAT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);