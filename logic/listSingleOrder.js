
function initial() {
	//navigate buttons
	$("#cancel").on("click",goOrder);
	//navigate side bar 
	navigation();

	showList();
	resize_sidebar();
}

//show all items 
function showList() {
	if(localStorage.getItem("Picked") != null) {
		var order = JSON.parse(localStorage.getItem("Picked"));
		//display name and price
		$("#orderID").text(order.ID);
		if(order.STATUS === "1") {var status = "Completed";} else {var status = "In process";}
		$("#orderStatus").text(status);
		//display table
		var table = $(".w3-table");
		$.ajax({
			type:"get",
			url:server+"/order/" + order.ID,
			async:false,
			timeout:10000,
			success:function(data) {
				if(data != "empty") {
					data = JSON.parse(data);
					for(var i=0; i<data.length; i++) {
						var row = $('<tr></tr>').appendTo(table);
						$('<td></td>').text(data[i].MENU_NAME).appendTo(row);
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
