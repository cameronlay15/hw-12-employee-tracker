USE employee_tracker;

INSERT INTO department (name) VALUES 
("Engineering"),
("Change"),
("Quality"),
("Resilence"),
("SRE");

INSERT INTO role (title, salary, department_id) VALUES
("Eng", 130000, 1),
("PM", 110000, 2),
("SDET", 110000, 3),
("Analyst", 120000, 4),
("SRE", 130000, 5);

INSERT INTO employee (first_name, last_name, role_id) VALUES 
("Gary", "Gerald", 1),
("Bennett", "Landry", 2),
("Ava", "Claire", 3),
("Tanya", "Faye", 4),
("Dylan", "Robert", 5);