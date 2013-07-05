(function ($) {

	$.widget("custom.photo", {
		options : {
			imageSizeValue : 100,
			imageQualityValue : 100,
			id : "",
			required : false,
			name : ''
		},
		image : null,
		canvas : null,
		textSize : null,
		resultFile : null,
		_create : function () {
			var fieldcontain = $("<div>", {
					'data-role' : 'fieldcontain'
				});
			this.element.append(fieldcontain);
			var label = _createLabel().addClass("ui-input-text");
			fieldcontain.append(label);
			var div = $("<div class='cameraButtons'>");
			fieldcontain.append(div);
			if (html5File()) {
				var file = $("<input data-role='none' class='fotoselect' type='file' name='B" + options.id + "' id='B" + options.id + "'/>");
				var fotoalbum = $("<div>Fotoalbum</div>").append(file);
				div.append(fotoalbum);
				fotoalbum.button({
					inline : true
				});
				if (felt.Permission == 1) {
					fotoalbum.button('disable');
				}
				$('#B' + options.id).change(showFile);
			}
			if (html5Camera()) {
				var kamera = $("<a href='#/kommune/" + Rfs.kommune.Nr + "/" + Rfs.tema.Id + "/kamera/" + options.id + "' data-role='button' data-inline='true' data-transition='slide'>Kamera</a>");
				div.append(kamera);
				kamera.button({
					inline : true,
					transition : 'slide'
				});
				if (felt.Permission == 1) {
					kamera.button('disable');
				}
			}
			var imageOptions = $("<div data-role='collapsible'>");
			div.append(imageOptions);
			imageOptions.append($("<h4>Options</h4>"));
			textSize = $("<div>").appendTo(imageOptions);
			var imageSizeLabel = $("<label for='imageSize-" + options.id + "'>Billede størrelse</label>");
			imageOptions.append(imageSizeLabel);
			imageSize = $("<input type='number' data-type='range' name='imageSize-" + options.id + "' id='imageSize-" + options.id + "' min='0' max='100' value='100' data-highlight='true'/>");
			imageOptions.append(imageSize);
			imageSize.slider();
			imageSize.on("slidestop", function (event, ui) {
				imageSizeValue = this.value;
				changeImage();
			});
			imageSize.keyup(function () {
				imageSizeValue = this.value;
				changeImage();
			});
			var imageQualityLabel = $("<label for='imageQuality-" + options.id + "'>Fil kvalitet</label>");
			imageOptions.append(imageQualityLabel);
			imageQuality = $("<input type='number' data-type='range' name='imageQuality-" + options.id + "' id='imageQuality-" + options.id + "' min='0' max='100' value='100' data-highlight='true'/>");
			imageOptions.append(imageQuality);
			imageQuality.slider();
			imageQuality.on("slidestop", function (event, ui) {
				imageQualityValue = this.value;
				changeImage();
			});
			imageQuality.keyup(function () {
				imageQualityValue = this.value;
				changeImage();
			});
			canvas = $("<canvas>").hide().get(0);
			this.append(canvas);
			var hidden = $("<input type='hidden' id='" + options.id + "' name='" + options.id + "' val=''/>");
			if (felt.Required == 1) {
				hidden.addClass('required');
			}
			this.append(hidden);
			var image = $("<img id='A" + options.id + "' width='100%'/>").hide();
			div.append(image);
		},
		_createLabel : function () {
			var label = null;
			if (options.required == 1)
				label = $("<label for='" + options.id + "'><em>*</em>" + options.name + "</label>");
			else
				label = $("<label for='" + options.id + "'>" + options.name + "</label>");
			return label;
		},
		_changeImage : function () {
			var image = new Image();
			image.onload = function (evt) {
				var width = this.width;
				var height = this.height;
				canvas.height = height * imageSizeValue / 100;
				canvas.width = width * imageSizeValue / 100;
				var ctx = canvas.getContext("2d");
				ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
				var s = canvas.toDataURL('image/jpeg', imageQualityValue / 100)
					$("#A" + imageId).attr("src", s).css('display', 'inline');
				$("#" + imageId).val(s);
				var b = s.split(',')[1];
				si = atob(b).length;
				if (si > 1000000) {
					textSize.text((si / (1024 * 1024)).toFixed(1) + ' Mb, ' + canvas.width + '☓' + canvas.height);
				} else if (si > 1000) {
					textSize.text(Math.round(si / (1024)) + ' Kb, ' + canvas.width + '☓' + canvas.height);
				}
				if (canvas.width < $(".cameraButtons").width()) {
					$("#A" + imageId).width(canvas.width);
				} else {
					$("#A" + imageId).css('width', '100%');
				}
			};
			image.src = resultFile;
		},
		_showFile : function (e) {
			imageId = this.name.substring(1);
			if (html5File()) {
				var blob = this.files[0]; // FileList object
				if (blob.type.match('image.*')) {
					var reader = new FileReader();

					// Closure to capture the file information.
					reader.onload = (function (theFile) {
						return function (e) {
							resultFile = e.target.result;
							changeImage();
							$("#A" + imageId).attr("src", e.target.result).css('display', 'inline');
							$("#" + imageId).val(e.target.result);
							var input = $("input[name='B" + imageId + "']");
							if (input.length > 0) {
								input.unbind('change');
								input[0].outerHTML = input[0].outerHTML;
								$("input[name='B" + imageId + "']").bind('change', showFile);
							}
						};
					})(blob);

					// Read in the image file as a data URL.
					reader.readAsDataURL(blob);
				}
			}
		}
	})
});

$('#PhotoPage').on('pageshow', function (event) {
	var viewHeight = $(window).height();
	var photoPage = $("#PhotoPage");
	var photoContent = photoPage.children(":jqmData(role=content)");
	var photoContentHeight = viewHeight;
	if ((photoContent.outerHeight()) !== viewHeight) {
		photoContentHeight -= (photoContent.outerHeight() - photoContent.height());
		$("#Photo").css("height", photoContentHeight);
	}
	var photoButton = $("#photoButton");
	var width = $(window).width();
	var width2 = photoButton.outerWidth();

	photoButton.css("left", (width - width2) / 2);

	var onFailSoHard = function (e) {
		$("#PhotoErrorMessage").html("<p>Fejl ved adgang til kameraet!</p>");
		$("#PhotoError").popup("open");
	};

	// Not showing vendor prefixes.
	window.URL = window.URL || window.webkitURL;
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia || navigator.msGetUserMedia;
	navigator.getUserMedia({
		video : true
	}, function (localMediaStream) {
		var video = document.querySelector('video');
		video.src = window.URL.createObjectURL(localMediaStream);
		stream = localMediaStream;
		// Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
		// See crbug.com/110938.
		video.onloadedmetadata = function (e) {
			// Ready to go. Do some stuff.
		};
	}, onFailSoHard);
});
function snapshot() {
	if (stream) {
		var video = document.querySelector('video');
		var canvas = document.querySelector('canvas');
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		var ctx = canvas.getContext('2d');
		ctx.drawImage(video, 0, 0);
		var file = $('#' + imageId);
		if (file.length > 0)
			file.val('');
		$("#A" + imageId).attr("src", canvas.toDataURL('image/jpeg')).css('display', 'inline');
		$("#" + imageId).val(canvas.toDataURL('image/jpeg'));
		//clear file input
		var input = $("input[name='B" + imageId + "']");
		if (input.length > 0) {
			input.unbind('change');
			input[0].outerHTML = input[0].outerHTML;
			$("input[name='B" + imageId + "']").bind('change', Rfs.inputChanged);
		}
		stream.stop();
	}
	backToFormular();

}
