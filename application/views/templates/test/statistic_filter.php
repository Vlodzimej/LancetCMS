Surname Firstname
<div class='input-group'>
    <span class="input-group-btn">
        <button class='btn btn-default form-control'><span class="glyphicon glyphicon-remove"></span></button>
    </span>
    <input type='text' class='form-control' id='lancet-test-filter-surname' placeholder='Surname'>
</div>

Group
<div class='input-group'>
    <span class="input-group-btn">
        <button class='btn btn-default form-control'><span class="glyphicon glyphicon-remove"></span></button>
    </span>
    <select class='form-control' id='lancet-test-filter-group'>
        {groups}
        <option value='{ID}'>{title}</option>
        {/groups}
    </select>
</div>

Unit
<div class='input-group'>
    <span class="input-group-btn">
        <button class='btn btn-default form-control'><span class="glyphicon glyphicon-remove"></span></button>
    </span>
    <select class='form-control' id='lancet-test-filter-unit'>
    {units}
        <option value='{ID}'>{title}</option>
    {/units}
    </select>
</div>
<hr>
<div class='input-group'>
    <input type='checkbox' id='lancet-test-filter-unfinished'> Show unfinished
</div>