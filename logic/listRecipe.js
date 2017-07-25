
function initial() {
	//navigate buttons
	$("#cancel").on("click",goMenu);
	//navigate side bar 
	navigation();
	
	showList();
	resize_sidebar();
}

//show all items 
function showList() {
	if(localStorage.getItem("Picked") != null) {
		var menu = JSON.parse(localStorage.getItem("Picked"));
		//display name and price
		$("#menuName").text(menu.NAME);
		$("#menuPrice").text("$"+menu.PRICE);
		//display table
		var table = $(".w3-table");
		$.ajax({
			type:"get",
			url:server+"/menu/" + menu.ID,
			async:false,
			timeout:10000,
			success:function(data) {
				if(data != "empty") {
					data = JSON.parse(data);
					for(var i=0; i<data.length; i++) {
						var row = $('<tr></tr>').appendTo(table);
						$('<td></td>').text(data[i].FOOD_NAME).appendTo(row);
						$('<td></td>').text(data[i].AMOUNT).appendTo(row);
					}	
				}
			},
			error:function(type) {
				alert("timeout");
			},
		});	
	}
}
