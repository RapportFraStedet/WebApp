function upload(){var c=$("#rapportForm")[0],c=new FormData(c);$(".current > span").hasClass("animate")&&$(".current > span").removeClass("animate");var b=new XMLHttpRequest;b.open("POST",Rfs.url+"/api/SaveFormsData.aspx",!0);b.onerror=function(){alert("error")};b.onload=function(){$(".current > span").width("100%");if(this.status==200)location="#/kommune/"+Rfs.kommune.Nr+"/"+Rfs.tema.Id+"/kvittering";else{var a=JSON.parse(this.response);$("#errorMessage").html("<h3>"+a.Message+"</h3><p>"+a.ExceptionMessage+
"</p>");location="#/kommune/"+Rfs.kommune.Nr+"/"+Rfs.tema.Id+"/kvitteringfejl"}};b.upload.onprogress=function(a){a.lengthComputable&&$(".current > span").width(a.loaded/a.total*100+"%")};b.send(c)};
