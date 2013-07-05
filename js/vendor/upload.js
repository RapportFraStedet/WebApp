function upload() {
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