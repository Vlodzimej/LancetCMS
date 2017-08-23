<div class='row'>
<div class='col-xs-8'>
    <div class='row'>
        {images}
            <div class='col-sm-4' id='tangle-test-manager-image-panel'>
                <div class="center-block" >
                    <div class="caption text-center">
                        {title}
                        <button class='btn btn-default btn-xs pull-right delete-image' data-image-id = '{ID}' title='Remove'>
                            <span class="glyphicon glyphicon-remove"></span>
                        </button>
                    </div>
                    <a href='#' class='thumbnail' onClick='Lancet.Controller.execute("!run image_preview {ID}");'>
                        <img src='./images/{filename}' class="img-responsive" alt="{title}"'>
                    </a>
                </div>
            </div>
        {/images}
    </div>
</div>

<div class='col-xs-4 text-center'>

    <form action="index.php/main/upload_image" id="fileupload" enctype="multipart/form-data" method="post" accept-charset="utf-8">
        <span class="fileinput-button">
            <div id='upload-image'></div>
            <input type="file" name="userfile" multiple>
        </span>
    </form>

</div>

<script>

</script>