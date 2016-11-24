var MenuList = [];

function initial() {
	//navigate buttons
	$("#logout").on("click",logout);
	$(".glyphicon-plus").on("click",addMenu);
	//navigate side bar 
	$("#goProfile").on("click",goProfile);
	$("#goStaff").on("click",goStaff);
	$("#goFood").on("click",goFood);
	$("#goEquipment").on("click",goEquipment);
	$("#goMenu").on("click",goMenu);
	$("#goOrder").on("click",goOrder);
	
	showList();
	resize_sidebar();
	deleteMenu();
	editMenu();
	viewMenu();
}

function logout() {
	window.location.href = "../index.html";
}
function addMenu() {
	window.location.href = "../page/addMenu.html";
	localStorage.removeItem("Picked");
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

//show all items in the Menu table
function showList() {
	var table = $(".w3-table");
	$.ajax({
		type:"get",
		url:"http://shawnluxy.ddns.net:80/menu",
		async:false,
		timeout:10000,
		success:function(data) {
			if(data != "empty") {
				data = JSON.parse(data);
				MenuList = data;
				for(var i=0; i<data.length; i++) {
					var name = data[i].NAME;
					var price = data[i].PRICE;
					var popularity = data[i].POPULARITY;
					var row = $('<tr></tr>').appendTo(table);
					$('<td></td>').attr({class: ["w3-col", "l3", "w3-center", "underline"].join(' ')}).text(name).appendTo(row);
					$('<td></td>').attr({class: ["w3-col", "l3", "w3-center"].join(' ')}).text(price).appendTo(row);
					$('<td></td>').attr({class: ["w3-col", "l3", "w3-center"].join(' ')}).text(popularity).appendTo(row);
					var lastcol = $('<td></td>').attr({class: ["w3-col", "l3", "w3-center"].join(' ')}).appendTo(row);
					$('<i></i>').attr({class: ["glyphicon", "glyphicon-pencil", "w3-hover-black"].join(' ')}).attr('style', 'margin-right: 2%').appendTo(lastcol);
					$('<i></i>').attr({class: ["glyphicon", "glyphicon-trash", "w3-hover-black"].join(' ')}).appendTo(lastcol);
				}	
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
		type:"delete",
		url:"http://shawnluxy.ddns.net:80/delete_menu/" + item.ID,
		async:false,
		timeout:5000,
		beforeSend:function(xhr){
			xhr.setRequestHeader("Authorization","Managers");
		},
		success:function(data) {
			alert(data);
			goMenu();
		},
		error:function() {
			alert("timeout");
		},
	});
}
//add event to each icon
function deleteMenu() {
	var trash = $(".glyphicon-trash");
	for(var i=0; i<trash.length; i++) {
		trash[i].addEventListener("click",function(index){
			return function (){
				var menu = MenuList[index];
				deleteItem(menu);
			};
		}(i), true);
	}
}
function editMenu() {
	var pencil = $(".glyphicon-pencil");
	for(var i=0; i<pencil.length; i++) {
		pencil[i].addEventListener("click",function(index){
			return function (){
				var menu = MenuList[index];
				localStorage.setItem("Picked", JSON.stringify(menu));
				window.location.href = "addMenu.html";
			};
		}(i), true);
	}
}
function viewMenu() {
	var view = $(".underline");
	for(var i=0; i<view.length; i++) {
		view[i].addEventListener("click",function(index){
			return function (){
				var menu = MenuList[index];
				localStorage.setItem("Picked", JSON.stringify(menu));
				window.location.href = "listRecipe.html";
			};
		}(i), true);
	}
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
