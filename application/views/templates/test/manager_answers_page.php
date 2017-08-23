<div class='row'>
    <div class='col-xs-12 text-center'>
        <form role='form' name='lancet-test-manager-answer-form'>
        <table class='table'>
            <tr>
                <th class='text-center'><h5>Answer</h5></th>
                <th></th>
                <th class='text-center'><h5>Correct</h5></th>
            </tr>
            {answers}
            <tr>
                <td>
                    <input type='text' class='form-control lancet-test-manager-answer-content' value='{content}'>
                </td>
                <td>
                <button class='btn btn-danger btn-xs button-delete-answer' data-answer-id='{ID}'><span class="glyphicon glyphicon-remove"></span></button>
                </td>
                <td class='text-center'>
                    <input type='checkbox'>
                </td>
            </tr>
            {/answers}
        </table>
        </form>
        <button class='btn btn-default' id='lancet-test-manager-add-answer'><span class="glyphicon glyphicon-plus"></span> Add</button>
    </div>
</div>
