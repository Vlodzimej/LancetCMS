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
                <textarea class='form-control' style='resize: none; height: 60px;' id='lancet-test-manager-unit-description'>{description}</textarea>
            </div>
        </form>
        Questions
        <div class='panel panel-default'>
            <div class='panel-body'>
                <div class='col-xs-2'>
                    <button class='btn btn-default pull-right' id='lancet-test-manager-question-add'><span class="glyphicon glyphicon-plus"></span> Add</button>
                </div>
                <div class='col-xs-8' id='lancet-test-manager-question-select'>
                {questions}
                    <button class='btn btn-default' class='lancet-test-manager-question-button' data-question-num='{num}' data-question-id='{ID}'>{num}</button>
                {/questions}
                </div>
                    <button class='btn btn-default pull-left' id='lancet-test-manager-question-delete'><span class="glyphicon glyphicon-minus"></span> Remove</button>
                <div class='col-xs-2'></div>
            </div>
        </div>
    </div>
    <div class='col-sm-1'></div>
</div>
<div id='lancet-test-manager-question-panel'></div>

