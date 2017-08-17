<div class='row' style='height : 160px;'></div>
<div class='row'>
    <div class='col-sm-2'></div>
    <div class='col-sm-8 text-center'>
        <div class='form-group'>
                <select class='form-control' id='lancet-test-unit-select'>
                {units}
                    <option value={ID}>{title}</option>
                {/units}
                </select>
        </div>
            <button class='btn btn-default' id='lancet-test-btn-start'>Start</button>

        </div>
    <div class='col-sm-2'></div>
</div>
