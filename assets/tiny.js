tinymce.init({
    mode : "specific_textareas",
    editor_selector : "mceEditor",
    theme: "modern",
    plugins: [
        "advlist autolink lists link image charmap print preview hr anchor pagebreak",
        "searchreplace wordcount visualblocks visualchars code fullscreen",
        "insertdatetime media nonbreaking save table contextmenu directionality",
        "emoticons template paste textcolor"
    ],
    toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
    toolbar2: "print preview media | forecolor backcolor emoticons",
    image_advtab: true,
    height : "300",
    language:"ru"
});


tinymce.init({
    mode : "specific_textareas",
    editor_selector : "simpleEditor",
    menubar: false,
    statusbar: false,
    theme: "modern",
    plugins: [
        " link image charmap",
        "searchreplace wordcount visualblocks visualchars",
        "emoticons paste textcolor"
    ],
    toolbar1: "link image emoticons",
    image_advtab: true,
    height : "150",
    language:"ru",
    extended_valid_elements : "iframe[src|title|width|height|frameborder|allowfullscreen]"

});
