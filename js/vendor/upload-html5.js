function upload() {
	var form = $("#rapportForm")[0];
	var formData = new FormData(form);
	if ($(".current > span").hasClass("animate"))
		$(".current > span").removeClass("animate");
	var xhr = new XMLHttpRequest();
	xhr.open('POST', Rfs.url + "/api/SaveFormsData.aspx", true);
	xhr.onerror = function () {
		alert("error");
	};
	xhr.onload = function (e) {
		$(".current > span").width("100%");
		if (this.status == 200) {
			location = '#/kommune/' + Rfs.kommune.Nr + '/' + Rfs.tema.Id + '/kvittering';
		} else {
			var response = JSON.parse(this.response);
			$("#errorMessage").html("<h3>" + response.Message + "</h3><p>" + response.ExceptionMessage + "</p>");
			location = '#/kommune/' + Rfs.kommune.Nr + '/' + Rfs.tema.Id + '/kvitteringfejl';
		}
	};
	xhr.upload.onprogress = function (e) {
		if (e.lengthComputable) {
			$(".current > span").width(e.loaded / e.total * 100 + "%");
		}
	};
	xhr.send(formData);
}
