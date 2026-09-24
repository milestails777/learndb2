create table halls
(
    hall_id     int auto_increment
        primary key,
    name        varchar(50) not null,
    seats_count int         not null
);

create table movies
(
    movie_id         int auto_increment
        primary key,
    title            varchar(150) not null,
    description      text         null,
    duration_minutes int          not null,
    rating           varchar(10)  not null
);

create table news
(
    news_id   int auto_increment
        primary key,
    title     varchar(200) not null,
    content   text         not null,
    post_date date         not null
);

create table screenings
(
    screening_id int auto_increment
        primary key,
    movie_id     int      not null,
    hall_id      int      not null,
    start_time   datetime not null,
    price        int      not null,
    constraint `1`
        foreign key (movie_id) references movies (movie_id),
    constraint `2`
        foreign key (hall_id) references halls (hall_id)
);

create index hall_id
    on screenings (hall_id);

create index movie_id
    on screenings (movie_id);

create table users
(
    user_id    int auto_increment
        primary key,
    username   varchar(50)  not null,
    email      varchar(100) not null,
    password   varchar(50)  not null,
    first_name varchar(50)  not null,
    last_name  varchar(50)  not null,
    birth_date date         not null
);

create table bookings
(
    booking_id   int auto_increment
        primary key,
    user_id      int      not null,
    seat_number  int      not null,
    booking_date datetime not null,
    constraint `1`
        foreign key (user_id) references users (user_id)
);

create index user_id
    on bookings (user_id);

create table reviews
(
    review_id int auto_increment
        primary key,
    movie_id  int  not null,
    user_id   int  not null,
    stars     int  not null,
    text      text null,
    constraint `1`
        foreign key (movie_id) references movies (movie_id),
    constraint `2`
        foreign key (user_id) references users (user_id)
);

create index movie_id
    on reviews (movie_id);

create index user_id
    on reviews (user_id);

