CREATE DATABASE library;

use library;
/* CREACION DE TABLAS */
CREATE TABLE Editorial (
	id int auto_increment primary key,
    name varchar(100) unique not null
);

CREATE TABLE Author (
	id int auto_increment primary key,
    name varchar(100) unique not null
);

CREATE TABLE Reader (
	id int auto_increment primary key,
    name varchar(100) not null,
    lastName varchar(100) not null
);

CREATE TABLE Book (
	id int auto_increment primary key,
    code int unique not null,
    title varchar(100) not null,
    idEditorial int,
    foreign key (idEditorial) references Editorial(id)
);


CREATE TABLE Loan (
	id int auto_increment primary key,
    idBook int,
    idReader int,
    returnDate date,
    foreign key (idBook) references Book(id),
    foreign key (idReader) references Reader(id)
);

CREATE TABLE BookAuthor (
	idBook int,
    idAuthor int,
    primary key (idBook, idAuthor),
    foreign key (idBook) references Book(id),
    foreign key (idAuthor) references Author(id)
);

/* INSERCION DE DATOS */
INSERT INTO Editorial (name) VALUES 
("EMECE"), 
("Planeta"), 
("Alfaguara");

INSERT INTO Author (name) VALUES 
("Pedro Mairal"), 
("Eduardo Sacheri"), 
("Hernán Casciari");

INSERT INTO Reader (lastName, name) VALUES 
("Goméz","Ana"), 
("Pérez", "Juan"), 
("Sánchez", "José");

INSERT INTO Book (id, code, title, idEditorial) VALUES
(1, 1001, 'La uruguaya', 1),
(2, 1004, 'Salvatierra', 1),
(3, 1005, 'El funcionamiento general del mundo', 2),
(4, 1006, 'Ser feliz era esto', 3),
(5, 1007, 'Cuentos cortos', 2);

INSERT INTO Loan (id, idReader, idBook, returnDate) VALUES
(1, 1, 1, '2021-01-01'),
(2, 2, 2, '2021-01-02'),
(3, 1, 2, '2021-03-01'),
(4, 1, 3, '2021-08-01'),
(5, 3, 4, '2021-08-01'),
(6, 3, 5, '2021-08-01');

INSERT INTO BookAuthor (idAuthor, idBook) VALUES
(1, 1),
(1, 2),
(2, 3),
(1, 3),
(2, 4),
(2, 5),
(1, 5),
(3, 5);
    