<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Table_model extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }
	function get_row($table, $ID)
	{
		$query = $this->db->get_where($table, array('ID' => $ID));
		$result = $query->row();
        return $result;
	}

	function update_row($data)
	{
		$this->db->where('ID', $data['ID']);
		$result = $this->db->update($data['table'], array( $data['field'] => $data['value']));
        return $result;
	}

}
