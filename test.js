

function test() {
	//Radiobutton
	var markup = "<div data-role='fieldcontain'>";
	markup += "<div data-role='controlgroup'>";
	markup += "<legend>radio</legend>";
	markup += "<input type='radio' id='one_1' name='radio-choice' value='0' class='required' />";
	markup += "<label for='one_1'>YES</label>";
	markup += "<input type='radio' id='two_1' name='radio-choice' value='1' class='required' />";
	markup += "<label for='two_1'>NO</label></div></div>";
    //Dropdown
	markup+="<div data-role='fieldcontain'>";
	markup+="<label for='favcolor'>dropdown</label>";
	markup+="<select id='favcolor' name='favcolor' class='required'>";
	markup+="<option value=''>Select One</option>";
	markup+="<option value='green'>Green</option>";
	markup+="<option value='red'>Red</option>";
	markup+="<option value='blue'>Blue</option>";
	markup+="<option value='yellow'>Yellow</option>";
	markup+="</select></div>";
	//Textbox
	markup+="<div data-role='fieldcontain'>";
	markup+="<label for='text'>text</label> ";
	markup+="<input type='text' id='text' name='text' class='required' /></div>";
	//TextArea
	markup+="<div data-role='fieldcontain'>";
	markup+="<label for='textarea'>textarea</label> ";
	markup+="<textarea id='textarea' name='textarea' class='required' /></div>";
	//Dato
	markup+="<div data-role='fieldcontain'>";
	markup+="<label for='date'>date</label> ";
	markup+="<input type='date' id='date' name='date' class='required' /></div>";
	//Upload
	markup+="<div data-role='fieldcontain'>";
	markup+="<label for='file'>file</label> ";
	markup+="<input type='file' id='file' name='file' class='required'/></div>";
	/*
	markup+="<label for='108'>DropDownList</label>";
	markup+="<select id='108' name='108' class='required'>";
	markup+="<option value='' data-placeholder='true'>-- Vælg --</option>";
	markup+="<option value='aa'>Aa</option>";
	markup+="<option value='ba'>Ba</option>";
	markup+="</select></div>";

	markup+="<div data-role='fieldcontain'>";
	markup+="<label for='108'>Favorite Color:</label>";
	markup+="<select id='108' name='108' class='required'>";
	markup+="<option value=''>Select One</option>";
	markup+="<option value='green'>Green</option>";
	markup+="<option value='red'>Red</option>";
	markup+="<option value='blue'>Blue</option>";
	markup+="<option value='yellow'>Yellow</option>";
	markup+="</select></div>";


	markup+="<div data-role='fieldcontain'>";
	markup+="<div data-role='controlgroup'>";
	markup+="<legend><em>*</em>RadioButtonList</legend>";
	markup+="<input type='radio' id='109-1' name='109' value='A' class='required'/>";
	markup+="<label for='109-1'>A</label>";
	markup+="<input type='radio' id='109-2' name='109' value='B' class='required'/>";
	markup+="<label for='109-2'>B</label>";
	markup+="</div></div>";
	 */
	markup += "<input type='submit' value='Submit' action='#' />";
	$("#rapportForm").html(markup).trigger("create");
	//$("#rapportForm").validate();
	$("#rapportForm").validate({
		highlight : function (element, errorClass, validClass) {
			if (element.type && element.type == 'radio') {
			    //$(element.form).find("label[for=" + element.id + "]").addClass(errorClass).removeClass(validClass)
				$(element.parentElement.parentElement).children().find('label').addClass('highlighterror');
			} else if (element.type && element.type == 'textarea'){
				$(element).addClass('highlighterror');
			} else /*if (element.type && element.type == 'select-one')*/ {
				$(element.parentElement).addClass('highlighterror');
			}/*else {
				$(element).addClass(errorClass).removeClass(validClass);
				$(element.form).find("label[for=" + element.id + "]")
				.addClass(errorClass);
			}*/
		},
		unhighlight : function (element, errorClass, validClass) {
			if (element.type && element.type == 'radio') {
				$(element.parentElement.parentElement).children().find('label').removeClass('highlighterror');
			} else if (element.type && element.type == 'textarea'){
				$(element).removeClass('highlighterror');
			} else{
				$(element.parentElement).removeClass('highlighterror');
			/*$(element).removeClass(errorClass).addClass(validClass);
			$(element.form).find("label[for=" + element.id + "]").removeClass(errorClass);*/
			}
		},
		errorPlacement: function(error, element) {
			if (element[0].type && element[0].type == 'radio') {
				error.insertAfter($(element).parent().parent());
			} else if (element[0].type && element[0].type == 'select-one') {
				error.insertAfter($(element).parent().parent());
			} else if (element[0].type && element[0].type == 'textarea') {
				error.insertAfter($(element));
			} else{
				error.insertAfter($(element).parent());
			}
		}
	});
	$.mobile.changePage("#test");

}
