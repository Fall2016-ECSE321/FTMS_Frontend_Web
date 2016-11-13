var newitem;

function initial() {
	//navigate buttons
	$("#logout").on("click",logout);
	
	//navigate side bar
	
	newitem = true;
	showPicked();
	$("#change").on("click",change);
}

function logout() {
	window.location.href = "../index.html";
}

function showPicked() {
	if(localStorage.getItem("Picked") != "null") {
		var equip = JSON.parse(localStorage.getItem("Picked"));
		$("#name").val(equip.NAME);
		$("#quantity").val(equip.QUANTITY);
		$("#price").val(equip.PRICE);
		newitem = false;
	}
}

function change() {
	var newEquip = {};
	newEquip.NAME = $("#name").val();
	newEquip.QUANTITY = $("#quantity").val();
	newEquip.PRICE = $("#price").val();
	if(newitem) {
		
	} else {
//		$.ajax({
//			type:"put",
//			url:"",
//			contentType:"application/x-www-form-urlencoded",
//			data:newEquip,
//			async:false,
//			timeout:5000,
//			success:function(data) {
//				
//			},
//			error:function(type) {
//				alert("timeout");
//			},
//		});	
	}
	
}
