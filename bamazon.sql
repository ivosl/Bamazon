create database bamazonDB;
use bamazonDB;
CREATE TABLE products (
    id INT NOT NULL AUTO_INCREMENT,
    product_name varchar (100) NOT NULL,
    department_name VARCHAR(50) NULL,
    price decimal(10,4) NULL,
    stock_quantity int NULL,
    PRIMARY KEY (id)
);
SELECT * FROM bamazonDB.products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
Values ("Go-pro 5",  "Electronics", 350, 10), ("Rose Water",  "Beauty", 11.99, 25)