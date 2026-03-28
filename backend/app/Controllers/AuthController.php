<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use Config\Database;
use App\Models\AuthUserModel;
use App\Models\TeacherModel;
use Firebase\JWT\JWT;

class AuthController extends ResourceController
{
    public function register()
    {
        $db = Database::connect();
        $db->transStart();

        $userModel    = new AuthUserModel();
        $teacherModel = new TeacherModel();

        $data = $this->request->getJSON(true);
        if (empty($data)) {
            $data = $this->request->getPost();
        }

        if (
            empty($data['email']) ||
            empty($data['first_name']) ||
            empty($data['last_name']) ||
            empty($data['password'])
        ) {
            return $this->fail('All required fields must be filled');
        }

        if ($userModel->where('email', $data['email'])->first()) {
            return $this->fail('Email already exists');
        }

        $userData = [
            'email'      => strtolower(trim($data['email'])),
            'first_name' => trim($data['first_name']),
            'last_name'  => trim($data['last_name']),
            'password'   => password_hash($data['password'], PASSWORD_BCRYPT),
            'phone'      => $data['phone'] ?? null,
        ];

        $userModel->insert($userData);
        $userId = $userModel->getInsertID();

        $teacherData = [
            'user_id'         => $userId,
            'university_name' => $data['university_name'] ?? null,
            'gender'          => $data['gender'] ?? null,
            'year_joined'     => $data['year_joined'] ?? null,
            'subject'         => $data['subject'] ?? null,
            'bio'             => $data['bio'] ?? null,
        ];

        $teacherModel->insert($teacherData);

        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->fail('Something went wrong');
        }

        return $this->respondCreated([
            'status'  => true,
            'message' => 'User registered successfully',
        ]);
    }

    public function login()
    {
        $userModel = new AuthUserModel();

        $data = $this->request->getJSON(true);
        if (empty($data)) {
            $data = $this->request->getPost();
        }

        if (empty($data['email']) || empty($data['password'])) {
            return $this->fail('Email and Password required');
        }

        $user = $userModel->findByEmail($data['email']);

        if (!$user) {
            return $this->fail('User not found');
        }

        if (!password_verify($data['password'], $user['password'])) {
            return $this->fail('Invalid password');
        }

        $secret = getenv('JWT_SECRET_KEY') ?: 'teachportal_secret_key_2026';

        $payload = [
            'iss'     => 'teachportal',
            'sub'     => $user['id'],
            'email'   => $user['email'],
            'iat'     => time(),
            'exp'     => time() + (60 * 60 * 24),
        ];

        $token = JWT::encode($payload, $secret, 'HS256');

        return $this->respond([
            'status'  => true,
            'message' => 'Login successful',
            'token'   => $token,
            'user'    => [
                'id'         => $user['id'],
                'email'      => $user['email'],
                'first_name' => $user['first_name'],
                'last_name'  => $user['last_name'],
            ],
        ]);
    }

    public function profile()
    {
        return $this->respond([
            'status'  => true,
            'message' => 'Protected route working',
        ]);
    }
}
