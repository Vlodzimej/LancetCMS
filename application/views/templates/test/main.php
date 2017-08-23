<div class="row">
    <div class="col-xs-2"></div>
    <div class="col-xs-8" style="height: 100%; display: table;">
        <div style="display: table-cell; vertical-align: middle;" class='text-center'>
            <div class='form-group'>
                <select class='form-control' id='lancet-test-unit-select'>
                {units}
                    <option value={ID}>{title}</option>
                {/units}
                </select>
            </div>
            <button class='btn btn-default' id='lancet-test-btn-start'>Start</button>
        </div>
    </div>
    <div class='col-sm-2'></div>
</div>
