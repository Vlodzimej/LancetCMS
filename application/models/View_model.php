<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class View_model extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    function load_view($name)
    {
        $query = $this->db->get_where('views', array('name' => $name));
        $result = $query->row();
        return $result;
    }

    function load_all_views()
    {
        $query = $this->db->get('views');
        $result = $query->result_array();
        return $result;
    }

    function load_archive_view($ID)
    {
        $query = $this->db->get_where('a_views', array('ID' => $ID));
        $result = $query->row();
        return $result;
    }

    function load_archive_views($name)
    {
        $query = $this->db->get_where('a_views', array('name' => $name));
        $result = $query->result_array();
        return $result;
    }

    function load_launcher_data($name)
    {
        $this->db->select('icon');
        $query = $this->db->get_where('views', array('name' => $name, 'launcher' => TRUE));
        $result = $query->row();
        return $result;
    }

    //When system loading-----------------------------------------------
    function load_launcher_list()
    {
        //Get type of authorized account
        $account_access_level = $this->session->userdata('account_access_level');
        //If there is no authorized user
        if (!$account_access_level ||
            $account_access_level < 0 ||
            $account_access_level == NULL) $account_access_level = 0;

        $this->db->select('name');
        //Compare with the user's access level and select the Views with a lower or equal access level
        $this->db->where('access_level <=', $account_access_level);

        $query = $this->db->get_where('views', array('launcher' => TRUE));
        $result = $query->result_array();
        return $result;
    }

    //Use by Views Plant------------------------------------------------
    function add_view($data)
    {
        $this->db->insert('views', $data);
    }
    //Use by Views Plant------------------------------------------------
    //For update several fields
    function update_view($data)
    {
        $this->db->where('name', $data['name']);
        $result = $this->db->update('views', $data);
        return $result;
    }
    //Use by Views Plant------------------------------------------------
    //Make copy of current version and update all data
    function save_view($data)
    {
        //Save current copy of View
        $query = $this->db->get_where('views', array('name' => $data['name']));
        $a_view = $query->row();
        $a_view->ID = NULL;
        $this->db->insert('a_views', $a_view);

        //Update data of View
        $this->db->where('name', $data['name']);
        $result = $this->db->update('views', $data);
        return $result;
    }

    //Use by Views Plant------------------------------------------------
    function delete_view($name)
    {
        $this->db->where('name', $name);
        $this->db->delete('views');
    }

    function get_all_imageID()
    {
        $this->db->select('icon');
        $query = $this->db->get('views');
        $result = $query->result_array();
        return $result;
    }

}
