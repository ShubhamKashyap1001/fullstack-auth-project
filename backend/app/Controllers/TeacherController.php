<?php

namespace App\Controllers;

use App\Models\AuthUserModel;
use App\Models\TeacherModel;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class TeacherController extends ResourceController
{
    protected $format = 'json';

    public function create()
    {
        $data = $this->request->getJSON(true);
        if (empty($data)) {
            $data = $this->request->getPost();
        }

        $rules = [
            'email'           => 'required|valid_email|is_unique[auth_user.email]',
            'first_name'      => 'required|min_length[2]|max_length[100]',
            'last_name'       => 'required|min_length[2]|max_length[100]',
            'password'        => 'required|min_length[6]',
            'phone'           => 'permit_empty|max_length[20]',
            'university_name' => 'required|max_length[255]',
            'gender'          => 'required|in_list[male,female,other]',
            'year_joined'     => 'required|integer|greater_than[1900]|less_than_equal_to[' . date('Y') . ']',
            'subject'         => 'permit_empty|max_length[150]',
            'bio'             => 'permit_empty',
        ];

        if (!$this->validate($rules)) {
            return $this->respond([
                'status'  => false,
                'message' => 'Validation failed.',
                'errors'  => $this->validator->getErrors(),
            ], ResponseInterface::HTTP_UNPROCESSABLE_ENTITY);
        }

        $db           = \Config\Database::connect();
        $userModel    = new AuthUserModel();
        $teacherModel = new TeacherModel();

        $db->transStart();

        $userData = [
            'email'      => strtolower(trim($data['email'])),
            'first_name' => trim($data['first_name']),
            'last_name'  => trim($data['last_name']),
            'password'   => password_hash($data['password'], PASSWORD_BCRYPT),
            'phone'      => $data['phone'] ?? null,
        ];

        $userId = $userModel->insert($userData);

        if (!$userId) {
            $db->transRollback();
            return $this->respond([
                'status'  => false,
                'message' => 'Failed to create user record.',
            ], ResponseInterface::HTTP_INTERNAL_SERVER_ERROR);
        }

        $teacherData = [
            'user_id'         => $userId,
            'university_name' => trim($data['university_name']),
            'gender'          => $data['gender'],
            'year_joined'     => (int) $data['year_joined'],
            'subject'         => $data['subject'] ?? null,
            'bio'             => $data['bio'] ?? null,
        ];

        $teacherId = $teacherModel->insert($teacherData);

        if (!$teacherId) {
            $db->transRollback();
            return $this->respond([
                'status'  => false,
                'message' => 'Failed to create teacher record.',
            ], ResponseInterface::HTTP_INTERNAL_SERVER_ERROR);
        }

        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->respond([
                'status'  => false,
                'message' => 'Transaction failed. Please try again.',
            ], ResponseInterface::HTTP_INTERNAL_SERVER_ERROR);
        }

        $user    = $userModel->find($userId);
        $teacher = $teacherModel->find($teacherId);
        unset($user['password']);

        return $this->respond([
            'status'  => true,
            'message' => 'Teacher and user created successfully.',
            'data'    => [
                'user'    => $user,
                'teacher' => $teacher,
            ],
        ], ResponseInterface::HTTP_CREATED);
    }

    public function index()
    {
        $db = \Config\Database::connect();

        $teachers = $db->table('teachers t')
            ->select('t.id, t.user_id, t.university_name, t.gender, t.year_joined, t.subject, t.bio,
                      t.created_at as teacher_created_at,
                      u.email, u.first_name, u.last_name, u.phone, u.created_at as user_created_at')
            ->join('auth_user u', 'u.id = t.user_id')
            ->orderBy('t.id', 'DESC')
            ->get()
            ->getResultArray();

        return $this->respond([
            'status' => true,
            'count'  => count($teachers),
            'data'   => $teachers,
        ], ResponseInterface::HTTP_OK);
    }
}
