<div class='row'>
    <div class='col-xs-12 text-center'>
        <form role='form' name='lancet-test-manager-answer-form'>
        <table class='table'>

            <tr>
                <th class='text-center'><h5>Answer</h5></th>
                <th class='text-center'><h5>Value</h5></th>
                <th class='text-center'></th>
            </tr>
            {answers}
            <tr>
                <td>
                    <input type="text" class="form-control lancet-test-manager-answer-content" value='{content}'>
                </td>
                <td>
                    <input type="text" class="form-control lancet-test-manager-answer-value" value='{value}'>
                </td>
                <td>
                    <button class='btn btn-danger btn-xs button-delete-answer' data-answer-id='{ID}'><span class="glyphicon glyphicon-remove"></span></button>
                </td>
            </tr>
            {/answers}
        </table>
        <button class='btn btn-default' id='lancet-test-manager-add-answer'><span class="glyphicon glyphicon-plus"></span> Add</button>
        </form>
    </div>
</div>
