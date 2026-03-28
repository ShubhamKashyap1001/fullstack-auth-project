<?php

namespace App\Controllers;

use App\Models\AuthUserModel;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class UserController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $model = new AuthUserModel();

        $users = $model
            ->select('id, email, first_name, last_name, phone, created_at, updated_at')
            ->orderBy('id', 'DESC')
            ->findAll();

        return $this->respond([
            'status' => true,
            'count'  => count($users),
            'data'   => $users,
        ], ResponseInterface::HTTP_OK);
    }
}
