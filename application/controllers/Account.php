<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Account extends CI_Controller
{

    function new_account()
    {
        $this->load->model('Account_model');

        $firstname = $this->input->post('firstname');
        $surname = $this->input->post('surname');
        //$location = $this->input->post('location');
        //$birthdate = $this->input->post('birthdate');
        $email = $this->input->post('email');
        $password = $this->input->post('password');
        $password_check = $this->input->post('password_check');

        $count = 0;

        if (!$email) {

            echo 'email_empty';
            return 0;

        } else {

            if ($this->Account_model->check_email($email)) {
                echo 'email_exist';
                return 0;
            } else {
                $user_email = $email;
                $count++;
            }

        }
        //Check and validate password
        if (!$password) {
            echo 'password_empty';
            return 0;
        } else {
            if ($password != $password_check) {

                echo 'password_wrong';
                return 0;

            } else {
                $hash_password = md5($password);
                $count++;
            }
        }

        if ($count == 2) {

            $date = date('Y-m-d');

            $data = array(
                'firstname' => $firstname,
                'surname' => $surname,
                //'location' => $location,
                //'birthdate' => $birthdate,
                'password' => $hash_password,
                'email' => $email,
                'status' => 0  //Временные параметр - новый пользователь будет уже активирован. Если 0 - то требуется подтверждение по email
            );

            echo 'reg_ok';
            return $this->Account_model->add_account($data);

        } else {

            echo 'reg_nok';

        }
    }
}

