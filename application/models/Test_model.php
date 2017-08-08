<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Test_model extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function get_all_units()
    {
        $query = $this->db->get('test_units');
        return $query->result();
    }

    public function get_unit($unit_id)
    {
        $query = $this->db->get_where('test_units', array('ID' => $unit_id));
        $unit = $query->row();

        $query = $this->db->get_where('test_questions', array('unit_ID' => $unit_id));
        $questions = $query->result();


        $entries = array();
        foreach($questions as $question)
        {
            $query = $this->db->get_where('test_answers', array('question_ID' => $question->ID));
            $answers = $query->result();
            $entry = array('question' => $question, 'answers' => $answers);
            array_push($entries, $entry);


        }

        $result = array('unit' => $unit, 'entries' => $entries);

        return $result;

    }


}