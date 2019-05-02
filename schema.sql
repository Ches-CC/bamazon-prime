DROP DATABASE IF EXISTS bamazon_primep;

CREATE DATABASE bamazon_prime;

USE bamazon_prime;

CREATE TABLE products (
	item_id INTEGER AUTO_INCREMENT NOT NULL,
    product_name VARCHAR (50) NOT NULL,
    dept_name VARCHAR (50) NOT NULL,
    price decimal (7,2),
    stock_quantity INTEGER NOT NULL,
    PRIMARY KEY (item_id)
);

SELECT * FROM products;
