<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Image_model extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    function get_info($imageID)
	{
		$query = $this->db->get_where('images', array('ID' => $imageID));
		$result = $query->row();
		return $result;
	}

	function add($data)
	{
		$this->db->insert('images',
            array(
                'filename' => $data['file_name'],
                'type' => 1,
                'folderID' => $data['folderID'],
                'title' => 'Untitled'
            ));
        $imageID = $this->db->insert_id();

        //Create title of added image
        $this->db->where('ID', $imageID);
		$this->lang->load('names_lang', 'english');
		$image_name = $this->lang->line('image');
		$this->db->update('images', array('title' => $image_name.' '.$imageID));

        return $imageID;
	}

	function add_folder($data)
	{
        $data['filename'] = 'folder.png';
        $data['type'] = 2;
		$this->db->insert('images', $data);
        return $this->db->insert_id();
	}

	function get_all_images($folderID)
	{
        $this->db->order_by('type', 'DESC');
        $this->db->where('folderID', $folderID);
		$query = $this->db->get('images');
		$result = $query->result_array();
		return $result;
	}

	function get_all_attachments($folderID)
	{
        $this->db->order_by('type', 'DESC');
        $this->db->where('original_folderID', $folderID);
		$query = $this->db->get('images');
		$result = $query->result_array();
		return $result;
	}
    //Use by Image Manager----------------------------------------------
	function delete_image($imageID)
	{
		$this->db->where('ID', $imageID);
		$this->db->delete('images');
	}
    function check_view_link($imageID)
    {
		$this->db->select('ID, name, title');
        $query = $this->db->get_where('views', array('icon' => $imageID));
		$result = $query->result_array();
		return $result;
    }
	//------------------------------------------------
	function update_image($data)
	{
		$this->db->where('ID', $data['ID']);
		$result = $this->db->update('images', $data);
        return $result;
	}

}
