SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE state_master
    ADD COLUMN media_url VARCHAR(512) NULL AFTER description;
