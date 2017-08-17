<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Test extends CI_Controller
{
    //GET
    public function unit($unit_id)
    {
        $this->load->model('Test_model');
        $result = $this->Test_model->get_unit($unit_id);
        echo json_encode($result);
    }
    //GET
    public function all()
    {
        $this->load->model('Test_model');
        $result = $this->Test_model->get_all_units();
        echo json_encode($result);
    }
    //GET
    public function process($process_id)
    {
        $this->load->model('Test_model');
        $result = $this->Test_model->get_process($process_id);
        echo json_encode($result);
    }

    //GET
    public function questions($unit_id)
    {
        $this->load->model('Test_model');
        $result = $this->Test_model->get_questions($unit_id);
        echo json_encode($result);
    }

    //GET
    public function question($question_id)
    {
        $this->load->model('Test_model');
        $result = $this->Test_model->get_question($question_id);
        echo json_encode($result);
    }

    //GET
    public function processlist()
    {
        $this->load->model('Test_model');
        $result = $this->Test_model->get_process_list();
        echo json_encode($result);
    }
    //GET

    public function processid($process_id)
    {
        $this->load->model('Test_model');
        $result = $this->Test_model->get_process($process_id);
        echo json_encode($result);
    }
/*
    //GET
    public function processes($unit_ID)
    {
        $this->load->model('Test_model');
        $result = $this->Test_model->get_processes_by_unit_id($unit_ID);
        echo json_encode($result);
    }
*/
    //POST
    public function start()
    {
        //Get data
        $unit_id = $this->input->post('unitID');
        $account_id = $this->input->post('accountID');
        $this->load->model('Test_model');

        //Get ID of new added process
        $result = $this->Test_model->add_new_process($account_id, $unit_id);
        //Send it to the JS
        echo $result;
    }
    //POST
    public function finish($process_id)
    {
        $actions = $this->input->post('actions');
        $this->load->model('Test_model');
        $this->Test_model->add_actions($actions);
        $result = $this->Test_model->finish_process($process_id);
        echo $result;
    }

    //POST
    public function add_image()
    {
        $image_id = $this->input->post('imageID');
        $unit_id = $this->input->post('unitID');
        $question_id = $this->input->post('questionID');

        $data = array('image_ID' => $image_id, 'unit_ID' => $unit_id, 'question_ID' => $question_id);

        $this->load->model('Test_model');
        $imageID = $this->Test_model->add_image($data);
    }
}