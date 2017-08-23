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
    public function unit_list()
    {
        $this->load->model('Test_model');
        $result = $this->Test_model->get_unit_list();
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
    public function finish()
    {
        $actions = $this->input->post('actions');
        $process_id = $this->input->post('processID');
        $unit_id = $this->input->post('unitID');

        $this->load->model('Test_model');
        $this->Test_model->add_actions($actions);

        $result = $this->Test_model->finish_process($process_id, $unit_id);

        echo $result;
    }

    //POST
    public function imageadding()
    {
        $image_id = $this->input->post('imageID');
        $unit_id = $this->input->post('unitID');
        $question_id = $this->input->post('questionID');

        $data = array('image_ID' => $image_id, 'unit_ID' => $unit_id, 'question_ID' => $question_id);

        $this->load->model('Test_model');
        $imageID = $this->Test_model->add_image($data);
    }

    //POST
    public function imageremoving()
    {
        $image_id = $this->input->post('imageID');
        $this->load->model('Test_model');
        $imageID = $this->Test_model->delete_image($image_id);
    }


    //SECTION:
    //Functions for changer answer properties---------------------------------------------------------------------------

    //POST
    //Change 'correct' field if someone answer had been changed in Test Manager
    public function answermark()
    {
        $correct = $this->input->post('correct');
        $answer_id = $this->input->post('answerID');
        $this->load->model('Test_model');

        if($correct == 'true')
            $correct = true;
        else
            $correct = false;

        //(Question ID, Field, Value)
        $result = $this->Test_model->update_answer($answer_id, 'correct', $correct);

        $question_type_changed = $this->Test_model->type_control($answer_id);

        echo $question_type_changed;
    }
    public function answervalue()
    {
        $value = $this->input->post('value');
        $answer_id = $this->input->post('answerID');
        $this->load->model('Test_model');

        $value = $action['value'] = mb_strtolower($value);

        //(Question ID, Field, Value)
        $result = $this->Test_model->update_answer($answer_id, 'value', $value);
        echo $result;
    }
    public function answercontent()
    {
        $content = $this->input->post('content');
        $answer_id = $this->input->post('answerID');
        $this->load->model('Test_model');

        //(Question ID, Field, Value)
        $result = $this->Test_model->update_answer($answer_id, 'content', $content);
        echo $result;
    }

    public function answeradding()
    {
        $question_id = $this->input->post('questionID');
        $this->load->model('Test_model');
        $result = $this->Test_model->add_empty_answer($question_id);
        echo $result;
    }

    public function answerdeleting()
    {
        $answer_id = $this->input->post('answerID');
        $this->load->model('Test_model');
        $result = $this->Test_model->delete_answer($answer_id);
        echo $result;
    }

    public function questiontitle()
    {
        $title = $this->input->post('title');
        $question_id = $this->input->post('questionID');
        $this->load->model('Test_model');

        //(Question ID, Field, Value)
        $result = $this->Test_model->update_question($question_id, 'title', $title);
        echo $result;
    }

    public function questioncontent()
    {
        $content = $this->input->post('content');
        $question_id = $this->input->post('questionID');
        $this->load->model('Test_model');

        //(Question ID, Field, Value)
        $result = $this->Test_model->update_question($question_id, 'content', $content);
        echo $result;
    }

    public function questiontype()
    {
        $type = $this->input->post('type');
        $question_id = $this->input->post('questionID');
        $this->load->model('Test_model');

        //(Question ID, Field, Value)
        $result = $this->Test_model->update_question($question_id, 'type', $type);
        echo $result;
    }
    public function questionadding()
    {
        $unit_id = $this->input->post('unitID');
        $this->load->model('Test_model');
        $result = $this->Test_model->add_empty_question($unit_id);
        echo $result;
    }

    public function questiondeleting()
    {
        $question_id = $this->input->post('questionID');
        $this->load->model('Test_model');
        $result = $this->Test_model->delete_question($question_id);
        echo $result;
    }

    public function unitdescription()
    {
        $description = $this->input->post('description');
        $unit_id = $this->input->post('unitID');
        $this->load->model('Test_model');

        //(Question ID, Field, Value)
        $result = $this->Test_model->update_unit($unit_id, 'description', $description);
        echo $result;
    }

    public function unittitle()
    {
        $title = $this->input->post('title');
        $unit_id = $this->input->post('unitID');
        $this->load->model('Test_model');

        //(Question ID, Field, Value)
        $result = $this->Test_model->update_unit($unit_id, 'title', $title);
        echo $result;
    }
    public function unitadding()
    {
        $this->load->model('Test_model');
         $unit_id = $this->Test_model->add_unit();
         echo $unit_id;
    }
    public function unitdeleting()
    {
        $unit_id = $this->input->post('unitID');
        $this->load->model('Test_model');
        $result = $this->Test_model->delete_unit($unit_id);
        echo $result;
    }

    public function all_groups()
    {
        $this->load->model('Test_model');
        $result = $this->Test_model->get_all_groups();
        echo json_encode($result);
    }


    public function group_list()
    {
        $this->load->model('Test_model');
        $result = $this->Test_model->get_group_list();
        echo json_encode($result);
    }
    //POST
    public function joing()
    {
        $account_id = $this->input->post('accountID');
        $group_id = $this->input->post('groupID');
        $this->load->model('Test_model');
        $result = $this->Test_model->join_group($account_id, $group_id);
        echo $result;
    }
    //GET
    public function group_by_account_id($account_id)
    {
        $this->load->model('Test_model');
        $result = $this->Test_model->get_group_by_account_id($account_id);
        echo json_encode($result);
    }

    public function group_adding()
    {
        $title = $this->input->post('title');
        $account_id = $this->input->post('accountID');
        $this->load->model('Test_model');
        $result = $this->Test_model->add_group($title, $account_id);
        echo $result;
    }

    public function group_deleting()
    {
        $group_id = $this->input->post('groupID');
        $this->load->model('Test_model');
        $result = $this->Test_model->delete_group($group_id);
        echo $result;
    }

    //GET
    public function processes()
    {
        $surname = $this->input->get('surname');
        $firstname = $this->input->get('firstname');

        $group_id = $this->input->get('groupID');
        $unit_id = $this->input->get('unitID');

        $date = $this->input->get('date');

        $unfinished = $this->input->get('unfinished');

        $sort_field = $this->input->get('sortField');
        $sort_type = $this->input->get('sortType');

        $this->load->model('Test_model');
        $result = $this->Test_model->get_processes($surname, $firstname, $group_id, $unit_id, $date, $unfinished, $sort_field, $sort_type);
        echo json_encode($result);
    }

    public function check_group_join()
    {
        $account_id = $this->input->get('accountID');
        $this->load->model('Test_model');
        $result = $this->Test_model->get_group_by_account_id($account_id);
        if(count($result) > 0)
            echo $result['group_ID'];
        else
            echo 0;
    }
}