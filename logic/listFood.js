var FoodList = [];

function initial() {
	//navigate buttons
	$(".glyphicon-plus").on("click",addFood);
	//navigate side bar 
    navigation();
	
	showList();
	resize_sidebar();
	deleteFood();
	editFood();
}

//show all items in the Food table
function showList() {
	FoodList = getList("/food");
	showTable(FoodList, 'food');
}
//delete chosen item
function deleteFood() {
    var target = $(".glyphicon-trash");
    var message = deletes(target, FoodList, "/delete_food/", "NAME");
    if(message=="SUCCESS"){
        goFood();
    }
}
function editFood() {
    var pencil = $(".glyphicon-pencil");
    editItem(pencil, FoodList, "../page/addFood.html");
}
//Search Site filter
function searchFood() {
	search(".sname");
}