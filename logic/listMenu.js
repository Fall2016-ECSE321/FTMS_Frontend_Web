var MenuList = [];

function initial() {
	//navigate buttons
	$(".glyphicon-plus").on("click",addMenu);
	//navigate side bar 
	navigation();
	
	showList();
	resize_sidebar();
	deleteMenu();
	editMenu();
	viewMenu();
}
//show all items in the Menu table
function showList() {
	MenuList = getList("/menu");
	showTable(MenuList, 'menu');
}
//delete chosen item
function deleteItems(item) {
	var message = "";
	var recipeList = [];
	$.ajax({
		type:"delete",
		url:"https://shawnluxy.ddns.net:80/delete_menu/" + item.ID,
		async:false,
		timeout:5000,
		beforeSend:function(xhr){
			xhr.setRequestHeader("Authorization",localStorage.getItem("Authorization"));
		},
		success:function(data) {
			message = data;
		},
		error:function() {
			alert("timeout");
		},
	});
	if(message !== "SUCCESS") {alert(message);return false;}
	$.ajax({
		type:"get",
		url:"https://shawnluxy.ddns.net:80/menu/" + item.ID,
		async:false,
		timeout:5000,
		success:function(data) {
			if(data != "empty") {
				data = JSON.parse(data);
				recipeList = data;
			}
		},
		error:function(type) {
			alert("timeout");
		},
	});
	for(var i=0; i<recipeList.length; i++) {
		$.ajax({
			type:"delete",
			url:"https://shawnluxy.ddns.net:80/delete_recipe/" + recipeList[i].ID,
			async:false,
			timeout:5000,
			beforeSend:function(xhr){
				xhr.setRequestHeader("Authorization",localStorage.getItem("Authorization"));
			},
			success:function(data) {
				message = data;
			},
			error:function() {
				alert("timeout");
			},
		});
	}
	alert(message);
	if(message == "SUCCESS") {goMenu();}
}
//add event to each icon
function deleteMenu() {
	var trash = $(".glyphicon-trash");
	for(var i=0; i<trash.length; i++) {
		trash[i].addEventListener("click",function(index){
			return function (){
				var menu = MenuList[index];
				deleteItems(menu);
			};
		}(i), true);
	}
}
function editMenu() {
    var pencil = $(".glyphicon-pencil");
    editItem(pencil, MenuList, "addMenu.html");
}
//add event to each menu's name
function viewMenu() {
	var view = $(".underline");
    editItem(view, MenuList, "listRecipe.html");
}
//Search Site filter
function searchMenu() {
	search(".underline");
}
