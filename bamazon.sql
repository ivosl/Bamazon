DROP DATABASE IF EXISTS bamazonDB;
create database bamazonDB;
use bamazonDB;
CREATE TABLE products (
    id INT NOT NULL AUTO_INCREMENT,
    product_name varchar (100) NOT NULL,
    department_name VARCHAR(50) NULL,
    price decimal(10,2) NULL,
    stock_quantity int NULL,
    PRIMARY KEY (id)
);
SELECT * FROM bamazonDB.products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
Values ("GoPro Hero5",  "Electronics", 299.50, 15), ("Rose Water",  "Beauty", 11.95, 30),
	   ("Probiotic",  "Health", 17, 50), ("Bead Bracelets",  "Jewelry", 15.99, 15),
       ("Day Cream",  "Beauty", 12.50, 25), ("Javascript for Kids",  "Books", 17, 31), 
       ("Forrest Gump",  "DVD", 11, 24), ("Goggles",  "Sports", 17, 5), 
       ("Samsonite Carry-on",  "Luggage", 95, 15), ("Yoga Mat",  "Sports", 30, 50)