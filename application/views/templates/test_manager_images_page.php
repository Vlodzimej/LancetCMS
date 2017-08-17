<div class='row'>
<div class='col-xs-8'>
    <div class='row'>
        {images}
            <div class='col-sm-4'>
                <div class="thumbnail center-block" style='width: 128px; height: 128px; overflow: hidden;'>
                    <div class="caption text-center">
                    {title}
                    <button class='btn btn-default btn-xs pull-right'>
                        <span class="glyphicon glyphicon-remove"></span>
                    </button>
                    </div>
                    <img src='./images/{filename}' class="img-responsive" alt="{title}" onClick='Lancet.Controller.execute("!run image_preview {ID}");'>
                </div>
            </div>
        {/images}
    </div>
</div>

<div class='col-xs-4'>

    <form action="index.php/main/upload_image" id="fileupload" enctype="multipart/form-data" method="post" accept-charset="utf-8">
        <span class="fileinput-button">
            <div id='upload-image'></div>
            <input type="file" name="userfile" multiple>
        </span>
    </form>

</div>

<script>

</script>