(function(a){a.fn.serializeJSON=function(){var c={};jQuery.map(a(this).serializeArray(),function(a){c[a.name]=a.value});return c}})(jQuery);var currentImage=0,images;function win(a){typeof $.parseJSON(a.response).id==="undefined"?($("#errorMessage").html("<h3>"+response.Message+"</h3><p>"+response.ExceptionMessage+"</p>"),location="#/kommune/"+Rfs.kommune.Nr+"/"+Rfs.tema.Id+"/kvitteringfejl"):location="#/kommune/"+Rfs.kommune.Nr+"/"+Rfs.tema.Id+"/kvittering"}
function fail(){location="#KvitteringError"}
function upload(){images=$(".imageCamera");currentImage=0;if(images.length>0&&images[currentImage].src&&images[currentImage].src!=""){var a=images[currentImage];currentImage++;var c=$("#rapportForm").serializeJSON(),b=new FileUploadOptions;b.fileKey=a.id.replace("A","");b.fileName=a.src.substr(a.src.lastIndexOf("/")+1);b.mimeType="image/jpeg";b.params=c;c=new FileTransfer;c.onprogress=function(a){a.lengthComputable&&$(".current > span").width(a.loaded/a.total*100+"%")};c.upload(a.src,encodeURI(Rfs.url+
"/Upload.aspx/UploadImage"),win,fail,b)}else window.FormData?(a=$("#rapportForm")[0],a=new FormData(a),$(".current > span").hasClass("animate")&&$(".current > span").removeClass("animate"),b=new XMLHttpRequest,b.open("POST",Rfs.url+"/api/SaveFormsData.aspx",!0),b.onerror=function(){alert("error")},b.onload=function(){$(".current > span").width("100%");if(this.status==200)location="#/kommune/"+Rfs.kommune.Nr+"/"+Rfs.tema.Id+"/kvittering";else{var a=JSON.parse(this.response);$("#errorMessage").html("<h3>"+
a.Message+"</h3><p>"+a.ExceptionMessage+"</p>");location="#/kommune/"+Rfs.kommune.Nr+"/"+Rfs.tema.Id+"/kvitteringfejl"}},b.upload.onprogress=function(a){a.lengthComputable&&$(".current > span").width(a.loaded/a.total*100+"%")},b.send(a)):(a=$("#rapportForm")[0],a.action=Rfs.url+"/api/SaveFormsData.aspx",a.method="post",a.enctype="multipart/form-data",a.target="hiddenIFrame",a.submit(),$(".current > span").width("100%"),$(".current > span").hasClass("animate")||$(".current > span").addClass("animate"),
location="#/kommune/"+Rfs.kommune.Nr+"/"+Rfs.tema.Id+"/kvittering")};