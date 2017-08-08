<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Database extends CI_Controller {
    function query()
    {
        $this->load->model('Database_model');
        $query_string = $this->input->post('query');
        $query = $this->Database_model->SQL_Query($query_string);
        echo json_encode($query);
    }
}