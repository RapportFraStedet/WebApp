(function ($) {
	$.fn.serializeJSON = function () {
		var json = {};
		jQuery.map($(this).serializeArray(), function (n, i) {
			json[n['name']] = n['value'];
		});
		return json;
	};
})(jQuery);
var currentImage = 0;
var images;
function win(r) {
	var obj = $.parseJSON(r.response);
	if (typeof obj.id === "undefined") {
		$("#errorMessage").html("<h3>" + response.Message + "</h3><p>" + response.ExceptionMessage + "</p>");
		location = '#/kommune/' + Rfs.kommune.Nr + '/' + Rfs.tema.Id + '/kvitteringfejl';
		
	} else {
		location = '#/kommune/' + Rfs.kommune.Nr + '/' + Rfs.tema.Id + '/kvittering';
	}
}
function fail(error) {
	location = "#KvitteringError";
}
function upload() {
	images = $(".imageCamera");
	currentImage = 0;
	if (images.length > 0 && images[currentImage].src && images[currentImage].src!='') {
		var image = images[currentImage];
		currentImage++;
		var params = $("#rapportForm").serializeJSON();
		var options = new FileUploadOptions();
		options.fileKey = image.id.replace('A', '');
		options.fileName = image.src.substr(image.src.lastIndexOf('/') + 1);
		options.mimeType = "image/jpeg";
		options.params = params;
		var ft = new FileTransfer();
		ft.onprogress = function (e) {
			if (e.lengthComputable) {
				$(".current > span").width(e.loaded / e.total * 100 + "%");
			}
		};
		ft.upload(image.src, encodeURI(Rfs.url + "/Upload.aspx/UploadImage"), win, fail, options);
	} else {
		if (window.FormData) {
			var form = $("#rapportForm")[0];
			var formData = new FormData(form);
			if ($(".current > span").hasClass("animate"))
				$(".current > span").removeClass("animate");
			var xhr = new XMLHttpRequest();
			xhr.open('POST', Rfs.url + "/api/SaveFormsData.aspx", true);
			xhr.onerror = function () {
				alert("error");
			};
			xhr.onload = function (e) {
				$(".current > span").width("100%");
				if (this.status == 200) {
					location = '#/kommune/' + Rfs.kommune.Nr + '/' + Rfs.tema.Id + '/kvittering';
				} else {
					var response = JSON.parse(this.response);
					$("#errorMessage").html("<h3>" + response.Message + "</h3><p>" + response.ExceptionMessage + "</p>");
					location = '#/kommune/' + Rfs.kommune.Nr + '/' + Rfs.tema.Id + '/kvitteringfejl';
				}
			};
			xhr.upload.onprogress = function (e) {
				if (e.lengthComputable) {
					$(".current > span").width(e.loaded / e.total * 100 + "%");
				}
			};
			xhr.send(formData);
		} else {
			var form = $("#rapportForm")[0];
			form.action = Rfs.url + "/api/SaveFormsData.aspx";
			form.method = "post";
			form.enctype = "multipart/form-data";
			form.target = "hiddenIFrame";
			form.submit();
			$(".current > span").width("100%");
			if (!$(".current > span").hasClass("animate"))
				$(".current > span").addClass("animate");
			location = '#/kommune/' + Rfs.kommune.Nr + '/' + Rfs.tema.Id + '/kvittering';
		}
		
	}
}