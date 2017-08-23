<div class='row'>
    <div class='col-sm-12'>
        <button class='btn btn-default' onClick='javascript: CallPrint("lancet-print-content");'><span class="glyphicon glyphicon-print" title='Print'></span> Print</button>
        <hr>
    </div>
</div>

<div class='row'>
    <div class='col-sm-12 text-center'>
        <div class="panel panel-default">
            <div class='panel-body' id='lancet-print-content'>
                <div id='lancet-test-manage-panel'>
                </div>
            </div>
        </div>
    </div>
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