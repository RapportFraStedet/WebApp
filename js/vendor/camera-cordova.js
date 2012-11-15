/*
Copyright 2012, MapGuideForm user group, Frederikssund Kommune and Helsingør Kommune - att. Anette Poulsen and Erling Kristensen

This file is part of "RapportFraStedet".
"RapportFraStedet" is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.
"RapportFraStedet" is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License along with "RapportFraStedet". If not, see <http://www.gnu.org/licenses/>.
 */
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
		$.mobile.changePage("#KvitteringError", {
			transition : "slide"
		});
	} else {
		$.mobile.changePage("#Kvittering");
		/*if (currentImage < images.length) {
		var image = images[currentImage];
		currentImage++;
		var options = new FileUploadOptions();
		options.fileKey = image.id.replace('A', '');
		options.fileName = image.src.substr(image.src.lastIndexOf('/') + 1);
		options.mimeType = "image/jpeg";
		options.params = {
		id : r.response.id
		};
		var ft = new FileTransfer();
		ft.onprogress = function (e) {
		if (e.lengthComputable) {
		$(".current > span").width(e.loaded / e.total * 100 + "%");
		}
		};
		ft.upload(image.src, encodeURI(Rfs.url + "/api/UpdateFormsData.aspx"), win, fail, options);
		} else {
		$.mobile.changePage("#Kvittering");
		}
		}*/
	}
}
function fail(error) {
	$.mobile.changePage("#KvitteringError", {
		transition : "slide"
	});
}
function uploadCamera() {
	images = $(".imageCamera");
	currentImage = 0;
	if (images.length > 0) {
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
					$.mobile.changePage("#Kvittering", {
						transition : "slide"
					});
				} else {
					var response = JSON.parse(this.response);
					$("#errorMessage").html("<h3>" + response.Message + "</h3><p>" + response.ExceptionMessage + "</p>");
					$.mobile.changePage("#KvitteringError", {
						transition : "slide"
					});
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
			$.mobile.changePage("#Kvittering");
		}
		
	}
}

function markupCamera(felt) {
	var markup = "<div data-role='fieldcontain'>";
	markup += "<label for='" + felt.Id + "' class='ui-input-text'>";
	if (felt.Required == 1) {
		markup += "<em>*</em>";
	}
	markup += felt.Name + "</label><div class='cameraButtons'>";
	markup += "<input type='button' data-inline='true' onclick='photolibrary(" + felt.Id + ");' value='Fotoalbum'";
	if (felt.Permission == 1) {
		markup += " class='ui-disabled'";
	}
	markup += "/>";
	markup += "<input type='button' data-inline='true' onclick='camera(" + felt.Id + ");' value='Kamera'";
	if (felt.Permission == 1) {
		markup += " class='ui-disabled'";
	}
	markup += "/>";
	markup += "<img id='A" + felt.Id + "' width='100%' style='display: none;' class='imageCamera'/>";
	markup += "</div></div>";
	return markup;
}
function onSuccess(imageURL) {
	$("#A" + imageId).attr("src", imageURL).css('display', 'inline');
}

// Called if something bad happens.
//
function onFail(message) {
	var msg = 'Der er sket en fejl: ' + message;
	navigator.notification.alert(msg, null, 'Fejl');
}

// A button will call this function
//

function camera(id) {
	
	// Launch device camera application,
	// allowing user to capture up to 2 images
	imageId = id;
	//navigator.device.capture.captureImage(captureSuccess, captureError, { limit: 1 });
	navigator.camera.getPicture(onSuccess, onFail, {
		quality : 100,
		destinationType : Camera.DestinationType.FILE_URI
	});
}
function photolibrary(id) {
	
	// Launch device camera application,
	// allowing user to capture up to 2 images
	imageId = id;
	//navigator.device.capture.captureImage(captureSuccess, captureError, { limit: 1 });
	navigator.camera.getPicture(onSuccess, onFail, {
		quality : 100,
		destinationType : Camera.DestinationType.FILE_URI,
		sourceType : Camera.PictureSourceType.PHOTOLIBRARY
	});
}
