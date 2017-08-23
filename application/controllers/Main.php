<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Main extends CI_Controller {


	public function index()
	{
		$this->load->view('main');
		$this->load->helper('url');
	}

	public function table_row($table, $ID)
	{
		$this->load->model('Table_model');
		$result = $this->Table_model->get_row($table, $ID);
            if($result) echo json_encode($result);
	}

	public function update_table_row()
	{
		$data = $this->input->post('data');
		$this->load->model('Table_model');
		$result = $this->Table_model->update_row($data);
        echo $result;
	}
//------------------------------------------------------------------------------------
//VIEWS FUNCTIONS
//------------------------------------------------------------------------------------

	//------------------------------------------------------------------------------------
	//Load data of View from DB
	//------------------------------------------------------------------------------------
	/*
	public function load_view($name)
	{
		$this->load->model('View_model');
		$view = $this->View_model->load_view($name);
		if($view) echo $view->object;
	}
	*/

	//------------------------------------------------------------------------------------
	//Load data of View from DB
	//------------------------------------------------------------------------------------
	public function load_view($name)
	{
		$this->load->model('View_model');
		$view = $this->View_model->load_view($name);
		if($view) echo json_encode($view);
	}
	//------------------------------------------------------------------------------------
	//Load list of Views which have 'launcher' = true
	//------------------------------------------------------------------------------------
	public function get_all_views()
	{
		$this->load->model('View_model');
		$list = $this->View_model->load_all_views();
			echo json_encode($list);
	}

	//------------------------------------------------------------------------------------
	//Load data of View for create Launcher
	//------------------------------------------------------------------------------------
	public function get_launcher_data($name)
	{
		$this->load->model('View_model');
		$launcher = $this->View_model->load_launcher_data($name);
		if($launcher)
			echo json_encode($launcher);
	}
	//------------------------------------------------------------------------------------
	//Load list of Views which have 'launcher' = true
	//------------------------------------------------------------------------------------
	public function get_launcher_list()
	{
		$this->load->model('View_model');
		$list = $this->View_model->load_launcher_list();
			echo json_encode($list);
	}
	//------------------------------------------------------------------------------------
	//Get text message from lang/'language'_lang.php
	//------------------------------------------------------------------------------------
	public function get_error_message($message_key)
	{
		//$idiom = $this->session->get_userdata('language');
		$this->lang->load('error_messages_lang', 'english');
		echo $this->lang->line($message_key);
	}
	//------------------------------------------------------------------------------------
	//Get text message from language/'language'_lang.php
	//------------------------------------------------------------------------------------
	public function get_message($key)
	{
		//$idiom = $this->session->get_userdata('language');
		$this->lang->load('messages_lang', 'english');
		echo $this->lang->line($key);
	}
	//------------------------------------------------------------------------------------
	//Get text string from language/'language'/strings_lang.php
	//------------------------------------------------------------------------------------
	public function get_string($key)
	{
		//$idiom = $this->session->get_userdata('language');
		$this->lang->load('strings_lang', 'english');
		echo $this->lang->line($key);
	}
	//------------------------------------------------------------------------------------
	//Load list of archive Views
	//------------------------------------------------------------------------------------
	public function get_archive_views($name)
	{
		$this->load->model('View_model');
		$list = $this->View_model->load_archive_views($name);
			echo json_encode($list);
	}
	//------------------------------------------------------------------------------------
	//Load data of View from DB
	//------------------------------------------------------------------------------------
	public function load_archive_view($ID)
	{
		$this->load->model('View_model');
		$view = $this->View_model->load_archive_view($ID);
		if($view) echo json_encode($view);
	}
	public function add_view()
	{
		$data = $this->input->post('new_view_data');
		$this->load->model('View_model');
		$this->View_model->add_view($data);
	}

	public function update_view()
	{
		$data = $this->input->post('new_view_data');
		$this->load->model('View_model');
		$result = $this->View_model->update_view($data);
        echo $result;
	}

	public function save_view()
	{
		$data = $this->input->post('new_view_data');
		$this->load->model('View_model');
		$result = $this->View_model->save_view($data);
        echo $result;
	}

	public function delete_view($name)
	{
		$this->load->model('View_model');
		$this->View_model->delete_view($name);
	}


	public function content()
	{
		$this->load->helper('file');
		$filename = $this->input->get('filename');
		echo read_file(base_url().$filename);
	}
//------------------------------------------------------------------------------------
//IMAGES FUNCTIONS
//------------------------------------------------------------------------------------
    public function upload_file()
    {
        $config['upload_path']      = './uploads/';
        $config['allowed_types']    = 'gif|jpg|png|';
        $config['max_size']         = 100;
        $config['max_width']        = 1024;
        $config['max_height']       = 768;

        $this->load->library('upload' , $config);

        if( ! $this->upload->do_upload('userfile'))
        {
            //$error = array('error' => $this->upload->display_errors());

            echo $this->upload->display_errors();
        }
        else
        {
            //$data = array('upload_data' => $this->upload->data());

            //$this->load->view('upload_success, $data);
            echo $this->upload->data();
        }
    }

    public function get_image_content($imageID)
    {
        $filename = $this->image_filename($imageID);
        $data = file_get_contents('/images/'.$filename);
        header("Content-type: image/png");
        echo $data;
    }

    public function get_image_filename($imageID)
    {
        $data = $this->image_info($imageID);
        echo $data->filename;
    }

    public function image_filename($imageID)
    {
        $data = $this->image_info($imageID);
        return $data->filename;
    }

    public function image_info($imageID)
    {
        $this->load->model('Image_model');
        $data = $this->Image_model->get_info($imageID);
        return $data;
    }

    public function get_image_info($imageID)
    {
        echo json_encode($this->image_info($imageID));
    }

    public function upload_image()
    {
        $folderID = $this->input->post('folderID');

        $config['upload_path'] = "images/";
        $config['allowed_types'] = "jpg|jpeg|png|gif";
        $config['max_size'] = 10000;
        $config['encrypt_name'] = TRUE;

        $this->load->library('upload', $config);

        if (!$this->upload->do_upload()) {
            $error = array('error' => $this->upload->display_errors());
            echo json_encode($error);
        } else {

            $data = $this->upload->data();

            $data['folderID'] = $folderID;

            $this->load->model('Image_model');
            $imageID = $this->Image_model->add($data);

            $data['imageID'] = $imageID;

            echo json_encode($data);
        }
    }
	//------------------------------------------------------------------------------------
	//
	//------------------------------------------------------------------------------------
    public function get_image_list($folderID)
	{
		$result = $this->image_list($folderID);
        echo json_encode($result);
	}

    //For PHP
    public function image_list($folderID)
	{
		$this->load->model('Image_model');
		$result = $this->Image_model->get_all_images($folderID);
        return $result;
	}

    //AJAX
    public function get_images_link_views()
    {
        $this->load->model('View_model');
        $result = $this->View_model->get_all_imageID();
        echo json_encode($result);
    }

    public function delete_image($imageID)
	{
    	$this->load->model('Image_model');

        $image = $this->Image_model->get_info($imageID);

        $filename = './images/'.$this->image_filename($imageID);

        //Check existing of file and type of entry
        //Types 2 and 3 are folders so the image file will not removed.

        if( file_exists($filename) && $image->type != 2 && $image->type != 3){
            if( unlink($filename) ){
                //Remove the entry from database if file has been deleted
                $this->Image_model->delete_image($imageID);
                echo 1;
            } else {
                echo 'error_access_denied';
            }
        } else {
            $this->Image_model->delete_image($imageID);
            echo 'error_image_link_removed';
        }

        //If it is folder delete all attachment entries
        if( $image->type == 2 || $image->type == 3)
        {
            $attachments = $this->Image_model->get_all_attachments($image->ID);
            foreach($attachments as $entry)
            {
                $this->delete_image($entry['ID']);
            }
        }
	}

    public function put_image_recycle($imageID)
    {
        $this->load->model('Image_model');

        $image = $this->image_info($imageID);

        $data = array('ID' => $imageID, 'folderID' => '11', 'original_folderID' => $image->folderID);
        $this->Image_model->update_image($data);

        //If it is folder delete all attachment entries
        if( $image->type == 2 || $image->type == 3)
        {
            $attachments = $this->image_list($image->ID);

            foreach($attachments as $entry)
            {
                $this->put_image_recycle($entry['ID']);
            }
        }
    }

    public function image_link($imageID)
    {
        $this->load->model('Image_model');
        $view = $this->Image_model->check_view_link($imageID);
        echo json_encode($view);
    }
    public function change_image_title()
    {
        $imageID = $this->input->post('imageID');
        $title = $this->input->post('title');
        $data = array('ID' => $imageID, 'title' => $title);
        $this->load->model('Image_model');
        if( $this->Image_model->update_image($data) ) {
            echo 1;
        } else {
            echo 'error_image_update';
        }
    }
	public function add_folder()
	{
		$data = $this->input->post('data');
		$this->load->model('Image_model');
		$this->Image_model->add_folder($data);
	}

//------------------------------------------------------------------------------------
//TIMELINE FUNCTIONS
//------------------------------------------------------------------------------------

	public function timelines()
	{
		$this->load->model('Timeline_model');
		$result = $this->Timeline_model->get_array();
			echo json_encode($result);
	}

	public function timeline($name)
	{
		$this->load->model('Timeline_model');
		$result = $this->Timeline_model->get($name);
            echo json_encode($result);
	}

	public function timelines_list()
	{
		$this->load->model('Timeline_model');
		$result = $this->Timeline_model->get_list();
			echo json_encode($result);
	}

    public function add_timeline()
    {
		$name = $this->input->post('name');
		$title = $this->input->post('title');
        $data = array('name' => $name, 'title' => $title);
        $this->load->model('Timeline_model');
        $result = $this->Timeline_model->add($data);
        echo $result;
    }

    public function update_timeline()
    {
		$ID = $this->input->post('ID');
		$content = $this->input->post('content');
        $data = array('ID' => $ID, 'content' => $content);
        $this->load->model('Timeline_model');
        $result = $this->Timeline_model->update($data);
        echo $result;
    }

	public function delete_timeline()
	{
        $name = $this->input->post('name');
        $this->load->model('Timeline_model');
		$this->Timeline_model->delete($name);
	}
}