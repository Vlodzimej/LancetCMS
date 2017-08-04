<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Timeline_model extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }
	function get($name)
	{
		$query = $this->db->get_where('timelines', array('name' => $name));
		$result = $query->row();
		return $result;
	}

    function get_array()
	{
		$query = $this->db->get('timelines');
		$result = $query->result_array();
		return $result;
	}

    function get_list()
	{
        $this->db->select('ID, name, title');
		$query = $this->db->get('timelines');
		$result = $query->result_array();
		return $result;
	}

	function add($data)
	{
		$this->db->insert('timelines',
            array(
                'name' => $data['name'],
                'title' => $data['title'],
                'userID' => 0,
                'content' => '{}'
            ));

        $timelineID = $this->db->insert_id();

        return $timelineID ;

	}

	function update($data)
	{
		$this->db->where('ID', $data['ID']);
		$result = $this->db->update('timelines', $data);
        return $result;
	}
	function delete($name)
	{
		$this->db->where('name', $name);
		$this->db->delete('timelines');
	}
}
