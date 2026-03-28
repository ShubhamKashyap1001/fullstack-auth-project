<?php

namespace App\Models;

use CodeIgniter\Model;

class AuthUserModel extends Model
{
    protected $table      = 'auth_user';
    protected $primaryKey = 'id';
    protected $returnType = 'array';

    protected $allowedFields = [
        'email',
        'first_name',
        'last_name',
        'password',
        'phone',
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    protected $validationRules = [
        'email'      => 'required|valid_email|max_length[191]|is_unique[auth_user.email]',
        'first_name' => 'required|min_length[2]|max_length[100]',
        'last_name'  => 'required|min_length[2]|max_length[100]',
        'password'   => 'required|min_length[6]',
    ];

    protected $validationMessages = [
        'email' => [
            'is_unique' => 'This email is already registered.',
        ],
    ];

    protected $hidden = ['password'];

    public function findByEmail(string $email): ?array
    {
        return $this->select('id, email, first_name, last_name, password, phone, created_at')
                    ->where('email', strtolower(trim($email)))
                    ->first();
    }
}
