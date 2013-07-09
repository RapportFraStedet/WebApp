$(function () {
	// the widget definition, where "custom" is the namespace,
	// "colorize" the widget name
	$.widget("custom.photo", {
		// default options
		options : {
			imageSizeValue : 100,
			imageQualityValue : 100,
			id : "",
			required : false,
			name : '',
			permission : 2
		},
		// the constructor
		_create : function () {
			this.imageSizeValue = this.options.imageSizeValue;
			this.imageQualityValue = this.options.imageQualityValue;
			var fieldcontain = $("<div>", {
					'data-role' : 'fieldcontain'
				});
			this.element.append(fieldcontain);
			var label = this._createLabel().addClass("ui-input-text");
			fieldcontain.append(label);
			var div = $("<div class='cameraButtons'>").appendTo(fieldcontain);
			if (html5File()) {
				var fotoalbum = $("<div>Fotoalbum</div>").appendTo(div).
					button({
						inline : true
					});
				if (this.options.permission == 1) {
					fotoalbum.button('disable');
				}
				this.file = $("<input data-role='none' class='fotoselect' type='file' name='B" + this.options.id + "' id='B" + this.options.id + "'/>").appendTo(fotoalbum);
				this._on(this.file, {
					"change" : "_showFile"
				});
			}
			if (html5Camera()) {
				var kamera = $("<a href='#/kommune/" + Rfs.kommune.Nr + "/" + Rfs.tema.Id + "/kamera/" + this.options.id + "' data-role='button' data-inline='true' data-transition='slide'>Kamera</a>").appendTo(div).
					button({
						inline : true,
						transition : 'slide'
					});
				if (this.options.permission == 1) {
					kamera.button('disable');
				}
			}
			var imageOptions = $("<div data-role='collapsible'>").appendTo(div);
			$("<h4>Options</h4>").appendTo(imageOptions);
			this.textSize = $("<div>").appendTo(imageOptions);
			$("<label for='imageSize-" + this.options.id + "'>Billede størrelse</label>").appendTo(imageOptions);
			this.imageSize = $("<input type='number' data-type='range' name='imageSize-" + this.options.id + "' id='imageSize-" + this.options.id + "' min='0' max='100' value='"+this.options.imageSizeValue+"' data-highlight='true'/>").
				appendTo(imageOptions).slider();
			this._on(this.imageSize, {
				"slidestop" : function () {
					this.imageSizeValue = this.imageSize.val();
					this._changeImage();
				},
				"keyup" : function () {
					this.imageSizeValue = this.imageSize.val();
					this._changeImage();
				}
			});
			$("<label for='imageQuality-" + this.options.id + "'>Billede kvalitet</label>").appendTo(imageOptions);
			this.imageQuality = $("<input type='number' data-type='range' name='imageQuality-" + this.options.id + "' id='imageQuality-" + this.options.id + "' min='0' max='100' value='"+this.options.imageQualityValue+"' data-highlight='true'/>").
				appendTo(imageOptions).slider();
			this._on(this.imageQuality, {
				"slidestop" : function () {
					this.imageQualityValue = this.imageQuality.val();
					this._changeImage();
				},
				"keyup" : function () {
					this.imageQualityValue = this.imageQuality.val();
					this._changeImage();
				}
			});

			this.hidden = $("<input type='hidden' id='" + this.options.id + "' name='" + this.options.id + "' val=''/>").appendTo(this.element);
			if (this.options.required == 1) {
				this.hidden.addClass('required');
			}
			this.imageA = $("<img id='A" + this.options.id + "' width='100%'/>").appendTo(div).hide();
		},

		_createLabel : function () {
			var label = null;
			if (this.options.required == 1)
				label = $("<label for='" + this.options.id + "'><em>*</em>" + this.options.name + "</label>");
			else
				label = $("<label for='" + this.options.id + "'>" + this.options.name + "</label>");
			return label;
		},
		_changeImage : function () {
			canvasResize(this.resultFile, {
					scale: this.imageSizeValue,
			        quality: this.imageQualityValue,
			        //rotate: 90,
			        callback: (function(self){return function(data, width, height) {
						
						self.imageA.attr("src", data).css('display', 'inline');
						self.hidden.val(data);
						var info = data.split(',');
						var t = "";
						if(info.length>0){
							
							var si = atob(info[1]).length;
							if (si > 1000000) {
								t = (si / (1024 * 1024)).toFixed(1) + ' Mb, ';
							} else if (si > 1000) {
								t = Math.round(si / (1024)) + ' Kb, ';
							}
						}
						self.textSize.text(t+ width + '☓' + height);
						if (width < $(".cameraButtons").width()) {
							self.imageA.width(width);
						} else {
							self.imageA.css('width', '100%');
						}
			            
			        };})(this)
			    });
				/*loadImage(
				    this.resultFile,
				    (function(self){return function (img) {
				        document.body.appendChild(img);
						var data = img.src;
						self.imageA.attr("src", data).css('display', 'inline');
						self.hidden.val(data);
						var b = data.split(',')[1];
						si = atob(b).length;
						if (si > 1000000) {
							self.textSize.text((si / (1024 * 1024)).toFixed(1) + ' Mb, ' + width + '☓' + height);
						} else if (si > 1000) {
							self.textSize.text(Math.round(si / (1024)) + ' Kb, ' + width + '☓' + height);
						}
						if (width < $(".cameraButtons").width()) {
							self.imageA.width(width);
						} else {
							self.imageA.css('width', '100%');
						}
				    };})(this),
				    {
				        maxWidth: 600,
				        maxHeight: 300,
				        minWidth: 100,
				        minHeight: 50,
				        canvas: true
				    }
				);
				loadImage.parseMetaData(
				    this.resultFile,
				    function (data) {
				        if (!data.imageHead) {
				            return;
				        }
				        // Combine data.imageHead with the image body of a resized file
				        // to create scaled images with the original image meta data, e.g.:
				        var blob = new Blob([
				            data.imageHead,
				            // Resized images always have a head size of 20 bytes,
				            // including the JPEG marker and a minimal JFIF header:
				            loadImage.blobSlice.call(resizedImage, 20)
				        ], {type: resizedImage.type});
				    },
				    {
				        maxMetaDataSize: 262144,
				        disableImageHead: false
				    }
				);*/
			/*var image = new Image();
			image.onload = (function (self) {
				return function (evt) {
					var width = this.width;
					var height = this.height;
					self.canvas[0].height=height * self.imageSizeValue / 100;
					self.canvas[0].width=width * self.imageSizeValue / 100;
					var ctx = self.canvas[0].getContext("2d");
					ctx.drawImage(this, 0, 0, self.canvas[0].width, self.canvas[0].height);
					var s = self.canvas[0].toDataURL('image/jpeg', self.imageQualityValue / 100);
					self.imageA.attr("src", s).css('display', 'inline');
					self.hidden.val(s);
					var b = s.split(',')[1];
					si = atob(b).length;
					if (si > 1000000) {
						self.textSize.text((si / (1024 * 1024)).toFixed(1) + ' Mb, ' + self.canvas[0].width + '☓' + self.canvas[0].height);
					} else if (si > 1000) {
						self.textSize.text(Math.round(si / (1024)) + ' Kb, ' + self.canvas[0].width + '☓' + self.canvas[0].height);
					}
					if (self.canvas[0].width < $(".cameraButtons").width()) {
						self.imageA.width(self.canvas[0].width);
					} else {
						self.imageA.css('width', '100%');
					}
				};
			})(this);
			image.src = this.resultFile;*/
		},
		_showFile : function (e) {

			if (html5File()) {
				var blob = this.file[0].files[0]; // FileList object
				if (blob.type.match('image.*')) {
					//this.resultFile = blob;
					//this._changeImage();
					
					var reader = new FileReader();

					// Closure to capture the file information.
					reader.onload = (function (self) {
						return function (e) {
							self.resultFile = e.target.result;
							self._changeImage();
						};
					})(this);

					// Read in the image file as a data URL.
					reader.readAsDataURL(blob);
				}
			}
		},

		// events bound via _on are removed automatically
		// revert other modifications here
		_destroy : function () {
			// remove generated elements

		},

		// _setOptions is called with a hash of all options that are changing
		// always refresh when changing options
		_setOptions : function () {
			// _super and _superApply handle keeping the right this-context
			this._superApply(arguments);
			this._refresh();
		},

		// _setOption is called for each individual option that is changing
		_setOption : function (key, value) {
			// prevent invalid color values
			/*if (/red|green|blue/.test(key) && (value < 0 || value > 255)) {
			return;
			}*/
			this._super(key, value);
		}
	});
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
