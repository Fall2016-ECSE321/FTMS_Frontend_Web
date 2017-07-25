var OrderList = [];

function initial() {
	//navigate buttons
	$(".glyphicon-plus").on("click",addOrder);
	//navigate side bar 
	navigation();
	
	showList();
	resize_sidebar();
	deleteOrder();
	editOrder();
	viewOrder();
}
//show all items in the Order table
function showList() {
	OrderList = getList("/order");
	showTable(OrderList, 'order');
}
//delete chosen item
function deleteOrder() {
    var target = $(".glyphicon-trash");
    var message = deletes(target, OrderList, "/delete_order/", "ID");
    if(message=="SUCCESS"){
        goOrder();
    }
}
function editOrder() {
    var pencil = $(".glyphicon-pencil");
    editItem(pencil, OrderList, "addOrder.html");
}
//add event to each order's id
function viewOrder() {
	var view = $(".underline");
    editItem(view, OrderList, "listSingleOrder.html");
}
//Search Site filter
function searchOrder() {
    search(".underline");
}
