
function initial() {
	//navigate side bar 
	$("#logout").on("click",logout);
	$("#goProfile").on("click",goProfile);
	$("#goStaff").on("click",goStaff);
	$("#goFood").on("click",goFood);
	$("#goEquipment").on("click",goEquipment);
	$("#goMenu").on("click",goMenu);
	$("#goOrder").on("click",goOrder);
	
	resize_sidebar();
//	showList();

}
function logout() {
	window.location.href = "../index.html";
}
function goProfile() {
	window.location.href = "../page/listEquipment.html";
}
function goStaff() {
	window.location.href = "../page/listEquipment.html";
}
function goFood() {
	window.location.href = "../page/listEquipment.html";
}
function goEquipment() {
	window.location.href = "../page/listEquipment.html";
}
function goMenu() {
	window.location.href = "../page/listEquipment.html";
}
function goOrder() {
	window.location.href = "../page/listEquipment.html";
}

//show all items in the Equipment table
function showList() {
	
	$.ajax({
		type:"get",
		url:"http://shawnluxy.ddns.net:80/equipment",
		async:true,
		timeout:10000,
		dataType:'json',
		success:function(data) {
			for(var i=0; i<data.length; i++) {
				var name = data[i].NAME;
				var quantity = data[i].QUANTITY;
				var price = data[i].PRICE;
//				$(".w3-table").innerHTML = "<tr>
//					<td class="w3-col l3 w3-center">"+ name +"</td>
//	 				<td class="w3-col l3 w3-center">2</td>
//	 				<td class="w3-col l3 w3-center">$30.00</td>
//	 				<td class="w3-col l3 w3-center"><i class="glyphicon glyphicon-pencil w3-hover-black" style="margin-right: 2%;"></i><i class="glyphicon glyphicon-trash w3-hover-black"></i></td>
//				</tr>";
			}
		},
		error:function(type){
			alert("timeout");
		},
	});
}

//fit the height of sidebar to window size
function resize_sidebar() {
	if($("#datalist").height() <= $(window).innerHeight()) {
		$("#side-bar").height($(window).innerHeight());
	} else {
		h = $("#datalist").height() + 144;
		$("#side-bar").height(h);
	}
}
