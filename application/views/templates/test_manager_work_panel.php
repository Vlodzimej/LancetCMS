<div class='row'>
    <div class='col-sm-1'></div>
    <div class='col-sm-10 text-center'>
        <form role='form'>

            <div class="form-group text-center">
                Unit name
                <input type="text" class="form-control" id='lancet-test-manager-unit-title' value='{title}'>
            </div>


            <div class="form-group text-center">
                Description
                <textarea class='form-control' style='resize: none; height: 100px;'>{description}</textarea>
            </div>

        </form>
        Questions
        <div class='panel panel-default'>
            <div class='panel-body'>
                    <div class='btn-group'>
                        <button class='btn btn-default btn-sm'><span class="glyphicon glyphicon-plus"></span> Add</button>
                        <button class='btn btn-default btn-sm'><span class="glyphicon glyphicon-minus"></span> Remove</button>
                    </div>
                <hr>
                <div id='lancet-test-manager-question-select'>
                {questions}
                    <button class='btn btn-default' class='lancet-test-manager-question-button' data-question-num='{num}' data-question-id='{ID}'>{num}</button>
                {/questions}
                </div>

            </div>
        </div>
    </div>
    <div class='col-sm-1'></div>
</div>
<div id='lancet-test-manager-question-panel'></div>

