# How to build this project
```
$ cd backend && sudo chown -R $USER:www-data . 
$ docker-compose build
$ docker-compose up
$ docker-compose exec backend php artisan migrate
$ docker-compose exec backend php artisan passport:install
```
You can now access the server at http://localhost:8080
