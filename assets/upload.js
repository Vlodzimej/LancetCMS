//Загрузка изображения
$(function () {
    window.upload = 1;
    window.images = [];
    //Скрываем полосу состояния загрузки
    //$('#progress').hide();

    $('#userfile').on('change', function () {
    });

    $('#fileupload').fileupload({
        dataType: 'json',
        progressall: function (e, data) {
            $('#progress').show();
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .progress-bar').css(
                'width',
                progress + '%'
            );
        },
        done: function (e, data) {
            if (data.result.error != undefined) {
                $('#error').html(data.result.error); // выводим на страницу сообщение об ошибке если оно есть
                $('#error').fadeIn('slow');
            } else {
                //console.log(data);
                $('#error').hide(); //на случай если сообщение об ошибке уже отображалось
                //$('#files').append("<img class='img-polaroid' style='margin-left:15%;padding:10px;width:auto;height:250px' src=''>");
                $('#success').fadeIn('slow');
                //$('#current-image').attr('src', '/'+Lancet.Settings.catalogies.images+'/'+data.result.file_name);
                //console.log('/'+Lancet.Settings.catalogies.images+'/'+data.result.file_name);
                window.images[window.images.length] = data.result.imageID;
                //Скрываем полосу состояния загрузики до нуля и скрываем ее
                $('#progress').hide();
                $('#progress .progress-bar').css(
                    'width',
                    0 + '%'
                );
            }
        }
    }).bind('fileuploadprogress', function (e, data) {
        // Log the current bitrate for this upload:
        //$('#current-image').attr('src', '/'+Lancet.Settings.catalogies.images+'/'+data.result.file_name);
        //Lancet.log(data);
    });
})
;
