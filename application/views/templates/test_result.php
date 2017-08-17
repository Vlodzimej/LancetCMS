<div class='row'>
    <div class='col-sm-1'></div>
    <div class='col-sm-10 text-center'>

        <h4>Choose process
        </h4>
        <select class='form-control' id='lancet-test-manager-select-process'>

            {processList}

            <option value='{process_ID}'>{firstname} {surname} - {title} ({start})</option>

            {/processList}

        </select>
        <hr>
        <div class="panel panel-default">
            <div class='panel-body' id='lancet-print-content'>
                <div id='lancet-test-manage-panel'>
                </div>
            </div>
        </div>
        <button class='btn btn-primary btn-lg' onClick='javascript: CallPrint("lancet-print-content");'><span class="glyphicon glyphicon-print"></span></button>
    </div>
    <div class='col-sm-1'></div>
</div>

<script language="javascript">
    function CallPrint(strid) {
        var prtContent = document.getElementById(strid);

        var prtCSS = '<link rel="stylesheet" href="../assets/bootstrap/bootstrap.css" type="text/css" />';
        var WinPrint = window.open('','','left=50,top=50,width=800,height=640,toolbar=0,scrollbars=1,status=0');
        WinPrint.document.write('<div id="print" class="contentpanel"><div class="container"><div class="row"><div class="col-sm-12">');
        WinPrint.document.write(prtCSS);
        WinPrint.document.write(prtContent.innerHTML);
        WinPrint.document.write('</div></div></div></div>');

        console.log(WinPrint.document);

        WinPrint.document.close();

        WinPrint.setTimeout(function(){
            WinPrint.focus();
            WinPrint.print();
            WinPrint.close();
        }, 500);
        //prtContent.innerHTML=strOldOne;
}
</script>