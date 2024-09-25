DROP TABLE IF EXISTS Cars;
CREATE TABLE IF NOT EXISTS Cars (
    CarId INTEGER PRIMARY KEY AUTOINCREMENT,
    CarName TEXT,
    CarYearModel TEXT,
    CarPrice INTEGER
);

INSERT INTO Cars (CarName, CarYearModel, CarPrice) VALUES 
    ("Audi A6", "2011", 800),
    ("Audi S3", "2015", 450),
    ("Cadillac Escalade", "1999", 500),
    ("Kia Carens", "2022", 400),
    ("Kia Soul", "2020", 400),
    ("Mitsubishi Outlander", "2018", 450),
    ("Renault Kadjar", "2020", 250),
    ("Subaru Outback", "2020", 300),
    ("Volvo XC40", "2018", 800),
    ("VW Polo", "2022", 300)