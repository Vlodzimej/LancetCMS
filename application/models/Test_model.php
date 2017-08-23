<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Test_model extends CI_Model
{
    function Test_model()
    {
        // Call the Model constructor
        parent::__construct();

    }
    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function get_all_units()
    {
        $this->db->select('*');
        $this->db->select("DATE_FORMAT(test_units.date_create, '%d.%m.%Y') as date_create");
        $this->db->from('test_units');
        $query = $this->db->get();
        return $query->result();
    }

    public function get_unit_list()
    {
        $this->db->select('title, ID');
        $this->db->from('test_units');
        $query = $this->db->get();
        return $query->result();
    }

    public function get_process_list($unfinished = false)
    {
        $this->db->from('test_processes');
        $this->db->order_by('start', 'DESC');

        //Include unfinished test processes
        if(!$unfinished)
            $this->db->where('test_processes.finish !=', 'NULL');

        $this->db->select('test_processes.ID as process_ID, test_processes.start as start, test_processes.finish as finish ');
        $this->db->select('accounts.surname as surname, accounts.firstname as firstname');
        $this->db->select('test_units.title as title');
        $this->db->select("DATE_FORMAT(test_processes.start, '%d.%m.%y') as start");

        $this->db->join('test_units', 'test_units.ID = test_processes.unit_ID');
        $this->db->join('accounts', 'accounts.ID = test_processes.account_ID');

        $query = $this->db->get();
        return $query->result();
    }

    public function get_process($process_id)
    {
        //$query = $this->db->get('test_units');
        $this->db->where('test_processes.ID', $process_id);
        $this->db->from('test_processes');
        $this->db->join('test_units', 'test_units.ID = test_processes.unit_ID');
        //$this->db->join('test_actions', 'test_actions.process_ID = test_processes.ID');
        $this->db->join('accounts', 'accounts.ID = test_processes.account_ID');

        $this->db->select('test_processes.ID as process_ID, test_processes.start as start, test_processes.finish as finish');
        $this->db->select('accounts.surname as surname, accounts.firstname as firstname');
        $this->db->select('test_units.title as title, test_units.description as description, test_units.ID as unit_ID');

        $query = $this->db->get();
        $process = $query->row_array();

        //Get questions of current unit test
        $questions = $this->get_questions($process['unit_ID']);

        //Get user's actions
        $this->db->where('test_actions.process_ID', $process_id);
        $this->db->from('test_actions');
        $this->db->join('test_answers', 'test_answers.ID = test_actions.answer_ID');
        $this->db->select('test_actions.value as action_value');
        $this->db->select('test_answers.correct as correct, test_answers.question_ID as question_ID, test_answers.content as content, test_answers.value as value');
        $query = $this->db->get();
        $actions = $query->result_array();


        $correct_answer_count = 0;
        //Get and check user's actions
        foreach($questions as &$question)
        {
            //Get answers of current unit test
            $this->db->where(array('question_ID' => $question['ID'], 'correct' => '1'));
            $this->db->from('test_answers');
            $this->db->select('test_answers.content as content');
            $query = $this->db->get();
            $question['answers'] = $query->result_array();

            $question['actions'] = array();
            foreach($actions as &$action)
            {

                if($action['question_ID'] == $question['ID'])
                {
                    array_push($question['actions'], $action);

                    //Check answers and add the new value (completed) to the Question array

                    //Completed = true      - correct answer
                    //Completed = false     - incorrect answer
                    //Completed = undefined - answer is empty

                    $this->check_answer($question, $action);

                    unset($action);
                }
            }


            if(isset($question['completed']) && $question['completed'])
                $correct_answer_count++;
        }

        //Calculate total test time of this process
        $total_time = $this->calc_time($process['start'], $process['finish']);
        $process = array_merge($process, $total_time);

        //Get total number of questions
        $total_questions = count($questions);
        $process['total_questions'] = $total_questions;

        //Put number of correct answers
        $process['correct_answers'] = $correct_answer_count;

        //Percent of completion
        $process['completion'] = (int)($correct_answer_count*(100/$total_questions));

        //$process['start'] = date('d.m.y', );
        $process['start'] = $this->convert_date($process['start']);


        $result = array('process' => $process, 'questions' => $questions);
        return $result;
    }

    public function calc_correct_answers($process_id)
    {
        $query = $this->db->get_where('test_processes', array('ID' => $process_id));
        $process = $query->row_array();
        //Get questions of current unit test
        $questions = $this->get_questions($process['unit_ID']);

        //Get user's actions
        $this->db->where('test_actions.process_ID', $process_id);
        $this->db->from('test_actions');
        $this->db->join('test_answers', 'test_answers.ID = test_actions.answer_ID');
        $this->db->select('test_actions.value as action_value');
        $this->db->select('test_answers.correct as correct, test_answers.question_ID as question_ID, test_answers.content as content, test_answers.value as value');
        $query = $this->db->get();
        $actions = $query->result_array();

        $correct_answer_count = 0;
        //Get and check user's actions
        foreach($questions as &$question)
        {
            //Get answers of current unit test
            $this->db->where(array('question_ID' => $question['ID'], 'correct' => '1'));
            $this->db->from('test_answers');
            $this->db->select('test_answers.content as content');
            $query = $this->db->get();
            $question['answers'] = $query->result_array();

            $question['actions'] = array();
            foreach($actions as &$action)
            {

                if($action['question_ID'] == $question['ID'])
                {
                    array_push($question['actions'], $action);

                    //Check answers and add the new value (completed) to the Question array

                    //Completed = true      - correct answer
                    //Completed = false     - incorrect answer
                    //Completed = undefined - answer is empty

                    $this->check_answer($question, $action);

                    unset($action);
                }
            }

            if(isset($question['completed']) && $question['completed'])
                $correct_answer_count++;
        }
        return $correct_answer_count;
    }

    public function get_questions($unit_id)
    {
        //Get questions of current unit test
        $this->db->from('test_questions');
        $this->db->where('unit_ID', $unit_id);
        $query = $this->db->get();
        return $query->result_array();
    }

    //DD-MM-YYYY HH:MM:SS
    //Return time if $mode = true
    public function convert_date($datetime, $mode = false)
    {
        $array = explode(' ', $datetime);

        //Convert date
        $array[0] = explode('-', $array[0]);
        $date = $array[0][2].'.'.$array[0][1].'.'.$array[0][0];

        //Convert time
        $array[1] = explode(':', $array[1]);
        $time = $array[1][0].':'.$array[1][1];

        if($mode)
            return $time;           //Return time
        else
            return $date;           //Return date

    }

    public function check_answer(&$question, &$action)
    {
        if(!isset($question['completed']) || $question['completed'] == true) {
            switch($question['type'])
            {
                //Single and multiple check
                case 1:
                case 2:
                    if($action['correct'])
                        $question['completed'] = true;
                    else
                        $question['completed'] = false;
                    break;

                //String check
                case 3:
                    if($action['action_value'] == $action['value'])
                        $question['completed'] = true;
                    else
                        $question['completed'] = false;
                    break;
            }
        }
    }

    //Calculate total test time of process------------------------------------------------------------------------------

    public function calc_time($start, $finish)
    {
        $diff = strtotime($finish) - strtotime($start);

        //If testing hadn't been finished
        if($diff < 0) return array('total_time_min' => '00', 'total_time_sec' => '00');

        $total_time_sec = 0;
        $total_time_min = 0;

        if($diff > 59)
        {
            $total_time_min = floor($diff / 60);
            $total_time_sec = $diff - $total_time_min*60;
        } else {
            $total_time_sec = $diff;
        }
        if($total_time_min < 10) $total_time_min = '0'.$total_time_min;
        if($total_time_sec < 10) $total_time_sec = '0'.$total_time_sec;

        return array('total_time_min' => $total_time_min, 'total_time_sec' => $total_time_sec);
    }

    public function get_question($question_id)
    {
        $this->db->from('test_questions');
        $this->db->where('ID', $question_id);
        $query = $this->db->get();
        $question = $query->row_array();

        $this->db->from('test_answers');
        $this->db->where('question_ID', $question_id);
        $query = $this->db->get();
        $answers = $query->result_array();

        //Get all images for current question
        $this->db->where('test_images.question_ID', $question_id);
        $this->db->from('test_images');
        $this->db->join('images', 'images.ID = test_images.image_ID');
        $query = $this->db->get();
        $images = $query->result_array();

        $new_array = array('answers' => $answers, 'images' => $images);
        $question = array_merge($question, $new_array);

        return $question;
    }

    public function get_unit($unit_id)
    {
        //Get current unit data
        $this->db->where('ID', $unit_id);
        $this->db->from('test_units');
        $this->db->select('test_units.*');
        $this->db->select("DATE_FORMAT(test_units.date_create, '%d.%m.%y') as date_create");
        $this->db->select("DATE_FORMAT(test_units.date_update, '%d.%m.%y %h:%m') as date_update");
        $query = $this->db->get();
        $unit = $query->row();

        //Get all questions of current unit
        $query = $this->db->get_where('test_questions', array('unit_ID' => $unit_id));
        $questions = $query->result_array();

        //Get all images for current unit
        $this->db->where('test_images.unit_ID', $unit_id);
        $this->db->from('test_images');
        $this->db->join('images', 'images.ID = test_images.image_ID');

        $query = $this->db->get();
        $images = $query->result_array();

        //Form new data array of questions and answers
        foreach($questions as &$question)
        {
            //Put images into the question array
            $question['images'] = array();
            foreach($images as &$image)
            {
                if($image['question_ID'] == $question['ID'])
                {
                    array_push($question['images'], $image);
                    unset($image);
                }
            }

            //Get all answers of current question
            $query = $this->db->get_where('test_answers', array('question_ID' => $question['ID']));
            $answers = $query->result_array();

            //Delete critical values from answer array
            foreach($answers as &$answer){
                unset($answer['correct']);
                unset($answer['value']);
            }
            //Put getted answers to special array
            $answers = array('answers' => $answers);

            //Add answers to question
            $question = array_merge($question, $answers);
        }

        //Form result data array and send it to controller
        $result = array('unit' => $unit, 'questions' => $questions);

        return $result;

    }

    public function add_actions($actions)
    {
        foreach($actions as $action)
        {
            if(count($action) > 0)
            {
                $action['value'] = mb_strtolower($action['value']);
                $this->db->insert('test_actions', $action);
            }
        }
    }

    public function add_new_process($account_id, $unit_id)
    {
        $data = array('account_ID' => $account_id, 'unit_ID' => $unit_id);
        $this->db->insert('test_processes', $data);
        return $this->db->insert_id();
    }

    public function calc_completion($process_id, $unit_id)
    {
        $correct_answers = $this->calc_correct_answers($process_id);

        $query = $this->db->get_where('test_questions', array('unit_ID' => $unit_id));
        $total_questions = $this->db->affected_rows();

        $completion = (int)($correct_answers*(100/$total_questions));
        return $completion;
    }

    public function finish_process($process_id, $unit_id)
    {
        $completion = $this->calc_completion($process_id, $unit_id);

        $timestamp = date('Y-m-d G:i:s');
        $data = array('finish' => $timestamp, 'completion' => $completion);
        $this->db->where('ID', $process_id);

        return $this->db->update('test_processes', $data);
    }

    public function add_image($data)
    {
        $this->db->insert('test_images', $data);
        return $this->db->insert_id();
    }

    public function delete_image($image_id)
    {
		$this->db->where('image_ID', $image_id);
		$this->db->delete('test_images');
    }
    // (Answer ID, Field, Value)
    public function update_answer($answer_id, $field, $value)
    {
        $this->db->set($field, $value);
        $this->db->where('ID', $answer_id);
        $result = $this->db->update('test_answers');
        return $result;
    }

    public function add_empty_answer($question_id)
    {
        $data = array('question_ID' => $question_id, 'content' => '', 'correct' => false, 'value' => '');
        $this->db->insert('test_answers', $data);
        return $this->db->insert_id();
    }

    public function delete_answer($answer_id)
    {
		$this->db->where('ID', $answer_id);
		$this->db->delete('test_answers');
    }

    //If question has more than one correct answer it must to has Type = 2 (muliple select)
    //Return number of new type or 0 if there is no change
    public function type_control($answer_id)
    {
        $this->db->where('ID', $answer_id);
        $this->db->select('question_ID');
        $this->db->from('test_answers');
        $query = $this->db->get();
        $answer = $query->row_array();
        $question_id = $answer['question_ID'];

        $this->db->where('question_ID', $question_id);
        $this->db->where('correct', true);
        $this->db->from('test_answers');
        $query = $this->db->get();
        $answers = $query->result_array();

        $this->db->where('ID', $question_id);
        $this->db->from('test_questions');
        $this->db->select('type');
        $query = $this->db->get();
        $question = $query->row_array();

        $change = false;
        $new_type = 0;
        $result = 0;

        if(count($answers) > 1 && $question['type'] == 1) {
            $new_type = 2;
            $change = true;
        }
        if(count($answers) == 1 && $question['type'] == 2) {
            $new_type = 1;
            $change = true;
        }
        if($change) {
            $this->db->set('type', $new_type);
            $this->db->where('ID', $question_id);
            $result = $this->db->update('test_questions');
        }

        return $new_type;
    }
    public function update_question($question_id, $field, $value)
    {
        $this->db->set($field, $value);
        $this->db->where('ID', $question_id);
        $result = $this->db->update('test_questions');
        return $result;
    }
    //Return question count of unit
    public function add_empty_question($unit_id)
    {
        //Add new question with empty fields
        $data = array('unit_ID' => $unit_id, 'type' => '1', 'content' => '', 'title' => '');
        $this->db->insert('test_questions', $data);
        $question_id = $this->db->insert_id();

		$this->db->get_where('test_questions', array('unit_ID' => $unit_id));
		$question_count = $this->db->affected_rows();

        //Add first empty answer
        $this->add_empty_answer($question_id);

        return $question_count;
    }

    public function delete_question($question_id)
    {
		$this->db->where('ID', $question_id);
		$result = $this->db->delete('test_questions');

		$this->db->where('question_ID', $question_id);
        $this->db->delete('test_answers');

		return $result;
    }
    public function update_unit($unit_id, $field, $value)
    {
        $this->db->set($field, $value);
        $this->db->where('ID', $unit_id);
        $result = $this->db->update('test_units');
        return $result;
    }
    public function add_unit()
    {
        //Add new unit with empty fields
        $data = array('title' => '', 'description' => '');
        $this->db->insert('test_units', $data);
        $unit_id = $this->db->insert_id();
        $result = $this->update_unit($unit_id, 'title', 'Test Unit #'.$unit_id);

        if($result)
        {
            $this->add_empty_question($unit_id);
        }
        return $unit_id;
    }
    public function delete_unit($unit_id)
    {
		$this->db->where('ID', $unit_id);
		$result = $this->db->delete('test_units');

        if($result) {
            //Delete all questions of this unit
            $this->db->where('unit_ID', $unit_id);
            $this->db->from('test_questions');
            $this->db->select('ID');
            $query = $this->db->get();
            $questions = $query->result_array();

            if(count($questions) == 0)
                $result = 0;
        }

        if($result) {
            foreach($questions as $question)
            {
                $a = $this->delete_question($question['ID']);
                if($a == 0) $result = 0;
            }
        }

        $this->delete_process_by_unit_id($unit_id);

		return $result;
    }

    public function delete_process_by_unit_id($unit_id)
    {
        //Get all processes by ID of the current delete unit
        $query = $this->db->get_where('test_processes', array('unit_ID' => $unit_id));
        $processes = $query->result_array();

        //Delete all processes that have a link to the current delete unit
		$this->db->where('unit_ID', $unit_id);
		$result = $this->db->delete('test_processes');

        //Delete all actions of processes
		foreach($processes as $process)
		{
		    $this->db->where('process_ID', $process['ID']);
		    $result = $this->db->delete('test_actions');
		}
    }

    public function get_group_by_account_id($account_id)
    {
        $this->db->where('account_ID', $account_id);
        $this->db->from('test_members');
        $this->db->join('test_groups', 'test_groups.ID = test_members.group_ID');

        $query = $this->db->get();
        $result = $query->row_array();
        return $result;
    }

    public function get_all_groups()
    {
        $this->db->order_by('date_create', 'DESC');
        $this->db->select('test_groups.title as title, test_groups.ID as groupID');
        $this->db->select('accounts.surname as surname, accounts.firstname as firstname');
        $this->db->from('test_groups');
        $this->db->join('accounts', 'accounts.ID = test_groups.author_ID');

        $query = $this->db->get();
        return $query->result();
    }


    public function get_group_list()
    {
        $this->db->order_by('date_create', 'DESC');
        $this->db->select('title, ID');
        $this->db->from('test_groups');

        $query = $this->db->get();
        return $query->result();
    }

    public function join_group($account_id, $group_id)
    {
		$this->db->delete('test_members', array('account_ID' => $account_id));
        $result = $this->db->insert('test_members', array('account_ID' => $account_id, 'group_ID' => $group_id));
        return $result;
    }

    public function add_group($title, $author_id)
    {
        //Add new unit with empty fields
        $data = array('title' => $title, 'author_ID' => $author_id);
        $this->db->insert('test_groups', $data);
        $group_id = $this->db->insert_id();
        return $group_id;
    }

    public function delete_group($group_id)
    {
		$this->db->where('ID', $group_id);
		$this->db->delete('test_groups');
    }

    public function get_processes($surname, $firstname, $group_id, $unit_id, $date, $unfinished, $sort_field, $sort_type)
    {
        //$group_id = (int)$group_id;
        //$unit_id = (int)$unit_id;
        //Get all members of current group
        $this->db->from('test_members');

        //Sort
        $this->db->order_by($sort_field, $sort_type);

        //Convert to boolean
        if(gettype($unfinished) == 'string')
            $unfinished = json_decode($unfinished);

        //Include unfinished test processes
        if(!$unfinished)
            $this->db->where('test_processes.finish !=', 'NULL');

        if($group_id > 0 || $group_id) {
            $this->db->where('test_members.group_ID', $group_id);
        }

        if($unit_id > 0 || $unit_id) {
            $this->db->where('test_units.ID', $unit_id);
        }

        $this->db->select('accounts.surname as surname, accounts.firstname as firstname');
        $this->db->select('test_groups.title as groupTitle');
        $this->db->select('test_processes.ID as processID, test_processes.completion as completion');
        $this->db->select("DATE_FORMAT(test_processes.start, '%d.%m.%y') as date");
        $this->db->select('test_units.title as unitTitle');

        $this->db->join('test_groups', 'test_members.group_ID = test_groups.ID');
        $this->db->join('accounts', 'accounts.ID = test_members.account_ID');
        $this->db->join('test_processes', 'test_processes.account_ID = accounts.ID');
        $this->db->join('test_units', 'test_processes.unit_ID = test_units.ID');

        $this->db->like('surname', $surname);
        $this->db->like('firstname', $firstname);

        $query = $this->db->get();

        $members = $query->result_array();

        $index = 1;
        foreach($members as &$member)
        {
            $member['index'] = $index;
            $index++;
        }

        return $members;


/*
        $this->db->from('test_processes');
        $this->db->order_by('start', 'DESC');

        //Include unfinished test processes
        if(!$unfinished)
            $this->db->where('test_processes.finish !=', 'NULL');

        $this->db->select('test_processes.ID as process_ID, test_processes.start as start, test_processes.finish as finish ');
        $this->db->select('accounts.surname as surname, accounts.firstname as firstname');
        $this->db->select('test_units.title as title');
        $this->db->select("DATE_FORMAT(test_processes.start, '%d.%m.%y') as start");

        $this->db->join('test_units', 'test_units.ID = test_processes.unit_ID');
        $this->db->join('accounts', 'accounts.ID = test_processes.account_ID');
*/
    }
}