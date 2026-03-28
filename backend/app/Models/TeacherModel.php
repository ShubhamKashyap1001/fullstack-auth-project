<?php

namespace App\Models;

use CodeIgniter\Model;

class TeacherModel extends Model
{
    protected $table      = 'teachers';
    protected $primaryKey = 'id';
    protected $returnType = 'array';

    protected $allowedFields = [
        'user_id',
        'university_name',
        'gender',
        'year_joined',
        'subject',
        'bio',
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    protected $validationRules = [
        'user_id'         => 'required|integer|is_unique[teachers.user_id]',
        'university_name' => 'required|max_length[255]',
        'gender'          => 'required|in_list[male,female,other]',
        'year_joined'     => 'required|integer|greater_than[1900]',
    ];

    public function getWithUser(int $teacherId): ?array
    {
        return $this->db->table('teachers t')
            ->select('t.id, t.user_id, t.university_name, t.gender, t.year_joined,
                      t.subject, t.bio, t.created_at,
                      u.email, u.first_name, u.last_name, u.phone')
            ->join('auth_user u', 'u.id = t.user_id')
            ->where('t.id', $teacherId)
            ->get()
            ->getRowArray();
    }

    public function getAllWithUsers(): array
    {
        return $this->db->table('teachers t')
            ->select('t.id, t.user_id, t.university_name, t.gender, t.year_joined,
                      t.subject, t.bio, t.created_at,
                      u.email, u.first_name, u.last_name, u.phone')
            ->join('auth_user u', 'u.id = t.user_id')
            ->orderBy('t.id', 'DESC')
            ->get()
            ->getResultArray();
    }
}
