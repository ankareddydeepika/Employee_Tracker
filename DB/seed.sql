use employees;

INSERT INTO department
    (name)
VALUES
    ('Sales'),
    ('Engineering')
    

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Salesperson', 60000, 1),
    ('Software Engineer', 150000, 2)

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Abby', 'Raquel', 1, NULL),
    ('Deepika', 'Adi', 2, 1),
    
    
    
