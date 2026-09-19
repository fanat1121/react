-- go-service/docker/mysql/init/02_trick_master.sql
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE equipment_master (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    is_invalid TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_is_invalid (is_invalid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE equipment_category_master (
    id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_id INT NOT NULL,
    name VARCHAR(64) NOT NULL,
    is_invalid TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_equipment_id (equipment_id),
    INDEX idx_is_invalid (is_invalid),
    FOREIGN KEY (equipment_id) REFERENCES equipment_master(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE state_master (
    id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_id INT NOT NULL,
    name VARCHAR(64) NOT NULL,
    description TEXT NULL,
    is_invalid TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_equipment_id (equipment_id),
    INDEX idx_is_invalid (is_invalid),
    FOREIGN KEY (equipment_id) REFERENCES equipment_master(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE trick_master (
    id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_id INT NOT NULL,
    category_id INT NOT NULL,
    name VARCHAR(128) NOT NULL,
    description TEXT NULL,
    start_state_id INT NOT NULL,
    end_state_id INT NOT NULL,
    video_url VARCHAR(512) NULL,
    estimated_duration_seconds INT NOT NULL DEFAULT 0,
    is_invalid TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_equipment_id (equipment_id),
    INDEX idx_category_id (category_id),
    INDEX idx_start_state_id (start_state_id),
    INDEX idx_end_state_id (end_state_id),
    INDEX idx_is_invalid (is_invalid),
    FOREIGN KEY (equipment_id) REFERENCES equipment_master(id),
    FOREIGN KEY (category_id) REFERENCES equipment_category_master(id),
    FOREIGN KEY (start_state_id) REFERENCES state_master(id),
    FOREIGN KEY (end_state_id) REFERENCES state_master(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
