DROP TABLE IF EXISTS pictures;

CREATE TABLE pictures(
    id SERIAL PRIMARY KEY,
    picture VARCHAR NOT NULL CHECK (picture != ''),
    user_id INT NOT NULL REFERENCES users(id)
);
