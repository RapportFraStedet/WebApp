(function(a){a.fn.serializeJSON=function(){var b={};jQuery.map(a(this).serializeArray(),function(a){b[a.name]=a.value});return b}})(jQuery);var currentImage=0,images;function win(a){typeof $.parseJSON(a.response).id==="undefined"?$.mobile.changePage("#KvitteringError",{transition:"slide"}):$.mobile.changePage("#Kvittering")}function fail(){$.mobile.changePage("#KvitteringError",{transition:"slide"})}
function uploadCamera(){images=$(".imageCamera");currentImage=0;if(images.length>0){var a=images[currentImage];currentImage++;var b=$("#rapportForm").serializeJSON(),c=new FileUploadOptions;c.fileKey=a.id.replace("A","");c.fileName=a.src.substr(a.src.lastIndexOf("/")+1);c.mimeType="image/jpeg";c.params=b;b=new FileTransfer;b.onprogress=function(a){a.lengthComputable&&$(".current > span").width(a.loaded/a.total*100+"%")};b.upload(a.src,encodeURI(Rfs.url+"/Upload.aspx/UploadImage"),win,fail,c)}else window.FormData?
(a=$("#rapportForm")[0],a=new FormData(a),$(".current > span").hasClass("animate")&&$(".current > span").removeClass("animate"),c=new XMLHttpRequest,c.open("POST",Rfs.url+"/api/SaveFormsData.aspx",!0),c.onerror=function(){alert("error")},c.onload=function(){$(".current > span").width("100%");if(this.status==200)$.mobile.changePage("#Kvittering",{transition:"slide"});else{var a=JSON.parse(this.response);$("#errorMessage").html("<h3>"+a.Message+"</h3><p>"+a.ExceptionMessage+"</p>");$.mobile.changePage("#KvitteringError",
{transition:"slide"})}},c.upload.onprogress=function(a){a.lengthComputable&&$(".current > span").width(a.loaded/a.total*100+"%")},c.send(a)):(a=$("#rapportForm")[0],a.action=Rfs.url+"/api/SaveFormsData.aspx",a.method="post",a.enctype="multipart/form-data",a.target="hiddenIFrame",a.submit(),$(".current > span").width("100%"),$(".current > span").hasClass("animate")||$(".current > span").addClass("animate"),$.mobile.changePage("#Kvittering"))}
function markupCamera(a){var b="<div data-role='fieldcontain'>";b+="<label for='"+a.Id+"' class='ui-input-text'>";a.Required==1&&(b+="<em>*</em>");b+=a.Name+"</label><div class='cameraButtons'>";b+="<input type='button' data-inline='true' onclick='photolibrary("+a.Id+");' value='Fotoalbum'";a.Permission==1&&(b+=" class='ui-disabled'");b+="/>";b+="<input type='button' data-inline='true' onclick='camera("+a.Id+");' value='Kamera'";a.Permission==1&&(b+=" class='ui-disabled'");b+="/>";b+="<img id='A"+
a.Id+"' width='100%' style='display: none;' class='imageCamera'/>";b+="</div></div>";return b}function onSuccess(a){$("#A"+imageId).attr("src",a).css("display","inline")}function onFail(a){navigator.notification.alert("Der er sket en fejl: "+a,null,"Fejl")}function camera(a){imageId=a;navigator.camera.getPicture(onSuccess,onFail,{quality:100,destinationType:Camera.DestinationType.FILE_URI})}
function photolibrary(a){imageId=a;navigator.camera.getPicture(onSuccess,onFail,{quality:100,destinationType:Camera.DestinationType.FILE_URI,sourceType:Camera.PictureSourceType.PHOTOLIBRARY})};