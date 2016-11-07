
function initial() {
	$("#login").on("click", login);
}

function login() {
	var user = {};
	user.USERNAME = $("#username").val();
	user.PASSWORD = $("#password").val();
	$("#usererror").text("");
	$("#passerror").text("");
	
	$.ajax({
		type:"post",
		url:"http://shawnluxy.ddns.net:80/login",
		contentType:"application/x-www-form-urlencoded",
		data:user,
		async:false,
		success:function(data){
			if(data == "NO SUCH USER") {
				$("#usererror").text("NO SUCH USER");}
			else if(data == "WRONG PASSWORD") {
				$("#passerror").text("WRONG PASSWORD");}
			else {
				window.location.href = "page/listEquipment.html";}
		},
		error:function(type){
			alert(type);
		},
	});
}