/*
  Copyright 2012, MapGuideForm user group, Frederikssund Kommune and Helsingør Kommune - att. Anette Poulsen and Erling Kristensen
  
  This file is part of "RapportFraStedet". 
  "RapportFraStedet" is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.
  "RapportFraStedet" is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  You should have received a copy of the GNU General Public License along with "RapportFraStedet". If not, see <http://www.gnu.org/licenses/>.
*/

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
