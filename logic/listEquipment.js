var EquipmentList = [];

function initial() {
	//navigate buttons
	$(".glyphicon-plus").on("click",addEquipment);
	//navigate side bar 
    navigation();
	
	showList();
	resize_sidebar();
	deleteEquip();
	editEquip();
}

//show all items in the Equipment table
function showList() {
	EquipmentList = getList("/equipment");
	showTable(EquipmentList, 'equipment');
}
//delete chosen item
function deleteEquip() {
    var target = $(".glyphicon-trash");
	var message = deletes(target, EquipmentList, "/delete_equipment/", "NAME");
	if(message=="SUCCESS"){
		goEquipment();
	}
}
function editEquip() {
	var pencil = $(".glyphicon-pencil");
	editItem(pencil, EquipmentList, "addEquipment.html");
}
//Search Site filter
function searchEquip() {
	search(".sname");
}
