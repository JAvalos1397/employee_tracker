INSERT INTO department (name)
VALUES("Engineering"),
 ("Sales"),
 ("Finance"),
 ("Legal"),
 ("Marketing");

INSERT INTO roles (title, salary, department_id)
VALUES
("Engineer", 85000, 1),
("Senior Engineer", 125000, 1),
("CFO", 350000, 3),
("Chief Counsel", 300000, 4),
('Marketing Coordindator', 70000, 3), 
('Sales Lead', 90000, 3),
('Project Manager', 100000, 4),
('Operations Manager', 90000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Mark', 'Miller', 2, null),
('Devin', 'Anderson', 1, 1),
('Mary', 'Brown', 4, null),
('Ashley', 'Jones', 3, 3),
('Tyler', 'Moore', 6, null),
('Ana', 'Sanchez', 5, 5),
('Lewis', 'Allen', 7, null),
('Katherine', 'Green', 8, 7);