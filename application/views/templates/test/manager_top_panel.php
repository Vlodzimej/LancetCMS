<div class='row'>
    <div class='col-xs-12 text-center'>Test units:</div>
</div>

<div class='row'>
    <div class='col-sm-1'></div>
    <div class='col-sm-7'>
        <div class="form-group">
        <select class='form-control' id='lancet-test-manager-unit-list'>
            {units}
            <option value='{ID}'>{title} - {date_create}</option>
            {/units}
        </select>
        </div>
    </div>
    <div class='col-sm-3'>
        <button class='btn btn-default' id='lancet-test-manager-unit-add'><span class="glyphicon glyphicon-plus"></span> Add</button>
        <button class='btn btn-default' id='lancet-test-manager-unit-delete'><span class="glyphicon glyphicon-minus"></span> Remove</button>
    </div>
    <div class='col-sm-1'></div>
</div>
<div id='lancet-test-manager-work-panel'>
</div>