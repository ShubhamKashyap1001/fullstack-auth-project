<?php

use CodeIgniter\Router\RouteCollection;

$routes->get('/', 'Home::index');

$routes->options('api/(:any)', function () {
    return response()->setStatusCode(200);
});

$routes->post('api/register', 'AuthController::register');
$routes->post('api/login',    'AuthController::login');

$routes->get('api/users',     'UserController::index',     ['filter' => 'jwt']);
$routes->get('api/teachers',  'TeacherController::index',  ['filter' => 'jwt']);
$routes->post('api/teacher',  'TeacherController::create', ['filter' => 'jwt']);
$routes->get('teachers', 'TeacherController::getTeachers');
