$(function(){$.widget("custom.photo",{options:{imageSizeValue:100,imageQualityValue:100,id:"",required:!1,name:"",permission:2},_create:function(){var a="<div data-role='fieldcontain'>";a+="<label for='"+this.options.id+"'>";this.options.required==1&&(a+="<em>*</em>");a+=this.options.name+"</label>";a+="<input type='file' name='"+this.options.id+"' id='"+this.options.id+"'";if(this.options.permission==1||this.options.required==1)a+=" class='",this.options.permission==1&&(a+="ui-disabled"),this.options.required==
1&&(a+=" required"),a+="'";a+="/>";a+="</div>";this.element.html(a)},_destroy:function(){},_setOptions:function(){this._superApply(arguments);this._refresh()},_setOption:function(a,b){this._super(a,b)}})});