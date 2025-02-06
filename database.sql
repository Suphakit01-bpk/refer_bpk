CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    hospital_at VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    role VARCHAR(50),
    created_date DATE,
    created_time TIME,
    gender VARCHAR(10),
    last_login TIMESTAMP,
    status VARCHAR(20)
);
