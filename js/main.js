﻿/*
Copyright 2012, MapGuideForm user group, Frederikssund Kommune and Helsingør Kommune - att. Anette Poulsen and Erling Kristensen

This file is part of "RapportFraStedet".
"RapportFraStedet" is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.
"RapportFraStedet" is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License along with "RapportFraStedet". If not, see <http://www.gnu.org/licenses/>.
 */

var url = "http://service.rapportfrastedet.dk/RapportFraStedet/api/kommune.aspx";
//var url = "http://rtv04/RapportFraStedet/api/kommune.aspx";
var imageId;
var x = 0;
var y = 0;
$(document).bind("mobileinit", function () {
	$.mobile.loadingMessageTextVisible = true;
});
$('[data-role=page]').live('pageshow', function (event, ui) {
	try {
		var send = false;
		var url = "";
		switch (event.currentTarget.id) {
		case "AlleKommuner":
			document.title = "Alle Kommuner";
			url = "#AlleKommuner";
			send = true;
			break;
		case "Kommune":
			document.title = Rfs.kommune.Navn;
			url = "#Kommune?nr=" + Rfs.kommune.Nr;
			send = true;
			break;
		case "Kort":
			document.title = Rfs.kommune.Navn + " - " + Rfs.tema.Navn + " - Kort";
			url = "#Tema?id=" + Rfs.tema.Id + "&Nr=" + Rfs.kommune.Nr;
			send = true;
			break;
		case "Formular":
			document.title = Rfs.kommune.Navn + " - " + Rfs.tema.Navn;
			url = "#Formular";
			send = true;
			break;
		case "PhotoPage":
			document.title = Rfs.kommune.Navn + " - " + Rfs.tema.Navn + " - Kamera";
			url = "#PhotoPage";
			send = true;
			break;
		}
		if (send) {
			_gaq.push(['_setAccount', 'UA-24623853-2']);
			_gaq.push(['_trackPageview', url]);
		}
	} catch (err) {}
	
});
$('[data-role=dialog]').live('pageshow', function (event, ui) {
	try {
		var send = false;
		var url = "";
		switch (event.currentTarget.id) {
		case "Start":
			document.title = "Rapport Fra Stedet";
			url = "";
			send = true;
			break;
		case "Advarsel":
			document.title = Rfs.kommune.Navn + " - Advarsel";
			url = "#Advarsel";
			send = true;
			break;
		case "Kvittering":
			document.title = Rfs.kommune.Navn + " - " + Rfs.tema.Navn + " - Kvittering";
			url = "#Kvittering";
			send = true;
			break;
		}
		if (send) {
			_gaq.push(['_setAccount', 'UA-24623853-2']);
			_gaq.push(['_trackPageview', url]);
		}
	} catch (err) {}
	
});

$(document).ready(function (event) {
	$(window).bind("resize orientationchange", function (e) {
		fixContentHeight();
	});
	Rfs.init();
	$.support.cors = true;
});

function geoLocate() {
	if (x != 0 && y != 0) {
		Rfs.showPosition();
	} else if (navigator.geolocation) {
		$.mobile.showPageLoadingMsg("a", "Finder position...", false);
		navigator.geolocation.getCurrentPosition(
			function (position) {
			$.mobile.hidePageLoadingMsg();
			x = position.coords.longitude;
			y = position.coords.latitude;
			Rfs.lat = position.coords.latitude;
			Rfs.lon = position.coords.longitude;
			Rfs.acc = position.coords.accuracy;
			var source = new Proj4js.Proj('EPSG:4326'); //source coordinates will be in Longitude/Latitude
			var dest = new Proj4js.Proj('EPSG:25832'); //destination coordinates in LCC, south of France
			// transforming point coordinates
			var p = new Proj4js.Point(x, y); //any object will do as long as it has 'x' and 'y' properties
			Proj4js.transform(source, dest, p);
			x = p.x;
			y = p.y;
			Rfs.showPosition();
		},
			function (error) {
			$.mobile.hidePageLoadingMsg();
			$.mobile.changePage("#AlleKommuner");
		}, {
			enableHighAccuracy : true,
			maximumAge : 0,
			timeout : 10000
		});
	} else {
		$.mobile.changePage("#AlleKommuner", {
			transition : "slide"
		});
	}
}

$(document).bind('pageinit', function (e) {
	if (e.target.id == "Start") {
		
		var u = $.mobile.path.parseUrl(window.location.href);
		if (u.hash.search(/^#Tema/) !== -1) {
			e.preventDefault();
			Rfs.showTema(u, {});
		} else if (u.hash.search(/^#Kommune/) !== -1) {
			e.preventDefault();
			Rfs.showKommune(u, {});
		} else if (Rfs.kommune) {
			e.preventDefault();
			Rfs.showKommune(u, {});
		} else if ($('#app').length > 0) {
			var ua = navigator.userAgent.toLowerCase();
			if (ua.indexOf("android") > -1) {
				$('#app').html("<p>Installere Rapport Fra Stedet som app på din smartphone. Klik på nedenstående link.</p><a rel='external' data-ajax='false' href='http://www.rapportfrastedet.dk/RapportFraStedet.apk' ><img src='./img/android.png' alt='Android'/></a>");
			}
			/*else if (ua.indexOf("ipad") > -1 || ua.indexOf("iphone") > -1) {
			$('#app').html("<p>Installere Rapport Fra Stedet som app på din smartphone. Klik på nedenstående link.</p><a rel='external' data-ajax='false' href='http://itunes.com/apps/rapportfrastedet' ><img src='./img/apple.png' alt='Apple'/></a>");
			}*/
			else if (ua.indexOf("ipad") > -1 || ua.indexOf("iphone") > -1) {
				$('#app').html("<p>Tilføj Rapport Fra Stedet som genvej. Klik på <img src='./img/genvej.jpg' alt='genvej'/> i din browser og føj til hjemmeskærm.");
			}
			/*else if (ua.indexOf("Windows Phone") > -1) {
			$('#app').html("<p>Installere Rapport Fra Stedet som app på din smartphone. Klik på nedenstående link.</p><a rel='external' data-ajax='false' href='http://www.windowsphone.com/da-DK/marketplace' ><img src='./img/windows.png' alt='Windows Phone'/></a>");
			}*/
		}
	}
});

$(document).bind("pagebeforechange", function (e, data) {
	if (typeof data.toPage === "string") {
		var u = $.mobile.path.parseUrl(data.toPage);
		if (u.hash.search(/^#Kommune/) !== -1) {
			e.preventDefault();
			Rfs.showKommune(u, data.options);
		} else if (u.hash.search(/^#AlleKommuner/) !== -1) {
			e.preventDefault();
			Rfs.showAlleKommuner(u, data.options);
		} else if (u.hash.search(/^#Tema/) !== -1) {
			e.preventDefault();
			Rfs.showTema(u, data.options);
		} else if (u.hash.search(/^#Advarsel/) !== -1) {
			e.preventDefault();
			Rfs.showAdvarsel(u, data.options);
		} else if (u.hash.search(/^#PhotoPage/) !== -1) {
			e.preventDefault();
			imageId = u.hash.replace(/.*id=/, "");
			$.mobile.changePage($("#PhotoPage"));
		}
	}
});

//window.BlobBuilder = window.MozBlobBuilder || window.WebKitBlobBuilder || window.BlobBuilder;

$('#Progress').live('pageshow', function (event) {
	uploadCamera();
});

var Rfs = {
	url : null,
	mapSet : null,
	temaer : null,
	tema : null,
	rapport : null,
	kommuner : null,
	kommune : null,
	useDrawControl : false,
	showMarker : false,
	showInfo : true,
	lat : 0,
	lon : 0,
	acc : 0,
	ajaxCheck : null,
	init : function () {
		$("#Kommune").page();
		$("#AlleKommuner").page();
		$("#Formular").page();
		$("#Advarsel").page();
		$("#Kort").page();
	},
	showAlleKommuner : function (urlObj, options) {
		if (Rfs.kommuner == null) {
			$.mobile.showPageLoadingMsg("a", "Henter kommuner...", false);
			$.ajax({
				url : url,
				dataType : 'jsonp',
				success : function (data) {
					Rfs.kommuner = data;
					Rfs.kommune = null;
					Rfs.tema = null;
					Rfs.temaer = null;
					var markup = "";
					for (var i = 0; i < data.length; i++) {
						var kommune = data[i];
						markup += "<li";
						if (kommune.ModtagerIndberetning == 0) {
							markup += " data-icon='alert'>";
							markup += "<a href='#Advarsel?nr=" + kommune.Nr + "' data-transition='slide'>";
						} else {
							markup += "><a href='#Kommune?nr=" + kommune.Nr + "' data-transition='slide'>";
						}
						if (kommune.Logo != '') {
							markup += "<img src='http://service.rapportfrastedet.dk/RapportFraStedet/Images/Kommuner/" + kommune.Logo + "' />"
						}
						markup += "<h1>" + kommune.Navn + "</h1>";
						if (kommune.ModtagerIndberetning == 0) {
							markup += "<a href='#Advarsel?nr=" + kommune.Nr + "' data-theme='e' data-transition='slide'></a>";
						}
						markup += "</a></li>";
					}
					var page = $("#AlleKommuner");
					var content = page.children(":jqmData(role=content)");
					content.find("ul").html(markup);
					content.find("ul").listview("refresh");
					$.mobile.changePage(page, options);
				},
				error : function () {
					$.mobile.changePage("#ShowKommunerError");
				},
				complete : function () {
					$.mobile.hidePageLoadingMsg();
				}
			});
		} else {
			$.mobile.changePage($("#AlleKommuner"), options);
		}
	},
	showKommune : function (urlObj, options) {
		options.dataUrl = urlObj.hash;
		var nr = urlObj.hash.replace(/.*nr=/, "");
		/*if (nr == "#Kommune") {
		$.mobile.changePage($("#Kommune"), options);
		} else {*/
		if (Rfs.kommune && Rfs.kommune.Nr == nr) {
			Rfs.showThemes(urlObj, options);
		} else {
			if (Rfs.kommuner != null) {
				for (var i = 0; i < Rfs.kommuner.length; i++) {
					if (Rfs.kommuner[i].Nr == nr) {
						Rfs.kommune = Rfs.kommuner[i];
						break;
					}
				}
			}
			if (Rfs.kommune == null) {
				$.mobile.showPageLoadingMsg("a", "Henter kommune...", false);
				$.ajax({
					url : url,
					dataType : 'jsonp',
					data : {
						nr : nr
					},
					success : function (data) {
						Rfs.kommune = data;
						Rfs.showThemes(urlObj, options);
						/*if (data.ModtagerIndberetning) {
						$.mobile.changePage("#Kommune?nr=" + data.Nr);
						} else {
						var page = $("#ModtagerIkkeIndberetning");
						var content = page.children(":jqmData(role=content)");
						var markup = "";
						markup += "<h2>Du står i " + data.Navn + " Kommune</h2>";
						markup += "<p>RapportFraStedet kan ikke indberette til denne kommune!</p>";
						if (Rfs.kommune.Besked != "") {
						markup += "<p>" + data.Besked + "</p>"
						}
						if (data.URL != "") {
						markup += "<a href='" + data.URL + "' rel='external' data-ajax='false' data-role='button'>Kontakt</a>";
						}
						markup += "<p>Du kan vælge at indberette til en anden kommune.</p>";
						markup += "<a href='#AlleKommuner' data-role='button' data-theme='b' >Vælg kommune</a>";
						content.html(markup);
						page.trigger("create");
						$.mobile.changePage("#ModtagerIkkeIndberetning");
						}*/
					},
					error : function (jqXHR, textStatus, errorThrown) {
						$.mobile.changePage("#ShowKommunerError");
					},
					complete : function () {
						$.mobile.hidePageLoadingMsg();
					}
				});
			} else {
				/*$.mobile.showPageLoadingMsg("a", "Henter temaer...", false);
				$.ajax({
				url : Rfs.kommune.URL + "/api/Tema.aspx",
				dataType : 'jsonp',
				data : {
				nr : Rfs.kommune.Nr,
				x : x,
				y : y
				},
				success : function (data) {
				Rfs.createKommune(data);
				var page = $("#Kommune");
				$.mobile.changePage(page, options);
				},
				error : function () {
				$.mobile.changePage("#ShowKommunerError");
				},
				complete : function () {
				$.mobile.hidePageLoadingMsg();
				}
				});*/
				Rfs.showThemes(urlObj, options);
			}
		}
		
	},
	showThemes : function (urlObj, options) {
		Rfs.tema = null;
		if (Rfs.temaer) {
			var page = $("#Kommune");
			$.mobile.changePage(page, options);
		} else if (Rfs.kommune.ModtagerIndberetning) {
			$.mobile.showPageLoadingMsg("a", "Henter temaer...", false);
			$.ajax({
				url : Rfs.kommune.URL + "/api/Tema.aspx",
				dataType : 'jsonp',
				data : {
					nr : Rfs.kommune.Nr,
					x : x,
					y : y
				},
				success : function (data) {
					Rfs.createKommune(data);
					var page = $("#Kommune");
					$.mobile.changePage(page, options);
				},
				error : function () {
					$.mobile.changePage("#ShowKommunerError");
				},
				complete : function () {
					$.mobile.hidePageLoadingMsg();
				}
			});
			
		} else {
			var page = $("#ModtagerIkkeIndberetning");
			var content = page.children(":jqmData(role=content)");
			var markup = "";
			markup += "<h2>Du står i " + data.Navn + " Kommune</h2>";
			markup += "<p>RapportFraStedet kan ikke indberette til denne kommune!</p>";
			if (Rfs.kommune.Besked != "") {
				markup += "<p>" + data.Besked + "</p>"
			}
			if (data.URL != "") {
				markup += "<a href='" + data.URL + "' rel='external' data-ajax='false' data-role='button'>Kontakt</a>";
			}
			markup += "<p>Du kan vælge at indberette til en anden kommune.</p>";
			markup += "<a href='#AlleKommuner' data-role='button' data-theme='b' >Vælg kommune</a>";
			content.html(markup);
			page.trigger("create");
			$.mobile.changePage("#ModtagerIkkeIndberetning");
		}
	},
	
	createKommune : function (data) {
		Rfs.temaer = data;
		var page = $("#Kommune");
		var header = page.children(":jqmData(role=header)");
		var markup = "";
		var img = header.find("img");
		img[0].src = "http://service.rapportfrastedet.dk/RapportFraStedet/Images/Kommuner/" + Rfs.kommune.Logo;
		if (Rfs.kommune.Logo == '') {
			img[0].style.visibility = "hidden";
		} else {
			img[0].style.visibility = "visible";
		}
		header.find("h1").html(Rfs.kommune.Navn + " Kommune");
		markup = "";
		for (var i = 0; i < Rfs.temaer.length; i++) {
			var tema = Rfs.temaer[i];
			markup += "<li"
			if (tema.ModtagerIndberetning == 0) {
				markup += " data-icon='alert'";
			}
			markup += "><a href='#Tema?id=" + tema.Id + "&nr=" + Rfs.kommune.Nr + "' data-transition='slide'>";
			if (tema.Logo != '') {
				markup += "<img src='" + tema.Logo + "' />"
			}
			markup += "<h1>" + tema.Navn + "</h1><p>" + tema.Beskrivelse + "</p>";
			if (tema.ModtagerIndberetning == 0) {
				markup += "<a href='#Warning' data-theme='e' data-rel='dialog' data-transition='slide'></a>";
			}
			markup += "</a></li>";
		}
		
		var content = page.children(":jqmData(role=content)");
		content.find("ul").html(markup);
		content.find("ul").listview("refresh");
		page.page();
	},
	showTema : function (urlObj, options) {
		options.dataUrl = urlObj.hash;
		Rfs.rapport = null;
		var params = urlObj.hash.split('&');
		var id = params[0].replace(/.*id=/, "");
		var nr = params[1].replace(/.*nr=/, "");
		if (Rfs.kommune && Rfs.kommune.Nr == nr) {
			if (Rfs.tema && Rfs.tema.Id == id) {
				Rfs.createTema(urlObj, options);
			} else {
				Rfs.tema = null;
				if (Rfs.temaer != null) {
					for (var i = 0; i < Rfs.temaer.length; i++) {
						if (Rfs.temaer[i].Id == id && Rfs.temaer[i].Nr == nr) {
							Rfs.tema = Rfs.temaer[i];
							break;
						}
					}
				}
				if (Rfs.tema == null) {
					$.mobile.showPageLoadingMsg("a", "Henter tema...", false);
					$.ajax({
						url : Rfs.kommune.URL + "/api/Tema.aspx",
						dataType : 'jsonp',
						data : {
							nr : nr,
							id : id
						},
						success : function (data) {
							Rfs.tema = data;
							Rfs.createTema(urlObj, options);
						},
						error : function () {
							$.mobile.changePage("#ShowKommunerError");
						},
						complete : function () {
							$.mobile.hidePageLoadingMsg();
						}
					});
				} else {
					Rfs.createTema(urlObj, options);
				}
				
			}
		} else {
			if (Rfs.kommuner != null) {
				for (var i = 0; i < Rfs.kommuner.length; i++) {
					if (Rfs.kommuner[i].Nr == nr) {
						Rfs.kommune = Rfs.kommuner[i];
						break;
					}
				}
			}
			if (Rfs.kommune == null) {
				$.mobile.showPageLoadingMsg("a", "Henter kommune...", false);
				$.ajax({
					url : url,
					dataType : 'jsonp',
					data : {
						nr : nr
					},
					success : function (data) {
						Rfs.kommune = data;
						Rfs.showTema(urlObj, options);
					},
					error : function (jqXHR, textStatus, errorThrown) {
						$.mobile.changePage("#ShowKommunerError");
					},
					complete : function () {
						$.mobile.hidePageLoadingMsg();
					}
				});
			} else {
				Rfs.showTema(urlObj, options);
			}
		}
	},
	createTema : function (urlObj, options) {
		if (Rfs.tema != null) {
			$.mobile.showPageLoadingMsg("a", "Henter tema...", false);
			
			$('#tegnList').html("<li data-role='divider' data-theme='a'>Tegneværktøjer</li>");
			var appurl = Rfs.tema.MapAgent.toLowerCase().replace("mapagent/mapagent.fcgi", "fusion") + "/layers/mapguide/php/ApplicationDefinition.php?USERNAME=Anonymous&CLIENTAGENT=Rapport+Fra+Stedet+1.0.0&appid=" + Rfs.tema.ApplicationDefinition;
			$.ajax({
				url : appurl,
				dataType : 'jsonp',
				complete : function () {
					$.mobile.hidePageLoadingMsg();
				},
				error : function (jqXHR, textStatus, errorThrown) {
					$.mobile.changePage("#ShowKommunerError");
				},
				success : function (appdef) {
					Rfs.useDrawControl = false;
					Rfs.showMarker = false;
					$("#kortnavbar").hide();
					$("#backKommune").attr('href', '#Kommune?nr=' + Rfs.kommune.Nr);
					var formsUrl = "";
					if (appdef.ApplicationDefinition && appdef.ApplicationDefinition.length > 0 && appdef.ApplicationDefinition[0].MapSet && appdef.ApplicationDefinition[0].MapSet.length > 0) {
						Rfs.mapSet = appdef.ApplicationDefinition[0].MapSet[0];
						oiorest.init();
						if (appdef.ApplicationDefinition[0].WidgetSet && appdef.ApplicationDefinition[0].WidgetSet.length > 0) {
							for (widget in appdef.ApplicationDefinition[0].WidgetSet[0].Widget) {
								var m = appdef.ApplicationDefinition[0].WidgetSet[0].Widget[widget];
								switch (m.Type[0]) {
								case "RfsSearch":
									var ext = m.Extension[0];
									var search = new Search(widget, m.Name[0], m.Disabled[0] == "false");
									search.placeholder1 = ext.placeholder1[0];
									search.url1 = ext.url1[0].replace(/%26/gi, '&');
									search.id1 = ext.id1[0];
									search.name1 = ext.name1[0];
									search.chars1 = ext.chars1[0];
									search.title1 = ext.title1[0];
									if (ext.placeholder2)
										search.placeholder2 = ext.placeholder2[0];
									if (ext.url2)
										search.url2 = ext.url2[0].replace(/%26/gi, '&');
									if (ext.id2)
										search.id2 = ext.id2[0];
									if (ext.name2)
										search.name2 = ext.name2[0];
									if (ext.chars2)
										search.chars2 = ext.chars2[0];
									if (ext.title2)
										search.title2 = ext.title2[0];
									if (ext.placeholder3)
										search.placeholder3 = ext.placeholder3[0];
									if (ext.url3)
										search.url3 = ext.url3[0].replace(/%26/gi, '&');
									if (ext.id3)
										search.id3 = ext.id3[0];
									if (ext.name3)
										search.name3 = ext.name3[0];
									if (ext.chars3)
										search.chars3 = ext.chars3[0];
									if (ext.title3)
										search.title3 = ext.title3[0];
									search.url = ext.url[0].replace(/%26/gi, '&');
									search.x1 = ext.x1[0];
									search.y1 = ext.y1[0];
									/*if (ext.zoom)
									search.zoom = ext.zoom[0];*/
									search.projection = ext.projection[0];
									oiorest.items.push(search);
									break;
								case "RapportFraStedet":
									$("#kortnavbar").show();
									var ext = m.Extension[0];
									if (ext.type[0] != '-1' && ext.type[0] != '0') {
										$('#tegnList').html("<li data-role='divider' data-theme='a'>Tegneværktøjer</li>");
										Rfs.useDrawControl = true;
									}
									if (ext.type[0] == '-1') {
										Rfs.showMarker = false;
									}
									if (ext.type[0] == '-1') {
										Rfs.showMarker = true;
									}
									if (ext.type[0] == '1' || ext.type[0] == '3' || ext.type[0] == '5' || ext.type[0] == '7')
										$("<li id='tegnPunkt' data-icon='check'><a href='#' data-rel='back' onclick='Point()'>Punkt</a></li>").appendTo('#tegnList');
									if (ext.type[0] == '2' || ext.type[0] == '3' || ext.type[0] == '6' || ext.type[0] == '7')
										$("<li id='tegnLinie' data-icon='check'><a href='#' data-rel='back' onclick='Path()'>Linie</a></li>").appendTo('#tegnList');
									if (ext.type[0] == '4' || ext.type[0] == '5' || ext.type[0] == '6' || ext.type[0] == '7')
										$("<li id='tegnPolygon' data-icon='check'><a href='#' data-rel='back' onclick='Polygon()'>Polygon</a></li>").appendTo('#tegnList');
									if (ext.type[0] != '-1' && ext.type[0] != '0') {
										$("<li id='tegnRediger' data-icon='check'><a href='#' data-rel='back' onclick='Modify()'>Rediger</a></li>").appendTo('#tegnList');
										$("<li id='tegnNaviger' data-icon='check' class='checked'><a href='#' data-rel='back' onclick='Navigate()'>Naviger</a></li>").appendTo('#tegnList');
										$('#tegnList').listview('refresh');
									}
									if (ext.Url) {
										Rfs.url = ext.Url[0];
									}
									
									break;
								}
							}
							var page = $("#Kort");
							var header = $("#headerKort").html("");
							//var markup = "<a data-role='button' data-mini='true' data-corners='false' data-iconpos='top' class='ui-block-a' data-icon='locate' onclick='locate()' >Position</a>";
							$("<a data-role='button' data-mini='true' data-corners='false' data-iconpos='top' class='ui-block-a' data-theme='a' data-icon='locate' onclick='locate()' >Position</a>").button().appendTo(header);
							if (oiorest.items.length > 0) {
								$("<a data-role='button' data-mini='true' data-corners='false' data-iconpos='top' class='ui-block-b' data-theme='a' href='#SearchPage1' data-icon='search' >Søg</a>").button().appendTo(header);
								if (Rfs.useDrawControl) {
									$("<a data-role='button' data-mini='true' data-corners='false' data-iconpos='top' class='ui-block-c' data-theme='a' href='#Tegn' data-icon='star' data-rel='popup' data-position-to='window' >Tegn</a>").button().appendTo(header);
									$("<a data-role='button' data-mini='true' data-corners='false' data-iconpos='top' class='ui-block-d' data-theme='a' href='#layerspage' data-icon='layers' data-rel='popup' data-position-to='window' >Kort</a>").button().appendTo(header);
									header.removeClass('ui-grid-a');
									header.removeClass('ui-grid-b');
									header.addClass('ui-grid-c');
								} else {
									$("<a data-role='button' data-mini='true' data-corners='false' data-iconpos='top' class='ui-block-c' data-theme='a' href='#layerspage' data-icon='layers' data-rel='popup' data-position-to='window' >Kort</a>").button().appendTo(header); ;
									header.removeClass('ui-grid-a');
									header.removeClass('ui-grid-c');
									header.addClass('ui-grid-b');
								}
							} else if (Rfs.useDrawControl) {
								$("<a data-theme='a' data-role='button' data-mini='true' data-corners='false' data-iconpos='top' class='ui-block-c' href='#Tegn' data-icon='star' data-rel='popup' data-position-to='window' >Tegn</a>").button().appendTo(header); ;
								$("<a data-theme='a' data-role='button' data-mini='true' data-corners='false' data-iconpos='top' class='ui-block-d' href='#layerspage' data-icon='layers' data-rel='popup' data-position-to='window' >Kort</a>").button().appendTo(header); ;
								header.removeClass('ui-grid-a');
								header.removeClass('ui-grid-c');
								header.addClass('ui-grid-b');
							} else {
								$("<a data-theme='a' data-role='button' data-mini='true' data-corners='false' data-iconpos='top' class='ui-block-c' href='#layerspage' data-icon='layers' data-rel='popup' data-position-to='window' >Kort</a>").button().appendTo(header); ;
								header.removeClass('ui-grid-b');
								header.removeClass('ui-grid-c');
								header.addClass('ui-grid-a');
							}
							//header.html(markup);
							//page.trigger('create');
							if (oiorest.items.length > 1) {
								$('#searchOptionsDiv').html("<fieldset id='searchOptions' data-role='controlgroup'><legend>Søgemuligheder</legend></fieldset>");
								for (search in oiorest.items) {
									oiorest.items[search].createCheckBox();
								}
								$("#SearchPage1").trigger("create");
							} else {
								$('#searchOptionsDiv').html("");
							}
						}
						if (Rfs.url) {
							var url = Rfs.url.replace('Data.aspx/Index', 'api/DataApi.aspx');
							Rfs.url = Rfs.url.substr(0, Rfs.url.indexOf('/Data.aspx/Index'));
							$.mobile.showPageLoadingMsg("a", "Henter formular...", false);
							$.ajax({
								url : url,
								dataType : 'jsonp',
								success : function (data) {
									Rfs.createform(data, options);
								},
								error : function () {
									$.mobile.changePage("#ShowKommunerError");
								},
								complete : function () {
									$.mobile.hidePageLoadingMsg();
								}
							});
						} else {
							Rfs.showInfo = true;
							createMap();
							$.mobile.changePage("#Kort", options);
						}
					}
					
				}
			});
		}
	},
	createform : function (data, options) {
		Rfs.rapport = data;
		var felter = data.Felter;
		var page = $("#Formular");
		var header = page.children(":jqmData(role=header)");
		var img = header.find("img");
		img[0].src = Rfs.tema.Logo;
		if (Rfs.tema.Logo == '') {
			img[0].style.visibility = "hidden";
		} else {
			img[0].style.visibility = "visible";
		}
		header.find("h1").html(Rfs.tema.Navn);
		var markup = "<input type='hidden' name='FormId' value='" + Rfs.rapport.FormId + "'/>";
		markup += "<input type='hidden' name='UniqueId' value='" + Rfs.rapport.UniqueId + "'/>";
		markup += "<input type='hidden' name='ItemId' value='" + Rfs.rapport.ItemId + "'/>";
		markup += "<input type='hidden' name='ViewId' value='" + Rfs.rapport.ViewId + "'/>";
		markup += "<input type='hidden' name='UserId' value='" + Rfs.rapport.UserId + "'/>";
		markup += "<input type='hidden' name='Date' value='" + Rfs.rapport.Date + "'/>";
		markup += "<fieldset>";
		for (var i = 0; i < felter.length; i++) {
			var felt = felter[i];
			if (!felt.Data)
				felt.Data = "";
			
			if (felt.Permission == 0) {
				handled = true;
				switch (felt.TypeId) {
				case 16:
					markup += "<input type='hidden' name='Geometri' value='" + felt.Data + "' id='Geometri'";
					if (felt.Required == 1) {
						markup += " class=required";
					}
					markup += "/>";
					break;
				case 17:
					markup += "<input type='hidden' name='Position' value='" + felt.Data + "' id='Position'";
					if (felt.Required == 1) {
						markup += " class=required";
					}
					markup += "/>";
					break;
					break;
				case 18:
					markup += "<input type='hidden' name='Accuracy' value='" + felt.Data + "' id='Accuracy'";
					if (felt.Required == 1) {
						markup += " class=required";
					}
					markup += "/>";
					break;
				default:
					markup += "<input type='hidden' name='" + felt.Id + "' value='" + felt.Data + "' id='" + felt.Id + "'";
					if (felt.Required == 1) {
						markup += " class=required";
					}
					markup += "/>";
					break;
				}
			} else {
				switch (felt.TypeId) {
				case 1: //Label
					markup += "<div data-role='fieldcontain'>";
					markup += "<label for='" + felt.Id + "'>" + felt.Name + "</label>";
					markup += "</div>";
					break;
				case 2: //TextBox
					markup += "<div data-role='fieldcontain'>";
					markup += "<label for='" + felt.Id + "'>";
					if (felt.Required == 1) {
						markup += "<em>*</em>";
					}
					markup += felt.Name + "</label>";
					markup += "<input type='text' id='" + felt.Id + "' name='" + felt.Id + "' value='" + felt.Data + "'";
					if (felt.Required == 1) {
						markup += " class=required";
					}
					if (felt.Permission == 1) {
						markup += " disabled='disabled'";
					}
					markup += " />";
					markup += "</div>";
					break;
				case 3: //DropDown
					markup += "<div data-role='fieldcontain'>";
					markup += "<label for='" + felt.Id + "'>";
					if (felt.Required == 1) {
						markup += "<em>*</em>";
					}
					markup += felt.Name + "</label>";
					markup += "<select id='" + felt.Id + "' name='" + felt.Id + "' value='" + felt.Data + "'";
					if (felt.Required == 1) {
						markup += " class=required";
					}
					if (felt.Permission == 1) {
						markup += " disabled='disabled'";
					}
					markup += ">";
					markup += "<option data-placeholder='true'>-- Vælg --</option>";
					var selections = felt.Selections;
					for (var j = 0; j < selections.length; j++) {
						var selection = selections[j];
						markup += "<option value='" + selection.Name + "'";
						if (selection.Selected == 1) {
							markup += " selected='selected'";
						}
						markup += ">" + selection.Name + "</option>";
					}
					markup += "</select>";
					markup += "</div>";
					break;
				case 4: //RadioButton
					markup += "<div data-role='fieldcontain'>";
					markup += "<fieldset data-role='controlgroup'><legend>";
					if (felt.Required == 1) {
						markup += "<em>*</em>";
					}
					markup += felt.Name + "</legend>";
					var selections = felt.Selections;
					for (var j = 0; j < selections.length; j++) {
						var selection = selections[j];
						markup += "<input type='radio' id='" + selection.Id + "' name='" + felt.Id + "' value='" + selection.Name + "'";
						if (selection.Selected == 1) {
							markup += " checked='checked'";
						}
						if (felt.Required == 1) {
							markup += " class=required";
						}
						if (felt.Permission == 1) {
							markup += " disabled='disabled'";
						}
						markup += "/><label for='" + selection.Id + "'>" + selection.Name + "</label>";
					}
					markup += "</fieldset>";
					markup += "</div>";
					break;
				case 5: //TextArea
					markup += "<div data-role='fieldcontain'>";
					markup += "<label for='" + felt.Id + "'>";
					if (felt.Required == 1) {
						markup += "<em>*</em>";
					}
					markup += felt.Name + "</label>";
					markup += "<textarea id='" + felt.Id + "' name='" + felt.Id + "'";
					if (felt.Required == 1) {
						markup += " class=required";
					}
					if (felt.Permission == 1) {
						markup += " disabled='disabled'";
					}
					markup += ">";
					markup += felt.Data;
					markup += "</textarea>";
					markup += "</div>";
					break;
				case 6: //CheckBox
					markup += "<div data-role='fieldcontain'>";
					markup += "<fieldset data-role='controlgroup'><legend>";
					if (felt.Required == 1) {
						markup += "<em>*</em>";
					}
					markup += felt.Name + "</legend>";
					markup += "<input type='checkbox' id='" + felt.Id + "' name='" + felt.Id + "'";
					if (felt.Data == 'true') {
						markup += " checked='checked'";
					}
					if (felt.Required == 1) {
						markup += " class=required";
					}
					if (felt.Permission == 1) {
						markup += " disabled='disabled'";
					}
					markup += " /><label for='" + felt.Id + "'>" + felt.Name + "</label>";
					markup += "</fieldset>";
					markup += "</div>";
					break;
				case 7: //Email
					markup += "<div data-role='fieldcontain'>";
					markup += "<label for='" + felt.Id + "'>";
					if (felt.Required == 1) {
						markup += "<em>*</em>";
					}
					markup += felt.Name + "</label>";
					markup += "<input type='email' id='" + felt.Id + "' name='" + felt.Id + "' value='" + felt.Data + "'";
					if (felt.Required == 1) {
						markup += " class=required";
					}
					if (felt.Permission == 1) {
						markup += " disabled='disabled'";
					}
					markup += " />";
					markup += "</div>";
					break;
				case 8: //Upload
					markup += markupCamera(felt);
					break;
				case 10: //Date
					markup += markupDate(felt);
					break;
				case 12: //Email ved oprettelse
					markup += "<div data-role='fieldcontain'>";
					markup += "<fieldset data-role='controlgroup'><legend>";
					if (felt.Required == 1) {
						markup += "<em>*</em>";
					}
					markup += felt.Name + "</legend>";
					markup += "<input type='checkbox' id='" + felt.Id + "' name='" + felt.Id + "'";
					if (felt.Data == 'true') {
						markup += " checked='checked'";
					}
					if (felt.Required == 1) {
						markup += " class=required";
					}
					if (felt.Permission == 1) {
						markup += " disabled='disabled'";
					}
					markup += " /><label for='" + felt.Id + "'>" + felt.Name + "</label>";
					markup += "</fieldset>";
					markup += "</div>";
					break;
				case 13: //Email ved ændring
					markup += "<div data-role='fieldcontain'>";
					markup += "<fieldset data-role='controlgroup'><legend>";
					if (felt.Required == 1) {
						markup += "<em>*</em>";
					}
					markup += felt.Name + "</legend>";
					markup += "<input type='checkbox' id='" + felt.Id + "' name='" + felt.Id + "'";
					if (felt.Data == 'true') {
						markup += " checked='checked'";
					}
					if (felt.Required == 1) {
						markup += " class=required";
					}
					if (felt.Permission == 1) {
						markup += " disabled='disabled'";
					}
					markup += " /><label for='" + felt.Id + "'>" + felt.Name + "</label>";
					markup += "</fieldset>";
					markup += "</div>";
					break;
				case 14: //URL link
					markup += "<div data-role='fieldcontain'>";
					markup += "<a data-role='button' data-inline='true' href='" + felt.Data + "'>" + felt.Name + "</a>";
					markup += "</div>";
					break;
				case 15: //NumberBox
					markup += "<div data-role='fieldcontain'>";
					markup += "<label for='" + felt.Id + "'>";
					if (felt.Required == 1) {
						markup += "<em>*</em>";
					}
					markup += felt.Name + "</label>";
					markup += "<input type='text' id='" + felt.Id + "' name='" + felt.Id + "' value='" + felt.Data + "'";
					if (felt.Required == 1) {
						markup += " class=required";
					}
					if (felt.Permission == 1) {
						markup += " disabled='disabled'";
					}
					markup += " />";
					markup += "</div>";
					break;
				case 16: //Geometri
					markup += "<div data-role='fieldcontain'>";
					markup += "<label for='Geometri'>";
					if (felt.Required == 1) {
						markup += "<em>*</em>";
					}
					markup += felt.Name + "</label>";
					markup += "<textarea id='Geometri' name='Geometri'";
					if (felt.Required == 1) {
						markup += " class=required";
					}
					if (felt.Permission == 1) {
						markup += " disabled='disabled'";
					}
					markup += ">";
					markup += felt.Data;
					markup += "</textarea>";
					markup += "</div>";
					break;
				case 17: //Position
					markup += "<div data-role='fieldcontain'>";
					markup += "<label for='Position'>";
					if (felt.Required == 1) {
						markup += "<em>*</em>";
					}
					markup += felt.Name + "</label>";
					markup += "<textarea id='Position' name='Position'";
					if (felt.Required == 1) {
						markup += " class=required";
					}
					if (felt.Permission == 1) {
						markup += " disabled='disabled'";
					}
					markup += ">";
					markup += felt.Data;
					markup += "</textarea>";
					markup += "</div>";
					break;
				case 18: //Accuracy
					markup += "<div data-role='fieldcontain'>";
					markup += "<label for='Accuracy'>";
					if (felt.Required == 1) {
						markup += "<em>*</em>";
					}
					markup += felt.Name + "</label>";
					markup += "<input type='text' id='Accuracy' name='Accuracy' value='" + felt.Data + "'";
					if (felt.Required == 1) {
						markup += " class=required";
					}
					if (felt.Permission == 1) {
						markup += " disabled='disabled'";
					}
					markup += " />";
					markup += "</div>";
					break;
				case 22: //Skillelinie
					markup += "<hr />";
					break;
				case 23: //Overskrift1
					markup += "<h1>" + felt.Name + "</h1>";
					break;
				case 24: //Paragraph
					markup += "<p>" + felt.Name + "</p>";
				}
			}
		}
		
		markup += "</fieldset>";
		//$(markup).appendTo("#rapportForm").trigger("create");
		$("#rapportForm").html(markup).trigger("create");
		//page.trigger("create");
		$(':file').bind('change', this.inputChanged);
		
		$("#rapportForm").validate();
		Rfs.showInfo = true;
		createMap();
		$.mobile.changePage("#Kort", options);
	},
	inputChanged : function (e) {
		imageId = this.name;
		if (html5File()) {
			var blob = this.files[0]; // FileList object
			if (blob.type.match('image.*')) {
				var reader = new FileReader();
				
				// Closure to capture the file information.
				reader.onload = (function (theFile) {
					return function (e) {
						$("#A" + imageId).attr("src", e.target.result).css('display', 'inline').removeClass('imageCamera');
					};
				})(blob);
				
				// Read in the image file as a data URL.
				reader.readAsDataURL(blob);
			}
		} else {
			$("#A" + imageId).val(this.value).css('display', 'inline-block');
		}
	},
	showPosition : function () {
		$.mobile.showPageLoadingMsg("a", "Henter temaer...", false);
		$.ajax({
			url : url,
			dataType : 'jsonp',
			data : {
				x : x,
				y : y
			},
			success : function (data) {
				Rfs.kommune = data;
				if (data.ModtagerIndberetning) {
					$.mobile.changePage("#Kommune?nr=" + data.Nr);
				} else {
					var page = $("#ModtagerIkkeIndberetning");
					var content = page.children(":jqmData(role=content)");
					var markup = "";
					markup += "<h2>Du står i " + data.Navn + " Kommune</h2>";
					markup += "<p>RapportFraStedet kan ikke indberette til denne kommune!</p>";
					if (Rfs.kommune.Besked != "") {
						markup += "<p>" + data.Besked + "</p>"
					}
					if (data.URL != "") {
						markup += "<a href='" + data.URL + "' rel='external' data-ajax='false' data-role='button'>Kontakt</a>";
					}
					markup += "<p>Du kan vælge at indberette til en anden kommune.</p>";
					markup += "<a href='#AlleKommuner' data-role='button' data-theme='b' >Vælg kommune</a>";
					content.html(markup);
					page.trigger("create");
					$.mobile.changePage("#ModtagerIkkeIndberetning");
				}
			},
			error : function (jqXHR, textStatus, errorThrown) {
				$.mobile.changePage("#ShowKommunerError");
			},
			complete : function () {
				$.mobile.hidePageLoadingMsg();
			}
		});
	},
	Validate : function () {
		if ($("#rapportForm").valid())
			$('#Confirm').popup("open", {
				positionTo : "window",
				transition : "pop"
			});
	},
	showAdvarsel : function (urlObj, options) {
		var nr = urlObj.hash.replace(/.*nr=/, "");
		if (Rfs.kommuner != null) {
			for (var i = 0; i < Rfs.kommuner.length; i++) {
				if (Rfs.kommuner[i].Nr == nr) {
					Rfs.kommune = Rfs.kommuner[i];
					break;
				}
			}
		}
		if (Rfs.kommune != null) {
			var page = $("#Advarsel");
			var markup = "";
			markup += "<h2>" + Rfs.kommune.Navn + " Kommune</h2>";
			markup += "<p>Rapport Fra Stedet kan ikke indberette til denne kommune!</p>";
			if (Rfs.kommune.Besked != "") {
				markup += "<p>" + Rfs.kommune.Besked + "</p>"
			}
			if (Rfs.kommune.URL != "") {
				markup += "<a href='" + Rfs.kommune.URL + "' rel='external' data-ajax='false' data-role='button'>Kontakt</a>";
			}
			markup += "<p>Du kan vælge at indberette til en anden kommune.</p>";
			markup += "<a href='#AlleKommuner' data-role='button' data-theme='b' >Vælg kommune</a>";
			$("#update").html(markup);
			page.trigger("create");
			$.mobile.changePage(page, options);
		}
	},
	checkIndberetning : function () {
		if (Rfs.ajaxCheck != null) {
			Rfs.ajaxCheck.abort();
		}
		var position = $("#Position");
		if (position.length > 0 && Rfs.lon && Rfs.lat)
			position.val("POINT(" + Rfs.lon + " " + Rfs.lat + ")");
		var accuracy = $("#Accuracy");
		if (accuracy.length > 0 && Rfs.acc)
			accuracy.val(Rfs.acc);
		var geometri = $("#Geometri");
		if (geometri.length > 0) {
			$.mobile.showPageLoadingMsg("a", "Validerer placering...", false);
			Rfs.ajaxCheck = $.ajax({
					url : Rfs.url + "/api/Tema.aspx",
					dataType : "jsonp",
					data : {
						id : Rfs.tema.Id,
						geometri : geometri.val()
					},
					success : function (data) {
						if (data == true)
							$.mobile.changePage($("#Formular"), {
								transition : 'slide'
							});
						else
							$("#GeometryError").popup('open');
					},
					error : function (jqXHR, textStatus, errorThrown) {
						$.mobile.changePage("#ShowKommunerError");
					},
					complete : function () {
						$.mobile.hidePageLoadingMsg();
					}
				});
		} else {
			var geometri = $("#Geometri");
			if (geometri.length > 0) {
				if (geometri.hasClass('required'))
					$("#GeometryError").popup('open');
				else
					$.mobile.changePage($("#Formular"), {
						transition : 'slide'
					});
			} else {
				$.mobile.changePage($("#Formular"), {
					transition : 'slide'
				});
			}
		}
	}
}

var kommuneNr = null;
$('#SearchPage1').live('pageinit', function (event) {
	//oiorest.init();
	$("#search1").bind("keyup change", function (event) {
		var text = $(this).val();
		oiorest.search(text);
	});
});
/*$('#SearchPage2').live('pageshow', function (event) {
oiorest.activeSearch.search2("");

});*/
$('#OioVej').live('pageinit', function (event) {});

var oiorest = {
	kommuneNr : null,
	kommuner : null,
	vejNr : null,
	ajax : new Array(),
	items : null,
	activeSearch : null,
	search : function (text) {
		for (var i = 0; i < this.items.length; i++) {
			if (this.items[i].text1 != text) {
				this.items[i].text1 = text;
				this.items[i].search1();
			}
		}
	},
	init : function () {
		$("#searchOptions>.ui-controlgroup-controls").html("");
		$("#searchResult1").html("");
		this.items = new Array();
		$("#SearchPage1").page();
		$("#SearchPage2").page();
		$("#SearchPage3").page();
		$("#searchInput2").bind("keyup change", function () {
			var text = $(this).val();
			if (text.length >= oiorest.activeSearch.chars2 && oiorest.activeSearch.text2 != text) {
				oiorest.activeSearch.text2 = text;
				oiorest.activeSearch.search2();
			}
		});
		$("#searchInput3").bind("keyup change", function () {
			var text = $(this).val();
			if (text.length >= oiorest.activeSearch.chars3 && oiorest.activeSearch.text3 != text) {
				oiorest.activeSearch.text3 = text;
				oiorest.activeSearch.search3();
			}
		});
	}
};

Search = function (id, title, checked) {
	this.id = id;
	this.title = title;
	this.checked = checked;
	this.ajax = null;
	
	this.x1 = null;
	this.y1 = null;
	this.x2 = null;
	this.y2 = null;
	this.url = null;
	this.projection = null;
	
	this.title1 = null;
	this.title2 = null;
	this.title3 = null;
	this.url1 = null;
	this.url2 = null;
	this.url3 = null;
	this.id1 = null;
	this.id2 = null;
	this.id3 = null;
	this.name1 = null;
	this.name2 = null;
	this.name3 = null;
	this.placeholder1 = null;
	this.placeholder2 = null;
	this.placeholder3 = null;
	this.chars1 = null;
	this.chars2 = null;
	this.chars3 = null;
	this.text1 = "";
	this.text2 = "";
	this.text3 = "";
	this.selection1 = null;
	this.selection2 = null;
	this.selection3 = null;
	//this.zoom = null;
	var self = this;
	
	var searchList = $("<ul>", {
			"id" : "searchList" + this.id,
			"data-role" : "listview",
			"data-inset" : "true",
			"data-count-theme" : "b"
		}).appendTo("#searchResult1");
	searchList.listview();
	
	this.createCheckBox = function () {
		var mycheck = $("<input>", {
				"name" : "searchOption" + this.id,
				"id" : "searchOption" + this.id,
				"type" : "checkbox"
			});
		if (self.checked) {
			mycheck.attr("checked", "checked");
		}
		mycheck.bind("change", function (event, ui) {
			self.checked = event.target.checked;
			
			if (self.checked) {
				self.search1();
			} else {
				var searchList = $("#searchList" + self.id);
				searchList.html("");
				
			}
		});
		mycheck.appendTo("#searchOptions");
		$("<label>", {
			"for" : "searchOption" + self.id,
			"text" : this.title
		}).appendTo("#searchOptions");
	};
	this.search1 = function () {
		if (self.checked) {
			$("#searchList" + self.id).html("");
			if (self.text1.length >= self.chars1) {
				if (self.ajax != null) {
					self.ajax.abort();
				}
				$.mobile.showPageLoadingMsg("a", "Søger...", false);
				self.ajax = $.ajax({
						url : self.url1.replace("[text]", self.text1).replace("[kommune]", Rfs.kommune.Nr),
						dataType : 'jsonp',
						success : function (data) {
							$("<li data-role='list-divider'>" + self.title1 + "<span class='ui-li-count'>" + data.length + "</span></li>").appendTo("#searchList" + self.id);
							
							for (var i = 0; i < data.length; i++) {
								var name = self.name1;
								var m = self.name1.match(/\[.+?\]/g);
								while (m.length) {
									var a = m.shift();
									var b = getPath(data[i], a.replace("[", "").replace("]", ""));
									name = name.replace(a, b);
								}
								self.addItem1(getPath(data[i], self.id1), name);
							}
							$("#searchList" + self.id).listview("refresh");
						},
						complete : function () {
							$.mobile.hidePageLoadingMsg();
						}
					});
			}
		}
	};
	this.search2 = function () {
		$("#searchResult2").html("");
		if (self.ajax != null) {
			self.ajax.abort();
		}
		$.mobile.showPageLoadingMsg("a", "Søger...", false);
		self.ajax = $.ajax({
				url : self.url2.replace("[text]", self.text2).replace("[kommune]", Rfs.kommune.Nr).replace("[selection1]", self.selection1),
				dataType : 'jsonp',
				success : function (data) {
					for (var i = 0; i < data.length; i++) {
						var name = self.name2;
						var m = self.name2.match(/\[.+?\]/g);
						while (m.length) {
							var a = m.shift();
							var b = getPath(data[i], a.replace("[", "").replace("]", ""));
							name = name.replace(a, b);
						}
						self.addItem2(getPath(data[i], self.id2), name);
					}
					$("#searchResult2").listview("refresh");
				},
				complete : function () {
					$.mobile.hidePageLoadingMsg();
				}
			});
	};
	this.search3 = function () {
		$("#searchResult3").html("");
		if (self.ajax != null) {
			self.ajax.abort();
		}
		$.mobile.showPageLoadingMsg("a", "Søger...", false);
		self.ajax = $.ajax({
				url : self.url3.replace("[text]", self.text3).replace("[kommune]", Rfs.kommune.Nr).replace("[selection1]", self.selection1).replace("[selection2]", self.selection2),
				dataType : 'jsonp',
				success : function (data) {
					for (var i = 0; i < data.length; i++) {
						var name = self.name3;
						var m = self.name3.match(/\[.+?\]/g);
						while (m.length) {
							var a = m.shift();
							var b = getPath(data[i], a.replace("[", "").replace("]", ""));
							name = name.replace(a, b);
						}
						self.addItem3(getPath(data[i], self.id3), name);
					}
					$("#searchResult3").listview("refresh");
				},
				complete : function () {
					$.mobile.hidePageLoadingMsg();
				}
			});
	};
	this.addItem1 = function (id, name) {
		$("<li>").append(
			$("<a />", {
				text : name
			}).click(function () {
				oiorest.activeSearch = self;
				self.selection1 = id;
				if (self.url2) {
					var page = $("#SearchPage2");
					var header = page.children(":jqmData(role=header)");
					header.find("h1").html(self.title2);
					$("#searchInput2").val("");
					$("#searchInput2").attr("placeholder", self.placeholder2);
					$("#searchResult2").html("");
					if (self.chars2 > 0)
						$("#searchHint2").html("Indtast minimum " + self.chars2 + " karakterer!");
					else {
						$("#searchHint2").html("");
						self.text2 = "";
						self.search2();
					}
					$.mobile.changePage('#SearchPage2');
				} else {
					self.getPosition(name);
				}
			})).appendTo("#searchList" + self.id);
	};
	this.addItem2 = function (id, name) {
		$("<li>").append(
			$("<a />", {
				text : name
			}).click(function () {
				oiorest.activeSearch = self;
				self.selection2 = id;
				if (self.url3) {
					var page = $("#SearchPage3");
					var header = page.children(":jqmData(role=header)");
					header.find("h1").html(self.title3);
					$("#searchInput3").val("");
					$("#searchInput3").attr("placeholder", self.placeholder3);
					$("#searchResult3").html("");
					if (self.chars3 > 0)
						$("#searchHint3").html("Indtast minimum " + self.chars3 + " karakterer!");
					else {
						$("#searchHint3").html("");
						self.text3 = "";
						self.search3();
					}
					$.mobile.changePage(page);
				} else {
					self.getPosition(name);
				}
			})).appendTo("#searchResult2");
	};
	this.addItem3 = function (id, name) {
		$("<li>").append(
			$("<a />", {
				text : name
			}).click(function () {
				oiorest.activeSearch = self;
				self.selection3 = id;
				self.getPosition(name);
			})).appendTo("#searchResult3");
	};
	this.getPosition = function (name) {
		if (self.ajax != null) {
			self.ajax.abort();
		}
		$.mobile.showPageLoadingMsg("a", "Søger...", false);
		self.ajax = $.ajax({
				url : self.url.replace("[text]", name).replace("[kommune]", Rfs.kommune.Nr).replace("[selection1]", self.selection1).replace("[selection2]", self.selection2).replace("[selection3]", self.selection3),
				dataType : 'jsonp',
				success : function (data) {
					var code = null;
					try {
						code = map.projection.getCode();
					} catch (err) {
						code = map.projection;
					}
					var mapProjection = null;
					if (code == "ETRS89.UTM-32N")
						mapProjection = new OpenLayers.Projection("EPSG:25832");
					else
						mapProjection = map.projection;
					if (self.x2) {
						var point1 = new OpenLayers.Geometry.Point(getPath(data, self.x1), getPath(data, self.y1));
						var point2 = new OpenLayers.Geometry.Point(getPath(data, self.x2), getPath(data, self.y2));
						point1.transform(new OpenLayers.Projection(self.projection), mapPojection);
						point2.transform(new OpenLayers.Projection(self.projection), mapProjection);
						var bounds = new OpenLayers.Bounds(point1.x, point1.y, point2.x, point2.y);
						map.zoomToExtent(bounds);
					} else {
						var point = new OpenLayers.Geometry.Point(getPath(data, self.x1), getPath(data, self.y1));
						point.transform(new OpenLayers.Projection(self.projection), mapProjection);
						vector.removeAllFeatures();
						vector.addFeatures([
								new OpenLayers.Feature.Vector(
									point, {}, {
									graphicName : 'cross',
									strokeColor : '#f00',
									strokeWidth : 2,
									fillOpacity : 0,
									pointRadius : 10
								})
							]);
						/*if (self.zoom) {
						var o = self.zoom / 2;
						self.map.zoomToExtent([point.x - o, point.y - o, point.x + o, point.y + o]);
						} else*/
						map.zoomToExtent(vector.getDataExtent());
					}
					var page = $("#Kort");
					$.mobile.changePage(page);
				},
				complete : function () {
					$.mobile.hidePageLoadingMsg();
				}
			});
		
	}
}

function getPath(obj, path) {
	if (obj.length > 0)
		obj = obj[0];
	var parts = path.split('.');
	while (parts.length && obj) {
		obj = obj[parts.shift()];
	}
	return obj;
}

// API key for http://openlayers.org. Please get your own at
// http://bingmapsportal.com/ and use that instead.
var apiKey = "AuNxzdIgj_DsnHh_sCAkkhlwPbfe1B-m890rn4sjfAG1niRi3lCjtxunctjRCn-Q";

// initialize map when page ready
var map,
activeControl,
pointControl,
pathControl,
polygonControl,
modifyControl,
removeControl,
navigationControl,
redline,
vector,
crosshairsLayer,
crosshairMarker,
icon,
geolocate,
startLocate;
function Point(item) {
	$("#tegnPunkt").addClass('checked');
	$("#tegnLinie").removeClass('checked');
	$("#tegnPolygon").removeClass('checked');
	$("#tegnRediger").removeClass('checked');
	$("#tegnSlet").removeClass('checked');
	$("#tegnNaviger").removeClass('checked');
	if (activeControl)
		activeControl.deactivate();
	activeControl = pointControl;
	activeControl.activate();
	//removeControl.deactivate();
	//navigationControl.deactivate();
}
function Path() {
	$("#tegnPunkt").removeClass('checked');
	$("#tegnLinie").addClass('checked');
	$("#tegnPolygon").removeClass('checked');
	$("#tegnRediger").removeClass('checked');
	$("#tegnSlet").removeClass('checked');
	$("#tegnNaviger").removeClass('checked');
	if (activeControl)
		activeControl.deactivate();
	activeControl = pathControl;
	activeControl.activate();
	//removeControl.deactivate();
	//navigationControl.deactivate();
}
function Polygon() {
	$("#tegnPunkt").removeClass('checked');
	$("#tegnLinie").removeClass('checked');
	$("#tegnPolygon").addClass('checked');
	$("#tegnRediger").removeClass('checked');
	$("#tegnSlet").removeClass('checked');
	$("#tegnNaviger").removeClass('checked');
	if (activeControl)
		activeControl.deactivate();
	activeControl = polygonControl;
	activeControl.activate();
	//removeControl.deactivate();
	//navigationControl.deactivate();
}
function Modify() {
	$("#tegnPunkt").removeClass('checked');
	$("#tegnLinie").removeClass('checked');
	$("#tegnPolygon").removeClass('checked');
	$("#tegnRediger").addClass('checked');
	$("#tegnSlet").removeClass('checked');
	$("#tegnNaviger").removeClass('checked');
	if (activeControl)
		activeControl.deactivate();
	activeControl = modifyControl;
	activeControl.activate();
	//removeControl.deactivate();
	//navigationControl.deactivate();
}
/*function Remove() {
$("#tegnPunkt").removeClass('checked');
$("#tegnLinie").removeClass('checked');
$("#tegnPolygon").removeClass('checked');
$("#tegnRediger").removeClass('checked');
$("#tegnSlet").addClass('checked');
$("#tegnNaviger").removeClass('checked');
pointControl.deactivate();
pathControl.deactivate();
polygonControl.deactivate();
modifyControl.deactivate();
removeControl.activate();
//navigationControl.deactivate();
}*/
function Navigate() {
	$("#tegnPunkt").removeClass('checked');
	$("#tegnLinie").removeClass('checked');
	$("#tegnPolygon").removeClass('checked');
	$("#tegnRediger").removeClass('checked');
	$("#tegnSlet").removeClass('checked');
	$("#tegnNaviger").addClass('checked');
	if (activeControl)
		activeControl.deactivate();
	activeControl = null;
	//removeControl.deactivate();
	//navigationControl.activate();
}

function Move() {
	if (Rfs.showMarker) {
		var extent = map.getExtent();
		if (crosshairMarker)
			crosshairsLayer.removeMarker(crosshairMarker);
		crosshairMarker = new OpenLayers.Marker(new OpenLayers.LonLat(extent.left + (extent.right - extent.left) / 2, extent.bottom + (extent.top - extent.bottom) / 2), icon);
		crosshairsLayer.addMarker(crosshairMarker);
		//crosshairsLayer.removeAllFeatures();
		if (Rfs.rapport && Rfs.rapport.SRS) {
			var geometri = $("#Geometri");
			if (geometri.length > 0) {
				var code = null;
				try {
					code = map.projection.getCode();
				} catch (err) {
					code = map.projection;
				}
				var mapProjection = null;
				if (code == "ETRS89.UTM-32N")
					mapProjection = new OpenLayers.Projection("EPSG:25832");
				else
					mapProjection = map.projection;
				var dest = new OpenLayers.Projection(Rfs.rapport.SRS);
				var geometry = new OpenLayers.Geometry.Point(extent.left + (extent.right - extent.left) / 2, extent.bottom + (extent.top - extent.bottom) / 2);
				geometry.transform(mapProjection, dest);
				geometri.val(geometry.toString());
			}
		}
	}
}
function initMap() {
	startLocate = true;
	var colorDefault = "#ff6600";
	var colorSelect = "#ff9900";
	var colorTemporary = "#ff3300";
	crosshairsLayer = new OpenLayers.Layer.Markers("Crosshairs Layer");
	vector = new OpenLayers.Layer.Vector("Vector Layer", {});
	var size = new OpenLayers.Size(100, 100);
	var offset = new OpenLayers.Pixel(-50, -50);
	icon = new OpenLayers.Icon('./img/crosshair.png', size, offset);
	redline = new OpenLayers.Layer.Vector('Redline Layer', {
			styleMap : new OpenLayers.StyleMap({
				"default" : new OpenLayers.Style(null, {
					rules : [
						new OpenLayers.Rule({
							symbolizer : {
								"Point" : {
									pointRadius : 20,
									graphicName : "circle",
									fillColor : "white",
									fillOpacity : 0.25,
									strokeWidth : 3,
									strokeOpacity : 1,
									strokeColor : colorDefault
								},
								"Line" : {
									strokeWidth : 3,
									strokeOpacity : 1,
									strokeColor : colorDefault
								},
								"Polygon" : {
									strokeWidth : 3,
									strokeOpacity : 1,
									fillColor : colorDefault,
									strokeColor : colorDefault
								}
							}
						})
					]
				}),
				"select" : new OpenLayers.Style(null, {
					rules : [
						new OpenLayers.Rule({
							symbolizer : {
								"Point" : {
									pointRadius : 20,
									graphicName : "circle",
									fillColor : "white",
									fillOpacity : 0.25,
									strokeWidth : 3,
									strokeOpacity : 1,
									strokeColor : colorSelect
								},
								"Line" : {
									strokeWidth : 3,
									strokeOpacity : 1,
									strokeColor : colorSelect
								},
								"Polygon" : {
									strokeWidth : 3,
									strokeOpacity : 1,
									fillColor : colorSelect,
									strokeColor : colorSelect
								}
							}
						})
					]
				}),
				"temporary" : new OpenLayers.Style(null, {
					rules : [
						new OpenLayers.Rule({
							symbolizer : {
								"Point" : {
									graphicName : "circle",
									pointRadius : 20,
									fillColor : "white",
									fillOpacity : 0.25,
									strokeWidth : 3,
									strokeColor : colorTemporary
								},
								"Line" : {
									pointRadius : 20,
									strokeWidth : 3,
									strokeOpacity : 1,
									strokeColor : colorTemporary
								},
								"Polygon" : {
									strokeWidth : 3,
									strokeOpacity : 1,
									strokeColor : colorTemporary,
									fillColor : colorTemporary
								}
							}
						})
					]
				})
			})
		});
	redline.events.register('beforefeatureadded', this, function (object) {
		redline.removeAllFeatures();
		if (Rfs.rapport && Rfs.rapport.SRS) {
			var geometri = $("#Geometri");
			if (geometri.length > 0) {
				var code = null;
				try {
					code = map.projection.getCode();
				} catch (err) {
					code = map.projection;
				}
				var mapProjection = null;
				if (code == "ETRS89.UTM-32N")
					mapProjection = new OpenLayers.Projection("EPSG:25832");
				else
					mapProjection = map.projection;
				var dest = new OpenLayers.Projection(Rfs.rapport.SRS);
				var geometry = object.feature.geometry.clone();
				geometry.transform(mapProjection, dest);
				geometri.val(geometry.toString());
			}
		}
	});
	/*removeControl = new OpenLayers.Control.SelectFeature(redline, {
	onSelect: function (feature) {
	redline.removeFeatures([feature]);
	}
	});*/
	modifyControl = new OpenLayers.Control.ModifyFeature(redline);
	pointControl = new OpenLayers.Control.DrawFeature(redline, OpenLayers.Handler.Point);
	pathControl = new OpenLayers.Control.DrawFeature(redline, OpenLayers.Handler.Path);
	polygonControl = new OpenLayers.Control.DrawFeature(redline, OpenLayers.Handler.Polygon);
	//navigationControl = new OpenLayers.Control.Navigation();
	/*navigationControl = new OpenLayers.Control.TouchNavigation({
	dragPanOptions: {
	enableKinetic: true
	}
	});*/
	navigationControl = new OpenLayers.Control.Navigation({
			dragPanOptions : {
				enableKinetic : true
			}
		});
	geolocate = new OpenLayers.Control.Geolocate({
			id : 'locate-control',
			geolocationOptions : {
				enableHighAccuracy : true,
				maximumAge : 0,
				timeout : 10000
			}
		});
	//geolocate.watch = true;
	var style = {
		fillOpacity : 0.1,
		fillColor : '#000',
		strokeColor : '#f00',
		strokeOpacity : 0.6
	};
	geolocate.events.register("locationfailed", this, function (e) {
		var markup = "<p>";
		switch (e.error.code) {
		case 1:
			markup += "Det er ikke tilladt at bruge GPS enheden";
			break;
		case 2:
			markup += "Der kunne ikke opnås en position";
			break;
		case 3:
			markup += "Der skete en timeout ved bestemmelse af positionen";
			break;
		}
		markup += "</p><p>" + e.error.message + "</p>";
		$("#LocationErrorMessage").html(markup);
		$("#LocationError").popup("open");
	});
	geolocate.events.register("locationupdated", this, function (e) {
		Rfs.lat = e.position.coords.latitude;
		Rfs.lon = e.position.coords.longitude;
		Rfs.acc = e.position.coords.accuracy;
		vector.removeAllFeatures();
		
		vector.addFeatures([
				new OpenLayers.Feature.Vector(
					e.point, {}, {
					graphicName : 'cross',
					strokeColor : '#f00',
					strokeWidth : 2,
					fillOpacity : 0,
					pointRadius : 10
				}),
				new OpenLayers.Feature.Vector(
					OpenLayers.Geometry.Polygon.createRegularPolygon(
						new OpenLayers.Geometry.Point(e.point.x, e.point.y),
						e.position.coords.accuracy / 2,
						50,
						0), {},
					style)
			]);
		map.zoomToExtent(vector.getDataExtent());
		if (!Rfs.useDrawControl)
			vector.removeAllFeatures();
		
	});
	map = new OpenLayers.Map({
			div : "map",
			theme : null,
			//projection: new OpenLayers.Projection("EPSG:900913"),
			//units: "m",
			//numZoomLevels: 18,
			/*maxResolution: 156543.0339,
			maxExtent: new OpenLayers.Bounds(
			-20037508.34, -20037508.34, 20037508.34, 20037508.34
			),*/
			controls : [
				//new OpenLayers.Control.Attribution(),
				geolocate,
				pointControl,
				pathControl,
				polygonControl,
				modifyControl,
				navigationControl
				//removeControl
			],
			layers : [redline, vector, crosshairsLayer],
			eventListeners : {
				"move" : Move
			}
			
		});
	$("#plus").click(function () {
		map.zoomIn();
	});
	$("#minus").click(function () {
		map.zoomOut();
	});
	$(window).bind("resize orientationchange", function (e) {
		fixContentHeight();
	});
	map.events.register("zoomend", this, function (e) {
		if (startLocate) {
			startLocate = false;
			locate();
		}
	});
	createMap();
	
}
function locate() {
	//var control = map.getControlsBy("id", "locate-control")[0];
	if (geolocate.active) {
		geolocate.getCurrentLocation();
	} else {
		geolocate.activate();
	}
}

function createMap() {
	if (map && Rfs.mapSet) {
		geolocate.deactivate();
		startLocate = true;
		if (crosshairMarker)
			crosshairsLayer.removeMarker(crosshairMarker);
		redline.removeAllFeatures();
		Navigate();
		$('#layerslist').html("<li data-role='divider' data-theme='a'>Baggrundskort</li>");
		var n = map.layers.length;
		for (i = 0; i < n; i++) {
			map.removeLayer(map.layers[0], false);
		}
		map.addLayer(redline);
		map.addLayer(vector);
		map.addLayer(crosshairsLayer);
		var zoom = false;
		var layer;
		for (mapGroupItem in Rfs.mapSet.MapGroup) {
			for (mapItem in Rfs.mapSet.MapGroup[mapGroupItem].Map) {
				var m = Rfs.mapSet.MapGroup[mapGroupItem].Map[mapItem];
				switch (m.Type[0]) {
				case "WMTS":
					var name = m.Extension[0].Options[0].name[0];
					layer = new OpenLayers.Layer.WMTS({
							name : name,
							url : m.Extension[0].Options[0].url[0],
							layer : m.Extension[0].Options[0].layer[0],
							matrixSet : m.Extension[0].Options[0].matrixSet[0],
							format : m.Extension[0].Options[0].format[0],
							style : m.Extension[0].Options[0].style[0],
							opacity : 0.7,
							isBaseLayer : false
						});
					break;
				case "MapGuide":
					mapguide(m);
					break;
				case "OpenStreetMap":
					layer = new OpenLayers.Layer.OSM(m.Extension[0].Options[0].name[0]);
					map.addLayer(layer);
					addLayerToList({
						ol : layer,
						name : layer.name
					});
					zoom = true;
					break;
				case "Google":
					var name = m.Extension[0].Options[0].name[0];
					switch (m.Extension[0].Options[0].type[0]) {
					case "G_PHYSICAL_MAP":
					case "TERRAIN":
						layer = new OpenLayers.Layer.Google(name, {
								type : google.maps.MapTypeId.TERRAIN //,
								//numZoomLevels: 22
							});
						map.addLayer(layer);
						addLayerToList({
							ol : layer,
							name : layer.name
						});
						zoom = true;
						//map.zoomToMaxExtent();
						break;
					case "G_HYBRID_MAP":
					case "HYBRID":
						layer = new OpenLayers.Layer.Google(name, {
								type : google.maps.MapTypeId.HYBRID //,
								//numZoomLevels: 22
							});
						map.addLayer(layer);
						addLayerToList({
							ol : layer,
							name : layer.name
						});
						zoom = true;
						//map.zoomToMaxExtent();
						break;
					case "G_SATELLITE_MAP":
					case "SATELLITE":
						layer = new OpenLayers.Layer.Google(name, {
								type : google.maps.MapTypeId.SATELLITE //,
								//numZoomLevels: 22
							});
						map.addLayer(layer);
						addLayerToList({
							ol : layer,
							name : layer.name
						});
						zoom = true;
						//map.zoomToMaxExtent();
						break;
					case "G_NORMAL_MAP":
					case "ROADMAP":
						layer = new OpenLayers.Layer.Google(name, {
								type : google.maps.MapTypeId.ROADMAP //,
								//numZoomLevels: 22
							});
						map.addLayer(layer);
						addLayerToList({
							ol : layer,
							name : layer.name
						});
						zoom = true;
						//map.zoomToMaxExtent();
						break;
					}
					break;
				case "VirtualEarth":
					var name = m.Extension[0].Options[0].name[0];
					switch (m.Extension[0].Options[0].type[0]) {
					case "Road":
						layer = new OpenLayers.Layer.Bing({
								key : apiKey,
								type : "Road",
								// custom metadata parameter to request the new map style - only useful
								// before May 1st, 2011
								metadataParams : {
									mapVersion : "v1"
								},
								name : name
								//transitionEffect: 'resize',
								//numZoomLevels: 22
							});
						map.addLayer(layer);
						addLayerToList({
							ol : layer,
							name : layer.name
						});
						zoom = true;
						break;
					case "Aerial":
						layer = new OpenLayers.Layer.Bing({
								key : apiKey,
								type : "Aerial",
								name : name
								//transitionEffect: 'resize',
								//numZoomLevels: 22
							});
						map.addLayer(layer);
						addLayerToList({
							ol : layer,
							name : layer.name
						});
						zoom = true;
						break;
					case "Hybrid":
						layer = new OpenLayers.Layer.Bing({
								key : apiKey,
								type : "AerialWithLabels",
								name : name
								//transitionEffect: 'resize',
								//numZoomLevels: 22
							});
						map.addLayer(layer);
						addLayerToList({
							ol : layer,
							name : layer.name
						});
						zoom = true;
						break;
					}
					break;
				}
			}
		}
		if (zoom) {
			$('#layerslist').listview('refresh');
			map.zoomToMaxExtent();
		}
		/*if (map.baseLayer && !geolocate.active){
		geolocate.activate();
		}*/
	}
}

function mapguide(m) {
	var url = Rfs.tema.MapAgent.toLowerCase().replace("mapagent/mapagent.fcgi", "fusion") + "/layers/mapguide/php/";
	$.ajax({
		url : url + "createsession.php",
		data : {
			username : "Anonymous"
		},
		dataType : 'jsonp',
		success : function (data) {
			$.ajax({
				url : url + "loadmap.php",
				type : "POST",
				data : {
					mapid : m.Extension[0].ResourceId[0],
					session : data.sessionId
				},
				dataType : 'jsonp',
				success : function (data) {
					var inPerUnit = OpenLayers.INCHES_PER_UNIT.m * data.metersPerUnit;
					OpenLayers.INCHES_PER_UNIT["dd"] = inPerUnit;
					OpenLayers.INCHES_PER_UNIT["degrees"] = inPerUnit;
					OpenLayers.DOTS_PER_INCH = 96;
					var isBaseLayer = true;
					if (m.Extension[0].Options && m.Extension[0].Options[0].isBaseLayer && m.Extension[0].Options[0].isBaseLayer[0] == "false") {
						isBaseLayer = false;
					}
					var useOverlay = false;
					if (m.Extension[0].Options && m.Extension[0].Options[0].useOverlay && m.Extension[0].Options[0].useOverlay[0] == "true") {
						useOverlay = true;
					}
					var singleTile = true;
					if (m.SingleTile && m.SingleTile[0] == "False") {
						singleTile = false;
					}
					var useHttpTile = false;
					if (m.Extension[0].Options && m.Extension[0].Options[0].useHttpTile && m.Extension[0].Options[0].useHttpTile[0] == "true") {
						useHttpTile = true;
					}
					var format = '';
					if (m.Extension[0].Options && m.Extension[0].Options[0].format) {
						format = m.Extension[0].Options[0].format[0];
					}
					if (m.Extension[0].ImageFormat) {
						format = m.Extension[0].ImageFormat[0];
					}
					var options = {
						isBaseLayer : isBaseLayer,
						useOverlay : useOverlay,
						useAsyncOverlay : true,
						singleTile : singleTile,
						useHttpTile : useHttpTile,
						maxExtent : new OpenLayers.Bounds.fromArray(data.extent)
					};
					
					var layer;
					//HttpTiled
					if (useHttpTile) {
						var params = {
							basemaplayergroupname : data.groups[0].groupName
						};
						if (format != '')
							params['format'] = format;
						options["scales"] = data.FiniteDisplayScales;
						layer = new OpenLayers.Layer.MapGuide(data.mapTitle, m.Extension[0].Options[0].tileCacheUrl[0].split(","), params, options);
					}
					//Untiled
					else if (singleTile) {
						map.projection = "EPSG:" + data.epsg;
						var params = {
							mapname : data.mapName,
							session : data.sessionId,
							behavior : 2
						};
						if (format != '')
							params['format'] = format;
						options["maxResolution"] = "auto";
						options["maxScale"] = 1;
						options["minScale"] = 1000000000000;
						options["units"] = "m";
						layer = new OpenLayers.Layer.MapGuide(data.mapTitle, Rfs.tema.MapAgent, params, options);
					}
					//Tiled
					else {
						var params = {
							mapdefinition : data.mapId,
							session : data.sessionId,
							basemaplayergroupname : data.groups[0].groupName
						};
						if (format != '')
							params['format'] = format;
						options["scales"] = data.FiniteDisplayScales;
						layer = new OpenLayers.Layer.MapGuide(data.mapTitle, Rfs.tema.MapAgent, params, options);
					}
					map.addLayer(layer);
					$("#map").css("background-color", data.backgroundColor);
					if (startLocate)
						map.zoomToExtent(layer.maxExtent);
					
					if (useOverlay) {
						map.removeLayer(redline, false);
						map.removeLayer(vector, false);
						map.removeLayer(crosshairsLayer, false);
						map.addLayer(redline);
						map.addLayer(vector);
						map.addLayer(crosshairsLayer);
					} else {
						for (var i = 0; i < data.layers.length; i++) {
							var ml = data.layers[i];
							if (ml.displayInLegend) {
								addLayerToList({
									ol : layer,
									name : ml.legendLabel,
									id : ml.uniqueId
								});
							}
						}
						addLayerToList({
							ol : layer,
							name : layer.name
						});
						$('#layerslist').listview('refresh');
					}
					/*if (map.baseLayer && !geolocate.active){
					geolocate.activate();
					}*/
				},
				error : function (jqXHR, textStatus, errorThrown) {
					alert(textStatus);
				}
			});
		},
		error : function (jqXHR, textStatus, errorThrown) {
			alert(textStatus);
		}
	});
}

// Start with the map page

$('#Kort').live('pageshow', function (event) {
	
	fixContentHeight();
	if (Rfs.showInfo) {
		Rfs.showInfo = false;
		if (Rfs.useDrawControl) {
			$("#KortInfoDraw").popup("open");
		} else {
			$("#KortInfo").popup("open");
		}
	}
	
	if (!window.map) {
		initMap();
	}
	
});
function fixContentHeight() {
	var viewHeight = $(window).height();
	var header = $("#headerKort");
	var footer = $("#kortnavbar");
	var contentHeight;
	if (footer.css('display') == 'none')
		contentHeight = viewHeight - header.outerHeight();
	else
		contentHeight = viewHeight - footer.outerHeight() - header.outerHeight();
	//var contentHeight = viewHeight - footer.outerHeight() - header.outerHeight();
	$("#map").css("height", contentHeight);
	$("#navigation").css("top", header.outerHeight() + 10);
	if (window.map) {
		map.updateSize();
	}
	$("#Photo").css("height", viewHeight);
	var photoButton = $("#photoButton");
	var width = $(window).width();
	var width2 = photoButton.outerWidth();
	photoButton.css("left", (width - width2) / 2);
}

/*function initLayerList() {
$('#layerslist').html("<li data-role='divider' data-theme='a'>Baggrundskort</li>");
//$('#layerspage').page();
var baseLayers = map.getLayersBy("isBaseLayer", true);
$.each(baseLayers, function () {
addLayerToList(this);
});

$('#layerslist').listview('refresh');
}*/

function addLayerToList(layer) {
	if (layer.ol.isBaseLayer) {
		map.projection = layer.ol.projection.getCode();
	}
	var item = $('<li>', {
			"data-icon" : "check",
			"class" : layer.ol.visibility ? "checked" : ""
		})
		.append($('<a />', {
				text : layer.name
			})
			.click(function () {
				$.mobile.changePage('#Kort');
				if (layer.ol.CLASS_NAME == "OpenLayers.Layer.MapGuide") {
					item.toggleClass('checked');
					if (item.hasClass('checked')) {
						
						if (typeof layer.ol.params.hideLayers === "undefined") {
							//layer.ol.params.hideLayers = layer.id
						} else {
							layer.ol.params.hideLayers = layer.ol.params.hideLayers.replace(layer.id, '').replace(',,', ',');
						}
						if (typeof layer.ol.params.showLayers === "undefined") {
							layer.ol.params.showLayers = layer.id
						} else {
							layer.ol.params.showLayers = layer.ol.params.showLayers + ',' + layer.id;
						}
					} else {
						if (typeof layer.ol.params.showLayers === "undefined") {
							//layer.ol.params.showLayers = layer.id
						} else {
							layer.ol.params.showLayers = layer.ol.params.showLayers.replace(layer.id, '').replace(',,', ',');
						}
						if (typeof layer.ol.params.hideLayers === "undefined") {
							layer.ol.params.hideLayers = layer.id
						} else {
							layer.ol.params.hideLayers = layer.ol.params.hideLayers + ',' + layer.id;
						}
					}
					layer.ol.redraw();
				} else if (layer.ol.isBaseLayer && layer.name == layer.ol.name) {
					//var ce = map.getExtent();
					//ce.transform(map.getProjectionObject(), layer.projection);
					map.projection = layer.ol.projection.getCode();
					//map.maxExtent = layer.maxExtent;
					map.setBaseLayer(layer.ol);
					//layer.redraw();
					//map.zoomToExtent(layer.maxExtent);
					//map.zoomToExtent(ce);
				} else {
					layer.ol.setVisibility(!layer.ol.getVisibility());
				}
			}))
		.appendTo('#layerslist');
	layer.ol.events.on({
		'visibilitychanged' : function () {
			$(item).toggleClass('checked');
		}
	});
}
/*Rfs.kommune = {
Nr : 217,
Navn : "Helsingør Kommune",
Logo : "8DC04806-C798-4866-B5CA-F5EBD78BB8B3-164.jpg",
URL : "http://localhost/RapportFraStedet"
};*/
/*Rfs.kommune = {
Nr : 147,
Navn : "Frederiksberg Kommune",
Logo : "7A7B396F-8BA1-483E-AD92-CEC152A58E16-164.jpg",
URL : "http://gis.frederiksberg.dk/RapportFraStedet"
};*/
