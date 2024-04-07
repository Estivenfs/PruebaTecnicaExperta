use library;

/*Ranking de los diez primeros libros más solicitados, incluyendo: Nombre del libro, autor, editorial y cantidad de veces que ha sido retirado.
 Ordenar los resultados de mayor a menor cantidad.*/

SELECT
    b.title AS Nombre_del_Libro,
    GROUP_CONCAT(DISTINCT a.name SEPARATOR ', ') AS Autor,
    e.name AS Editorial,
    (SELECT COUNT(id) FROM Loan WHERE idBook = b.id) AS Cantidad_de_Retiros
FROM
    Book b
JOIN
    Loan l ON b.id = l.idBook
JOIN
    BookAuthor ba ON b.id = ba.idBook
JOIN
    Author a ON ba.idAuthor = a.id
JOIN
    Editorial e ON b.idEditorial = e.id
GROUP BY
    b.id
ORDER BY
    Cantidad_de_Retiros DESC
LIMIT 10;

/*Listado de títulos y su cantidad de autores. Se debe visualizar: Título y cantidad de autores. 
Solo visualizar aquellos registros donde hayan más de dos autores.
*/

SELECT
    b.title AS Título,
    COUNT(DISTINCT ba.idAuthor) AS Cantidad_de_Autores
FROM
    Book b
JOIN
    BookAuthor ba ON b.id = ba.idBook
GROUP BY
    b.title
HAVING
    COUNT(DISTINCT ba.idAuthor) > 2;


/*Listado de los lectores y cuantas veces han retirado un determinado libro: Lector, libro, cantidad de retiros.*/


SELECT 
	CONCAT(r.lastName,', ',r.name) AS Lector,
    b.title AS Título,
    COUNT(b.id) AS Cantidad_Retiros
FROM 
	Loan l
JOIN 
	Reader r ON r.id = l.idReader
LEFT JOIN
	Book b ON b.id = l.idBook
GROUP BY
	b.id, r.id;
    
    
/*Listado de libros y cuántas veces fueron retirados por mes en el último año. 
Contemplar aquellos meses donde no hubo retiros como 0. El resultado debe otorgar: Código de libro, Título, Mes y año, Cantidad de libros.*/



DROP PROCEDURE IF EXISTS ConteoRetirosPorMesEnAño;

DELIMITER //
CREATE PROCEDURE ConteoRetirosPorMesEnAño(IN year_to_count INT)
BEGIN

  DECLARE start_date DATE;
  DECLARE end_date DATE;
  DECLARE currentDate DATE;

  SET start_date = STR_TO_DATE(CONCAT(year_to_count, '-01-01'), '%Y-%m-%d');
  SET end_date = STR_TO_DATE(CONCAT(year_to_count, '-12-31'), '%Y-%m-%d');
  SET currentDate = start_date;
	
  CREATE TEMPORARY TABLE temp_months (
    fecha DATE
  );

  WHILE currentDate <= end_date DO
    INSERT INTO temp_months (fecha) VALUES (currentDate);
    SET currentDate = DATE_ADD(currentDate, INTERVAL 1 MONTH);
  END WHILE;


  SELECT
    b.code AS Código_de_Libro,
    b.title AS Título,
    DATE_FORMAT(tm.fecha, '%m') AS Mes,
    DATE_FORMAT(tm.fecha, '%Y') AS Año,
    COUNT(l.id) AS Cantidad_de_Libros
  FROM
    Book b
  CROSS JOIN
    temp_months tm
  LEFT JOIN
    Loan l ON b.id = l.idBook AND
               YEAR(l.returnDate) = year_to_count AND  -- Ensure date format matches
               MONTH(l.returnDate) = MONTH(tm.fecha)
  GROUP BY
    b.id,
    Mes,
    Año
  ORDER BY
    Año ASC,
    Mes ASC,
    Código_de_Libro;

  DROP TEMPORARY TABLE IF EXISTS temp_months;
END //

DELIMITER ;
CALL ConteoRetirosPorMesEnAño(2021); -- Selecciono 2021 porque es cuando hay datos


/*Para cada lector, se debe visualizar cuál es su autor de preferencia (aquel autor que más libros ha retirado):
 Código de lector, nombre del lector, código de autor y autor.*/

SELECT 
	id_reader AS 'Código de lector',
    reader_name AS 'Nombre del lector',
    id_author AS 'Código de autor',
    author_name AS 'Autor'
FROM (
    SELECT 
		rb.id_reader,
        rb.reader_name,
        rb.id_author,
        rb.author_name,
        ROW_NUMBER() OVER(PARTITION BY rb.reader_name ORDER BY rb.cantidad DESC) AS row_num
    FROM (
        SELECT 
			r.id AS id_reader,
            CONCAT(r.lastName,', ',r.name) AS reader_name,
            a.id AS id_author,
            a.name AS author_name,
            COUNT(a.id) AS cantidad
        FROM
            Loan l
        JOIN reader r ON l.idReader = r.id
        JOIN book b ON b.id = l.idBook
        JOIN bookauthor ba ON ba.idBook = b.id
        JOIN author a ON a.id = ba.idAuthor
        GROUP BY a.name, r.name
    ) AS rb
) AS ranked
WHERE row_num = 1;




