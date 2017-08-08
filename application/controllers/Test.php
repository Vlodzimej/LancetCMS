<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Test extends CI_Controller
{
    public function id($unit_id)
    {
        $this->load->model('Test_model');
        $result = $this->Test_model->get_unit($unit_id);
        echo json_encode($result);
    }

    public function all()
    {
        $this->load->model('Test_model');
        $result = $this->Test_model->get_all_units();
        echo json_encode($result);
    }

}