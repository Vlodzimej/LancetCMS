<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Account extends CI_Controller
{

    function new_account()
    {
        $this->load->model('Account_model');

        $login = $this->input->post('login');
        $firstname = $this->input->post('firstname');
        $surname = $this->input->post('surname');
        $email = $this->input->post('email');
        $password = $this->input->post('password');
        $password_check = $this->input->post('password_check');

        $count = 0;

        if (!$email) {

            echo 'email_empty';
            return 0;

        } else {

            if ($this->Account_model->find_email($email)) {
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
                'login' => $login,
                'firstname' => $firstname,
                'surname' => $surname,
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

    function signin()
    {
        $this->load->model('Account_model');

        $login = $this->input->post('login');
        $password = $this->input->post('password');

        //Search login in database
        if ($this->Account_model->find_login($login)) {
            //Check the password
            $account = $this->Account_model->get_account_by_login($login, $password);
            if ($account) {
                //If all right set cookie 'logged_in' is TRUE
                switch ($account['status']) {

                    case '0':   // Статус: заблокирован
                        echo 'not_confirmed';
                        break;

                    case '1':   // Статус: заблокирован
                        echo 'blocked';
                        break;

                    case '2':   //Статус: активирован

                        $data = array(
                            'user_ID' => $account['ID'],
                            'user_login' => $account['login'],
                            'user_type' => $account['type'],
                            'logged_in' => TRUE
                        );

                        $this->session->set_userdata($data);

                        echo 'signin_ok';
                        break;
                }
            } else {
                echo 'wrong_password';
            }
        } else {
            echo 'not_found';
        }

    }
    function signout()
    {
        $this->session->sess_destroy();
    }

    //Check current user authorization
    function check_logged_in()
    {
        $logged = $this->session->userdata('logged_in');
        if(!$logged || $logged == null)
        {
            echo 0;
        } else {
            echo 1;
        }

    }

    function current_account()
    {
        $this->load->model('Account_model');
        $result = $this->Account_model->get_current_account();
        echo json_encode($result);
    }
}

