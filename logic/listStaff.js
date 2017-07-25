var staffList = [];

function initial() {
	//navigate buttons
	$(".glyphicon-plus").on("click",addStaff);
	//navigate side bar 
	navigation();
	
	showList();
	resize_sidebar();
	viewStaff();
	deleteStaff();
}

//show all items in the Equipment table
function showList() {
	var table = $(".w3-table");
	$.ajax({
		type:"get",
		url:server+"/staff",
		async:false,
		timeout:10000,
		success:function(data) {
			if(data != "empty") {
				data = JSON.parse(data);
				staffList = data;
				for(var i=0; i<data.length; i++) {
					var name = data[i].NAME;
					var position = data[i].ROLE;
					var row = $('<tr></tr>').appendTo(table);
					var firstcol = $('<td></td>').attr({class: ["w3-col", "l3", "w3-center"].join(' ')}).appendTo(row);
					firstcol.append('<img src="../resource/user.jpg" class="w3-round-jumbo" style="width: 20%;">');
					$('<td></td>').attr({class: ["w3-col", "l3", "w3-center", "sname"].join(' ')}).text(name).appendTo(row);
					$('<td></td>').attr({class: ["w3-col", "l3", "w3-center"].join(' ')}).text(position).appendTo(row);
					var lastcol = $('<td></td>').attr({class: ["w3-col", "l3", "w3-center"].join(' ')}).appendTo(row);
					$('<button></button>').addClass("w3-hover-blue-grey w3-text-black w3-border").attr('style', 'padding-left: 5%; padding-right: 5%; margin-right: 2%').text("View").appendTo(lastcol);
					if(position != "Manager"){
						$('<button></button>').addClass("w3-hover-blue-grey w3-text-black w3-border").attr('style', 'padding-left: 5%; padding-right: 5%;').text("Delete").appendTo(lastcol);	
					}
				}	
			}
		},
		error:function(type) {
			alert("timeout");
		},
	});
}
//delete chosen item
function deleteStaff() {
    var target = $('button').filter(function(i){ return $(this).text() === "Delete"; });
    var message = deletes(target, staffList, "/delete_staff/", "ID");
    if(message=="SUCCESS"){
        goOrder();
    }
}
//add event to each staff's name
function viewStaff() {
	var view = $('button').filter(function(i){ return $(this).text() === "View"; });
    editItem(view, staffList, "viewProfile.html");
}
//Search Site filter
function searchStaff() {
    search(".sname");
}