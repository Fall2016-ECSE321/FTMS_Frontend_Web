
var EquipmentList = [];

function initial() {
	//navigate buttons
	$("#logout").on("click",logout);
	$(".glyphicon-plus").on("click",addEquipment);
	//navigate side bar 
	$("#goProfile").on("click",goProfile);
	$("#goStaff").on("click",goStaff);
	$("#goFood").on("click",goFood);
	$("#goEquipment").on("click",goEquipment);
	$("#goMenu").on("click",goMenu);
	$("#goOrder").on("click",goOrder);
	
	showList();
	resize_sidebar();
	deleteEquip();
	editEquip();
}

function logout() {
	window.location.href = "../index.html";
}
function addEquipment() {
	window.location.href = "addEquipment.html";
}

function goProfile() {
	window.location.href = "../page/listEquipment.html";
}
function goStaff() {
	window.location.href = "../page/listStaff.html";
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
	var table = $(".w3-table");
	$.ajax({
		type:"get",
		url:"http://shawnluxy.ddns.net:80/equipment",
		async:false,
		timeout:10000,
		dataType:'json',
		success:function(data) {
			EquipmentList = data;
			for(var i=0; i<data.length; i++) {
				var name = data[i].NAME;
				var quantity = data[i].QUANTITY;
				var price = data[i].PRICE;
				var row = $('<tr></tr>').appendTo(table);
				$('<td></td>').attr({class: ["w3-col", "l3", "w3-center"].join(' ')}).text(name).appendTo(row);
				$('<td></td>').attr({class: ["w3-col", "l3", "w3-center"].join(' ')}).text(quantity).appendTo(row);
				$('<td></td>').attr({class: ["w3-col", "l3", "w3-center"].join(' ')}).text(price).appendTo(row);
				var lastcol = $('<td></td>').attr({class: ["w3-col", "l3", "w3-center"].join(' ')}).appendTo(row);
				$('<i></i>').attr({class: ["glyphicon", "glyphicon-pencil", "w3-hover-black"].join(' ')}).attr('style', 'margin-right: 2%').appendTo(lastcol);
				$('<i></i>').attr({class: ["glyphicon", "glyphicon-trash", "w3-hover-black"].join(' ')}).appendTo(lastcol);
			}
		},
		error:function(type) {
			alert("timeout");
		},
	});
}
//delete chosen item
function deleteItem(item) {
	$.ajax({
		type:"",
		url:"",
		async:false,
		timeout:5000,
		success:function(data) {
			
		},
		error:function() {
			alert("timeout");
		},
	});
}

function deleteEquip() {
	var trash = $(".glyphicon-trash");
	for(var i=0; i<trash.length; i++) {
		trash[i].addEventListener("click",function(index){
			return function (){
				var equip = EquipmentList[index];
				console.log(equip);
			};
		}(i), true);
	}
}
function editEquip() {
	var pencil = $(".glyphicon-pencil");
	for(var i=0; i<pencil.length; i++) {
		pencil[i].addEventListener("click",function(index){
			return function (){
				var equip = EquipmentList[index];
				localStorage.setItem("Picked", JSON.stringify(equip));
				window.location.href = "addEquipment.html";
			};
		}(i), true);
	}
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
