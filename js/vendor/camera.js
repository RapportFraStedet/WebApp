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
	markup += "<div data-role='button' data-inline='true'";
	if (felt.Permission == 1) {
		markup += " class='ui-disabled'";
	}
	markup += ">Fotoalbum<input class='fotoselect' type='file' name='" + felt.Id + "' id='" + felt.Id + "' /></div>";
	markup += "</div>";
	markup += "<div data-role='fieldcontain'>";
	markup += "<label for='A" + felt.Id + "'>Filnavn</label>";
	markup += "<input type='text' id='A" + felt.Id + "' name='A" + felt.Id + "' readonly='readonly'  style='display:none' />";
	markup += "</div>";
	return markup;
}
