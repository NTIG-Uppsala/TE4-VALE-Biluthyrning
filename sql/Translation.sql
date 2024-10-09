CREATE TABLE `translation_keys`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `key` TEXT NOT NULL
);
CREATE TABLE `languages`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL,
    `code` VARCHAR(10) NOT NULL COMMENT 'e.g en, fi sv'
);
CREATE TABLE `translations`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `language_id` BIGINT NOT NULL,
    `translation_key_id` BIGINT NOT NULL,
    `translation` TEXT NOT NULL
);
ALTER TABLE
    `translations` ADD CONSTRAINT `translations_language_id_foreign` FOREIGN KEY(`language_id`) REFERENCES `languages`(`id`);
ALTER TABLE
    `translations` ADD CONSTRAINT `translations_translation_key_id_foreign` FOREIGN KEY(`translation_key_id`) REFERENCES `translation_keys`(`id`);