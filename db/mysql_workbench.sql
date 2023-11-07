USE patientsdb;
DESC patients;

SHOW procedure status WHERE DB='patientsdb';

DROP PROCEDURE IF EXISTS create_and_return;

DELIMITER //
CREATE PROCEDURE create_and_return(IN first_name VARCHAR(255), IN last_name VARCHAR(255), 
                                    IN email VARCHAR(255), IN address VARCHAR(255), IN diagnosis VARCHAR(255), 
                                    IN phone VARCHAR(255), IN image_url VARCHAR(255))
BEGIN
  INSERT INTO patients(first_name, last_name, email, address, diagnosis, phone, image_url) VALUES (first_name, last_name, email, address, diagnosis, phone, image_url);
  SET @PATIENT_ID = LAST_INSERT_ID();
  SELECT * FROM patients WHERE id=@PATIENT_ID;
END //

DELIMITER ;