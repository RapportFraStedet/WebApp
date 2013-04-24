$(document).on("mobileinit", function () {
	$.support.cors = true;
	$.mobile.autoInitializePage = false;
	//$.mobile.ignoreContentEnabled = true;
	// let PathJS handle navigation
	$.mobile.ajaxEnabled = false;
	$.mobile.hashListeningEnabled = false;
	$.mobile.pushStateEnabled = false;
	//$.mobile.linkBindingEnabled = false;
	$(document).bind('pagebeforechange', function (e, data) {
		var to = data.toPage;
		if (typeof to === 'string') {
			reverse = data.options.reverse
				var u = $.mobile.path.parseUrl(to);
			to = u.hash || '#' + u.pathname;
			// manually set hash so PathJS will be triggered
			if (to == '#Tegn')
				to = '#/kommune/' + Rfs.kommune.Nr + '/' + Rfs.tema.Id + '/tegn';
			location.hash = to;
			// prevent JQM from handling navigation
			e.preventDefault();
		} else if (data.options.fromPage && data.options.fromPage[0].id=="Kvittering" && data.toPage[0].id=="Progress"){
			e.preventDefault();
			location.hash = '#/kommune/' + Rfs.kommune.Nr + '/' + Rfs.tema.Id;
		}
	});
});
