var staffInfo = {};

function initial() {
	//navigate buttons
	$("#logout").on("click",logout);
	$("#Edit").on("click",editInfo);
	//navigate side bar 
	$("#goProfile").on("click",goProfile);
	$("#goStaff").on("click",goStaff);
	$("#goFood").on("click",goFood);
	$("#goEquipment").on("click",goEquipment);
	$("#goMenu").on("click",goMenu);
	$("#goOrder").on("click",goOrder);
	
	resize_sidebar();
	showInfo();
	
}

function logout() {
	window.location.href = "../index.html";
}

function goProfile() {
	window.location.href = "../page/viewProfile.html";
	localStorage.removeItem("viewPicked");
}
function goStaff() {
	window.location.href = "../page/listStaff.html";
}
function goFood() {
	window.location.href = "../page/listFood.html";
}
function goEquipment() {
	window.location.href = "../page/listEquipment.html";
}
function goMenu() {
	window.location.href = "../page/listMenu.html";
}
function goOrder() {
	window.location.href = "../page/listOrder.html";
}

function showInfo() {
	//hide buttons and input boxes
	$("#change").hide();
	$("#cancel").hide();
	var inputs = $("input[type=text]");
	for(var i=1; i<inputs.length; i++) {
		$(inputs[i]).attr("disabled", true).removeClass("w3-border w3-text-black").attr("style", "background-color: #616161; border-style: hidden; margin-bottom: 10px; height: 20px");
	}
	//get staff information
	if(localStorage.getItem("viewPicked") != null) {
		staffInfo = JSON.parse(localStorage.getItem("viewPicked"));
	} else {
		var userid = localStorage.getItem("userID");
		$.ajax({
			type:"get",
			url:"http://shawnluxy.ddns.net:80/staff/" + userid,
			async:false,
			timeout:10000,
			success:function(data) {
				if(data != "empty") {
					staffInfo = JSON.parse(data)[0];
					localStorage.setItem("Authorization",staffInfo.ROLE);
				}
			},
			error:function(type) {
				alert("timeout");
			},
		});	
	}
	//display personal information
	$('#ID').val(staffInfo.ID);
	$("#Name").val(staffInfo.NAME);
	$("#Gender").val(staffInfo.GENDER);
	$("#Age").val(staffInfo.AGE);
	$("#Position").val(staffInfo.ROLE);
	$("#Number").val(staffInfo.TEL);
	//display schedule
	showSchedule(localStorage.getItem("userID"));
}

function editInfo() {
	//check permission
	if(localStorage.getItem("Authorization") != "Manager") {
		alert("Permission Deny");
		return;
	}
	// display buttons and input boxes
	$("#change").show();
	$("#cancel").show();
	var inputs = $("input[type=text]");
	for(var i=2; i<inputs.length; i++) {
		$(inputs[i]).attr("disabled", false).addClass("w3-border w3-text-black").attr("style", "margin-bottom: 8px; height: 22px");
	}
	//edit schedule
	
	$("#change").on("click",change);
	$("#cancel").on("click",showInfo);
}
function change() {
	var newStaff = {};
	newStaff.NAME = $("#Name").val();
	newStaff.GENDER = $("#Gender").val().toLowerCase();
	newStaff.AGE = $("#Age").val();
	newStaff.ROLE =capitalizeFirstLetter($("#Position").val());
	newStaff.TEL = $("#Number").val().replace(/-/g,"");
	//check input validation
	if(!validate(newStaff.NAME, newStaff.GENDER, newStaff.AGE, newStaff.ROLE, newStaff.TEL)){return false;}
	//post changes of staff
	$.ajax({
		type:"put",
		url:"http://shawnluxy.ddns.net:80/update_equipment",
		contentType:"application/x-www-form-urlencoded",
		data:newStaff,
		async:false,
		timeout:5000,
		beforeSend:function(xhr){
			xhr.setRequestHeader("Authorization",localStorage.getItem("Authorization"));
		},
		success:function(data) {
			alert(data);
			if(data == "SUCCESS") {
				goStaff();
			}
		},
		error:function(type) {
			alert("timeout");
		},
	});
	//post changes of schedule
	
}

function showSchedule(id) {
	var timebox = $(".timebox");
	for(var t=0; t<timebox.length; t++) {timebox[t].style.backgroundColor = 'rgb(107, 186, 185)';}
	var d = new Date();
	$.ajax({
		type:"get",
		url:"http://shawnluxy.ddns.net:80/schedule/" + id,
		async:false,
		timeout:10000,
		success:function(data) {
			if(data != "empty") {
				data = JSON.parse(data);
				for(var i =0; i<data.length; i++) {
					var start_time = (data[i].START_TIME.split(" "))[1].split(":");
					var end_time = (data[i].END_TIME.split(" "))[1].split(":");
					var start_date = (data[i].START_TIME.split(" "))[0].split("-");
					d.setDate(start_date[2])
					var week_index = d.getDay()-1;
					var start_index = start_time[0]-9;
					var end_index = end_time[0]-9;
					for(var j = start_index; j<end_index; j++) {
						timebox[week_index+j*5].style.backgroundColor = 'rgb(121, 215, 97)';	
					}
				}
			}
		},
		error:function(type) {
			alert("timeout");
		},
	});
}

function editSchedule(id) {
	
}

//fit the height of sidebar to window size
function resize_sidebar() {
	if($("#datalist").height() <= $(window).innerHeight()) {
		$("#side-bar").height($(window).innerHeight());
	} else {
		h = $("#datalist").height() + 180;
		$("#side-bar").height(h);
	}
}

//validation check
function validate(name, gender, age, position, number) {
	var status = true;
	var regex1 = /^[0-9]+$/;
	var rolelist = ["Manager", "Cook", "Cashier", "Wholesaler"];
	// check name input
	if(name.trim().length == 0) {
		$("#nameError").text("Name cannot be Empty");status = false;
	} else if(name[0].match(regex1)) {
		$("#nameError").text("Name cannot start with Number");status = false;
	} else {
		$("#nameError").text("");
	}
	// check gender input
	if(gender.trim().length == 0) {
		$("#genderError").text("Gender cannot be Empty");status = false;
	} else if(gender != "male" && gender != "female") {
		$("#genderError").text("Gender must be male or female");status = false;
	} else {
		$("#genderError").text("")	;
	}
	// check age input
	if(age.trim().length == 0) {
		$("#ageError").text("Age cannot be Empty");status = false;
	} else if(!age.match(regex1) ||  parseInt(age)==0) {
		$("#ageError").text("Age must be a Positive Integer");status = false;
	} else {
		$("#ageError").text("");
	}
	// check position input
	if(position.trim().length == 0) {
		$("#positionError").text("Position cannot be Empty");status = false;
	} else if(rolelist.indexOf(position) == -1) {
		$("#positionError").text("Position not available");status = false;
	} else {
		$("#positionError").text("");
	}
	// check number input
	if(number.trim().length == 0) {
		$("#numberError").text("Number cannot be Empty");status = false;
	} else if(!number.match(regex1)) {
		$("#numberError").text("It must be Numbers");status = false;
	} else {
		$("#numberError").text("");
	}
	return status;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}