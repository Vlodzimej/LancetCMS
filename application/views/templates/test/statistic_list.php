<table class='table table-hover table-condensed lancet-statistic-table' id='lancet-test-stat-list'>
    <tr>
        <th class='text-center'>
            <button class='btn btn-default' href='#' id='lancet-test-filter-sort-type'><span class="glyphicon"></span></button>
        </th>
        <th>
            <a href='#' title='Sort by surname' data-sort-field='surname'>Surname, Firstname</a>
        </th>
        <th>
            <a href='#' title='Sort by group' data-sort-field='groupTitle'>Group</a>
        </th>
        <th>
            <a href='#' title='Sort by test unit' data-sort-field='unitTitle'>Test unit</a>
        </th>
        <th>
            <a href='#' title='Sort by date' data-sort-field='date'>Date</a>
        </th>
        <th class='text-center'>
            <a href='#' title='Sort by completion' data-sort-field='completion'>Completion</a>
        </th>
    </tr>

{entries}
    <tr onClick='Lancet.Controller.execute("!run test_results {processID}")'>
        <td class='text-center'>{index}</td>
        <td>{surname} {firstname}</td>
        <td>{groupTitle}</td>
        <td>{unitTitle}</td>
        <td>{date}</td>
        <td class='text-center'>{completion} %</td>
    </tr>
{/entries}
</table>