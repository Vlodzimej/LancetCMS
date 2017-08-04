<?php if (!defined('BASEPATH')) exit('No direct script access allowed');
class Account_model extends CI_Model {

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    function check_login($login)
	{
		$query = $this->db->get_where('accounts', array('login' => $login));
		if($query->num_rows())
			return true;
	}

 	function check_password($email, $password)
	{
		$password = md5($password);
		$query = $this->db->get_where('accounts', array('email' => $email, 'password' => $password));
		if($query->num_rows())
			return true;
	}

	function check_email($email)
	{
		$query = $this->db->get_where('accounts', array('email' => $email));
		if($query->num_rows())
			return true;
	}

	function add_account($data)
	{
		$this->db->insert('accounts', $data);
		return $this->db->insert_id();
	}

    function get_user($email, $password)
    {
        $password = md5($password);
        $query = $this->db->get_where('users', array('email' => $email, 'password' => $password));
        return $query->row_array();
    }

    function get_user_by_id($ID)
    {
        $query = $this->db->get_where('users', array('ID' => $ID));
        return $query->row_array();
    }

    function get_user_by_email($email)
    {
        $query = $this->db->get_where('users', array('email' => $email));
        return $query->row_array();
    }

    function get_userdata($userID)
	{
        //$query = $this->db->get_where('users', array('ID' => $userID));

        $this->db->where('users.ID', $userID);
        $this->db->from('users');
        $this->db->join('user_types', 'user_types.ID = users.type');
        $this->db->join('user_statuses', 'user_statuses.ID = users.status');
        $this->db->join('images', 'images.ID = users.imageID');

        $query = $this->db->get();

        $result = $query->row();

        return $result;
	}

    function update_userdata($data)
    {
    	$this->db->set($data);
    	$this->db->where('ID', $data['ID']);
    	$result = $this->db->update('users');
    	return $result;
    }
    //Увеличение кол-ва баллов
    function increase_user_score($entryID, $score)
    {
        $this->db->select('userID');
        $this->db->where('ID', $entryID);
        $query = $this->db->get('entries');
        $entry = $query->row_array();

        $this->db->set('score', 'score+'.$score, FALSE);
        $this->db->where('ID', $entry['userID']);
        $this->db->update('users');
    }

    function change_user_status($userID, $status)
    {
        $this->db->set('status', $status);
        $this->db->where('ID', $userID);
        $this->db->update('users');
    }

    function set_password($userID, $password)
    {
        $this->db->set('password', $password);
        $this->db->where('ID', $userID);
        $this->db->update('users');
    }
    function set_password_by_email($email, $password)
    {
        $this->db->set('password', $password);
        $this->db->where('email', $email);
        $this->db->update('users');
    }
}
