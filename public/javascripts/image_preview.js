function image_preview(inputid, previewid) {
    var f = function(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            
            reader.onload = function (e) {
                $(previewid).attr('src', e.target.result);
            }
            
            reader.readAsDataURL(input.files[0]);
        }
    }
    $(inputid).change(function(){
        f(this);
    });
}
