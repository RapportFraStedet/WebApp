/*
Copyright 2012, MapGuideForm user group, Frederikssund Kommune and Helsingør Kommune - att. Anette Poulsen and Erling Kristensen

This file is part of "RapportFraStedet".
"RapportFraStedet" is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.
"RapportFraStedet" is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License along with "RapportFraStedet". If not, see <http://www.gnu.org/licenses/>.
 */
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
			
			this.fotoalbum = $("<input type='button' value='Fotoalbum'>").appendTo(div).
			button({
					inline : true
			});
			if (this.options.permission == 1) {
				this.fotoalbum.button('disable');
			}
			this._on(this.fotoalbum,{
				'click' : function(){
					var options = {
						quality : 100,
						destinationType : Camera.DestinationType.DATA_URL,//.FILE_URI,
						sourceType : Camera.PictureSourceType.PHOTOLIBRARY
					}
					if(!Rfs.editImage){
						options.destinationType = Camera.DestinationType.FILE_URI
					}
					navigator.camera.getPicture((function(self){
							return function(blob){
								if(Rfs.editImage){
									self.resultFile = "data:image/jpeg;base64,"+blob;
									self._changeImage();
								} else {
									self.imageA.attr("src", blob).css('display', 'inline').addClass('imageCamera');
									self.hidden.val("data:image/jpg;base64,");
								}
							};
						})(this),
						function(message){
							var msg = 'Der er sket en fejl: ' + message;
							navigator.notification.alert(msg, null, 'Fejl');
						}, options);
				}
			});
			
			this.kamera = $("<input type='button' value='Kamera'>").appendTo(div).
			button({
					inline : true
			});
			if (this.options.permission == 1) {
				this.kamera.button('disable');
			}
			this._on(this.kamera,{
				'click' : function(){
					var options = {
						quality : 100,
						destinationType : Camera.DestinationType.DATA_URL//.FILE_URI,
						
					}
					if(!Rfs.editImage){
						options.destinationType = Camera.DestinationType.FILE_URI
					}
					navigator.camera.getPicture((function(self){
							return function(blob){
								if(Rfs.editImage){
									self.resultFile = "data:image/jpeg;base64,"+blob;
									self._changeImage();
								} else {
									self.imageA.attr("src", blob).css('display', 'inline').addClass('imageCamera');
									self.hidden.val("data:image/jpg;base64,");
								}
								
							};
						})(this),
						function(message){
							var msg = 'Der er sket en fejl: ' + message;
							navigator.notification.alert(msg, null, 'Fejl');
						}, options);
				}
			});
			if(Rfs.editImage){
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
			}
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
						self.imageA.attr("src", data).css('display', 'inline').removeClass('imageCamera');
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