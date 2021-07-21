/* Data base commands */
CREATE DATABASE healthInsurance;
CREATE TABLE Users(
    userid INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE DctHs(  
    dcthsid SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone NOT NULL,
    state VARCHAR(255),
    city VARCHAR(255),
    Price INT
);
CREATE TABLE VisitList(
    dcthsid BIGSERIAL PRIMARY KEY,
    userid INT REFERENCES Users(userid) ON DELETE CASCADE,
    dataCreated TIMESTAMP
);
CREATE TABLE Claims(
    claimid BIGSERIAL PRIMARY KEY,
    userid uuid REFERENCES Users(userid) ON DELETE CASCADE,
    dcthsid BIGINT REFERENCES DctHs(dcthsid) ON DELETE CASCADE,
    price INT,
);
