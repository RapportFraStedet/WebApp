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
			var markup = "<div data-role='fieldcontain'>";
			markup += "<label for='" + this.options.id + "'>";
			if (this.options.required == 1) {
				markup += "<em>*</em>";
			}
			markup += this.options.name + "</label>";
			markup += "<input type='file' name='" + this.options.id + "' id='" + this.options.id + "'";
			if (this.options.permission == 1 || this.options.required == 1) {
				markup += " class='";
				if (this.options.permission == 1) {
					markup += "ui-disabled";
				}
				if (this.options.required == 1) {
					markup += " required";
				}
				markup += "'";
			}
			markup += "/>";
			markup += "</div>";
			this.element.html(markup);
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