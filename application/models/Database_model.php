<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Database_model extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function SQL_Query($query_string)
    {
        $query = $this->db->query($query_string);

        if(!$query) {
            return $this->db->error();
        } else {
            if(is_bool($query))
                return true;
            else
                return $query->result();
        }
    }
}