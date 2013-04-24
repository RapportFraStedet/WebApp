/*
Copyright 2012, MapGuideForm user group, Frederikssund Kommune and Helsingør Kommune - att. Anette Poulsen and Erling Kristensen

This file is part of "RapportFraStedet".
"RapportFraStedet" is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.
"RapportFraStedet" is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License along with "RapportFraStedet". If not, see <http://www.gnu.org/licenses/>.
 */

function markupCamera(felt) {
	var markup = "<div data-role='fieldcontain'>";
	markup += "<label for='" + felt.Id + "'>";
	if (felt.Required == 1) {
		markup += "<em>*</em>";
	}
	markup += felt.Name + "</label>";
	markup += "<input type='file' name='" + felt.Id + "' id='" + felt.Id + "'";
	if (felt.Permission == 1 || felt.Required == 1) {
		markup += " class='";
		if (felt.Permission == 1) {
			markup += "ui-disabled";
		}
		if (felt.Required == 1) {
			markup += " required";
		}
		markup += "'";
	}
	markup += "/>";
	markup += "</div>";
	return markup;
}
function uploadCamera() {
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
