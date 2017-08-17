<div class='row'>
    <div class='col-xs-12'>
        <ul class="nav nav-pills" style='margin: 16px;'>
            <li><a href="#">New</a></li>
            <li><a href="#">Add</a></li>
            <li><a href="#">Update</a></li>
            <li><a href="#">Remove</a></li>
            <li><a href="#">Groups</a></li>
        </ul>
        <hr>
    </div>
</div>


<div class='row'>
    <div class='col-sm-1'></div>
    <div class='col-sm-10'>
        <div class="form-group">
        <select class='form-control' id='lancet-test-manager-unit-list'>
            {units}
            <option value='{ID}'>{title} - {date_create}</option>
            {/units}
        </select>
        </div>
    </div>
    <div class='col-sm-1'></div>
</div>
<div id='lancet-test-manager-work-panel'>
</div>