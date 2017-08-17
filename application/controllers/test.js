var view = Lancet.initializeView();
var container = view.container;
var parent = Lancet.Model.views[view.parentIndex];
var unitID;
var unitData;
var questionIndex = 0;
var questionData;
var total;
var processID;
$.get('index.php/test/all').done(function(result){
    var data = $.parseJSON(result);
    var content = Lancet.templateParse('test_main', { units : data });

    container.html(content);

    $('#lancet-test-btn-start').on('click', function(){
        unitID = $('#lancet-test-unit-select').val();
        $.ajax({
            url : 'index.php/test/unit/'+unitID,
            async : false,
        }).done(function(result) {
            unitData = $.parseJSON(result);
            total = unitData.questions.length;
            showQuestion();

            $.ajax({
                url : 'index.php/test/start',
                type : 'POST',
                async : false,
                data : {
                    unitID : unitData.unit.ID,
                    accountID : Lancet.Account.ID
                }
            }).done(function(result){
                processID = result;
            });



        });
    });
});

function showQuestion()
{
    questionData = unitData.questions[questionIndex];
    questionData['current'] = questionIndex+1;
    questionData['total'] = total;

    console.log(unitData);

    var content = Lancet.templateParse('test_question', questionData);
    container.html(content);
    buttonControl();

    var answers = $("form[name='lancet-test-question-form']")[0];
    _.each(answers, function(answer, index){
        console.log(questionData.answers[index].action);
        answer.checked = questionData.answers[index].action;
    });
}

function buttonControl()
{
    $('#lancet-test-btn-prev').on('click', function(){
        prevQuestion();
    });
    $('#lancet-test-btn-next').on('click', function(){
        nextQuestion();
    });
    $('#lancet-test-btn-finish').on('click', function(){
        finish();
    });
    $("form[name='lancet-test-question-form']").find('input').on('click', function(){
        fixAnswer();
    });
}

function prevQuestion()
{
    if(questionIndex > 0) {
        questionIndex--;
        showQuestion();
    }
}

function nextQuestion()
{
    if(questionIndex < total-1) {
        questionIndex++;
        showQuestion();
    }
}

function fixAnswer()
{
    answers = $("form[name='lancet-test-question-form']")[0];
    _.each(answers, function(answer, index){
        questionData.answers[index].action = answer.checked;
    });
}

function finish()
{
    var actions = [];
    _.each(unitData.questions, function(question, index){
        _.each(question.answers, function(answer, index){
            delete answer['content'];
            answer['process_ID'] = processID;
            if(answer['action']) actions[index] = answer;
        });
    });
    console.log(actions);

    $.post('index.php/Test/finish', {
        actions : actions
    }).done(function(result){
        console.log(result);
    });

}