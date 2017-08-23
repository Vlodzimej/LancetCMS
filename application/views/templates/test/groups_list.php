{groups}
<div class='row'>
    <div class='col-xs-12 text-center' id='lancet-test-group-list'>
        <hr>
        <div class="media">
            <a class="pull-left" href="#">
                <img class="media-object">
            </a>
            <div class="media-body">
                <h4>
                    <a href='#' onClick="Lancet.Controller.execute('!run test_statistic {groupID}');">{title}</a>
                </h4>
                <p>Supervisor: {surname} {firstname}</p>
                <p>
                    <a href='#' class='lancet-test-join-btns' data-group-id='{groupID}'><span class="glyphicon glyphicon-log-in"></span> Join</a>
                    <?php
                        $access_level = $this->session->userdata('account_access_level');
                        if($access_level > 2):
                    ?>
                    | <a href='#' class='lancet-test-delete-btns' data-group-id='{groupID}'><span class="glyphicon glyphicon-remove"></span> Delete</a>
                    <?php
                        endif;
                    ?>
                </p>
            </div>
        </div>
    </div>
</div>
{/groups}