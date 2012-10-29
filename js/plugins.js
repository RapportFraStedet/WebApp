﻿/*
  Copyright 2012, MapGuideForm user group, Frederikssund Kommune and Helsingør Kommune - att. Anette Poulsen and Erling Kristensen
  
  This file is part of "RapportFraStedet". 
  "RapportFraStedet" is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.
  "RapportFraStedet" is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  You should have received a copy of the GNU General Public License along with "RapportFraStedet". If not, see <http://www.gnu.org/licenses/>.
*/
// Avoid `console` errors in browsers that lack a console.
if (!(window.console && console.log)) {
	(function () {
		var noop = function () {};
		var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'markTimeline', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
		var length = methods.length;
		var console = window.console = {};
		while (length--) {
			console[methods[length]] = noop;
		}
	}
		());
}

// Place any jQuery/helper plugins in here.
Modernizr.load({
	test : Modernizr.inputtypes.date,
	yep : 'js/vendor/date.js',
	nope : ['css/jqm-datebox.css', 'js/vendor/jqm-datebox.core.js', 'js/vendor/jqm-datebox.mode.calbox.js', 'js/vendor/jquery.mobile.datebox.i18n.da.utf8.js', 'js/vendor/no-date.js']
});
function html5Camera() {
	// Note: Opera is unprefixed.
	return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia || navigator.msGetUserMedia);
}
function html5File() {
	return window.File && window.FileReader && window.FileList && window.Blob;
}

if (typeof(cordova)!="undefined") {
	Modernizr.load({
		load : 'js/vendor/camera-cordova.js'
	});
} else if (html5File() || html5Camera()) {
	Modernizr.load({
		load : 'js/vendor/camera-html5.js'
	});
} else {
	Modernizr.load({
		load : 'js/vendor/camera.js'
	});
}

