<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Parser extends CI_Controller
{
    function template()
    {
        $this->load->library('parser');
        $filename = $this->input->post('filename');
        $data = $this->input->post('data');
        $result = $this->parser->parse('/templates/'.$filename, $data, TRUE);
        echo $result;
    }
}