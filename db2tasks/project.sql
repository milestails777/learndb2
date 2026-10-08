create table users
(
    id         bigint unsigned auto_increment
        primary key,
    name       varchar(1024)                        not null,
    birth_date date                                 null,
    email      varchar(254)                         not null,
    password   varchar(2048)                        not null,
    created_at datetime default current_timestamp() not null,
    updated_at datetime default current_timestamp() not null on update current_timestamp(),
    constraint users_pk_2
        unique (email)
);

create table posts
(
    id      bigint unsigned auto_increment
        primary key,
    user_id bigint unsigned not null,
    constraint posts_users_id_fk
        foreign key (user_id) references users (id)
            on delete cascade
);


