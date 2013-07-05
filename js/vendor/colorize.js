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
			this.canvas = $("<canvas>").appendTo(this.element).hide();
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
			var image = new Image();
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
			image.src = this.resultFile;
		},
		_showFile : function (e) {

			if (html5File()) {
				var blob = this.file[0].files[0]; // FileList object
				if (blob.type.match('image.*')) {
					var reader = new FileReader();

					// Closure to capture the file information.
					reader.onload = (function (self) {
						return function (e) {
							self.resultFile = e.target.result;
							self._changeImage();
							/*self.imageA.attr("src", e.target.result).css('display', 'inline');
							self.hidden.val(e.target.result);
							var input = $("input[name='B" + imageId + "']");
							if (input.length > 0) {
							input.unbind('change');
							input[0].outerHTML = input[0].outerHTML;
							$("input[name='B" + imageId + "']").bind('change', self._showFile);
							}*/
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
