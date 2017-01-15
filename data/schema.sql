drop table if exists libraries;
create table libraries (
    id INTEGER PRIMARY KEY,
    address TEXT,
    lat FLOAT,
    lng FLOAT,
    box_lat FLOAT,
    box_lng FLOAT,
    verified INTEGER,
    lfl_no TEXT,
    size_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_ip TEXT,
    updated_ip TEXT,

    UNIQUE (address),
    UNIQUE (lfl_no),
    UNIQUE (lat, lng),

    FOREIGN  KEY(size_id) REFERENCES sizes(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

drop table if exists library_images;
create table library_images (
    id INTEGER PRIMARY KEY,
    library_id INTEGER,
    file_name TEXT,
    quality INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_ip TEXT,
    updated_ip TEXT,

    FOREIGN  KEY(library_id) REFERENCES library(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


drop table if exists library_tags;
create table library_tags (
    id INTEGER PRIMARY KEY,
    library_id INTEGER,
    name    TEXT,

    FOREIGN  KEY(library_id) REFERENCES library(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

drop table if exists sizes;
create table sizes (
    id INTEGER PRIMARY KEY,
    name    TEXT
);


insert into sizes (name) values('small'), ('medium'), ('large');

