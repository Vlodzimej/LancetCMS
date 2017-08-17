<div class='row'>
    <div class='col-sm-1'></div>
    <div class='col-sm-10' style='height: 560px'>
        <h4>Question: {current} / {total}</h4>
        <div class="panel panel-default">
            <div class="panel-body" style='overflow-y: auto; height: 500px; '>
                <h4><b>{title}</b></h4>
                <h5>{content}</h5>
                <div class='row'>
                    {renderedImages}
                </div>
                <hr>
                <form name='lancet-test-question-form'>
                    {renderedAnswers}
                </form>
            </div>
            <div class='col-sm-1'></div>
        </div>
    </div>
</div>

<div class='row'>
    <div class='col-sm-1'></div>
    <div class='col-sm-10'>
        <hr>
        <div class="btn-toolbar" role="toolbar">
            <div class="btn-group">
                <button class='btn btn-default' id='lancet-test-btn-prev'>Prev</button>
                <button class='btn btn-default' id='lancet-test-btn-next'>Next</button>
            </div>
            <button class='btn btn-default pull-right' id='lancet-test-btn-finish'>Finish</button>
        </div>
    </div>
    <div class='col-sm-1'></div>
    </div>
</div>