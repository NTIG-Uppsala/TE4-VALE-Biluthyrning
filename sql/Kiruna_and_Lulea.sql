CREATE TABLE `open_hours`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `day` VARCHAR(10) NOT NULL,
    `hours` VARCHAR(15) NOT NULL,
    `from_hour` BIGINT COMMENT 'null in this field and the 3 below means closed',
    `to_hour` BIGINT,
    `from_minute` BIGINT,
    `to_minute` BIGINT,
    `index` INT NOT NULL COMMENT 'this is the code for the weekday ( sunday = 0, saturday=6)'
);
CREATE TABLE `languages`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `language_name` VARCHAR(50) NOT NULL,
    `language_code` VARCHAR(5) NOT NULL
);
CREATE TABLE `social_media`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL,
    `url` TEXT NOT NULL,
    `icon` TEXT NOT NULL,
    `source` TEXT NOT NULL
);
CREATE TABLE `location_info`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `folder` VARCHAR(50) NOT NULL,
    `key` VARCHAR(16) NOT NULL,
    `zip_code` VARCHAR(6) NOT NULL,
    `address` VARCHAR(50) NOT NULL,
    `location` VARCHAR(50) NOT NULL,
    `city` VARCHAR(50) NOT NULL,
    `phone_number` VARCHAR(50) NOT NULL,
    `mail` VARCHAR(50) NOT NULL
);
CREATE TABLE `zip_codes`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `zip_code` VARCHAR(6) NOT NULL,
    `price` VARCHAR(20) NOT NULL
);
CREATE TABLE `special_open_hours`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `month` INT NOT NULL COMMENT 'month is an int of the data (6 = June)',
    `day` VARCHAR(10) NOT NULL,
    `hours` VARCHAR(15) NOT NULL,
    `from_hour` BIGINT COMMENT 'null in this field and the 3 below means closed',
    `to_hour` BIGINT,
    `from_minute` BIGINT,
    `to_minute` BIGINT,
    `index` BIGINT NOT NULL COMMENT 'this is the code for the weekday ( sunday = 0, saturday=6)'
);
CREATE TABLE `closed_dates`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `holiday` VARCHAR(50) NOT NULL,
    `date_name` VARCHAR(20) NOT NULL,
    `hours` VARCHAR(20) NOT NULL,
    `date_code` VARCHAR(4) NOT NULL
);
CREATE TABLE `Cars`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL,
    `year` VARCHAR(4) NOT NULL,
    `price` BIGINT NOT NULL
);