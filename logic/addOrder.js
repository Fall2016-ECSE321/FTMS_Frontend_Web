var newitem;
var menuList = [];

function initial() {
	//navigate buttons
	$(".glyphicon-plus").on("click",addOrder);
	$("#change").on("click",submit);
	$("#cancel").on("click",goOrder);
	//navigate side bar 
    navigation();
	
	newitem = true;
	showMenuSelector();
	showPicked();
	resize_sidebar();
	deleteOrder();
}

function showMenuSelector() {
	var selector = $("#dishes");
	$.ajax({
		type:"get",
		url:server+'/menu',
		async:false,
		timeout:10000,
		success:function(data) {
			if(data != "empty") {
				data = JSON.parse(data);
				for(var i=0; i<data.length; i++) {
					var id = data[i].ID;
					var name = data[i].NAME;
					selector.append("<option value="+id+">"+name+"</option>");
				}	
			}
		},
		error:function(type) {
			alert("timeout");
		},
	});
}

function showPicked() {
	if(localStorage.getItem("Picked") != null) {
		newitem = false;
		var order = JSON.parse(localStorage.getItem("Picked"));
		var orderID = order.ID;
		//get all the order's menu
		$.ajax({
			type:"get",
			url:server+'/order/' + orderID,
			async:false,
			timeout:10000,
			success:function(data) {
				if(data != "empty") {
					menuList = JSON.parse(data);
				}
			},
			error:function(type) {
				alert("timeout");
			},
		});
		//display order info
		$("#orderID").text(order.ID.slice(0,7) + " ... " + order.ID.slice(24,31));
		var table = $(".w3-table-all");
		for(var i=0; i<menuList.length; i++) {
			var row = $('<tr></tr>').appendTo(table);
			$('<td></td>').text(menuList[i].MENU_NAME).attr("id",menuList[i].MID).appendTo(row);
			$('<td></td>').text(menuList[i].AMOUNT).appendTo(row);
			var lastcol = $('<td></td>').appendTo(row);
			$('<i></i>').attr({class: ["glyphicon", "glyphicon-trash", "w3-hover-black"].join(' ')}).appendTo(lastcol);
		}
	} else {
		$("#orderID").text("Auto Generated");
	}
}

function addOrder() {
	var newOrder = {};
	newOrder.MID = $("#dishes option:selected").val();
	newOrder.DISHES = $("#dishes option:selected").text();
	newOrder.QUANTITY = $("#dishesQuan").val();
	//check input validation
	if(newOrder.DISHES == "Choose dishes") {
		$("#dishesError").text("Please choose dishes"); return false;
	} else {$("#dishesError").text("");}
	if(!qValudation(newOrder.QUANTITY)){return false;}
	//add to the table
	var table = $(".w3-table-all");
	var row = $('<tr></tr>').appendTo(table);
	$('<td></td>').text(newOrder.DISHES).attr("id",newOrder.MID).appendTo(row);
	$('<td></td>').text(newOrder.QUANTITY).appendTo(row);
	var lastcol = $('<td></td>').appendTo(row);
	$('<i></i>').attr({class: ["glyphicon", "glyphicon-trash", "w3-hover-black"].join(' ')}).appendTo(lastcol);
	deleteOrder();
}
function deleteOrder() {
	var trash = $(".glyphicon-trash");
	for(var i=0; i<trash.length; i++) {
		trash[i].addEventListener("click",function(index){
			return function (){
				var row = $(trash[index]).parent().parent();
				row.remove();
			};
		}(i), true);
	}
}

function submit() {
	var newOrder = {};
	//error messages
	var message = "";
	newOrder.TIME = getTime();
	newOrder.STATUS = $("#status option:selected").val();
	//check input validation
	if($("#status option:selected").text() == "Choose status") {
		$("#statusError").text("Please choose status"); return false;
	} else {$("#statusError").text("");}
	//update menu
    var reqType;
    var URL;
	if(newitem) {
		newOrder.ID = randomString(32);
        reqType = 'post';
        URL = server+'/add_order';
	} else {
		newOrder.ID = JSON.parse(localStorage.getItem("Picked")).ID;
        reqType = 'put';
        URL = server+'/update_order';
		for(var i=0; i<menuList.length; i++) {
			$.ajax({
				type:"delete",
				url:server+'/delete_orderlist/' + menuList[i].ID,
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
	}
    $.ajax({
        type:reqType,
        url:URL,
        contentType:"application/x-www-form-urlencoded",
        data:newOrder,
        async:false,
        timeout:5000,
        beforeSend:function(xhr){
            xhr.setRequestHeader("Authorization",localStorage.getItem("Authorization"));
        },
        success:function(data) {
            message = data;
        },
        error:function(type) {
            alert("timeout");
        },
    });
	if(message !== "SUCCESS") {alert(message);return false;}
	
	var newMenu = {};
	newMenu.OID = newOrder.ID;
	//update each recipe in the table
	var rows = $($(".w3-table-all").children()[1]).children();
	for(var i=0; i<rows.length; i++) {
		var mid = $($(rows[i]).children()[0]).attr("id");
		var menu_name = $($(rows[i]).children()[0]).text();
		var amount = $($(rows[i]).children()[1]).text();
		newMenu.MID = mid;
		newMenu.MENU_NAME = menu_name;
		newMenu.AMOUNT = amount;
		$.ajax({
			type:"post",
			url:server+'/add_orderlist',
			contentType:"application/x-www-form-urlencoded",
			data:newMenu,
			async:false,
			timeout:5000,
			beforeSend:function(xhr){
				xhr.setRequestHeader("Authorization",localStorage.getItem("Authorization"));
			},
			success:function(data) {
				message = data;
			},
			error:function(type) {
				alert("timeout");
			},
		});
	}
	alert(message);
	if(message == "SUCCESS") {goOrder();}
}
//show current time in ideal format
function getTime() {
	var Time = new Date();
	return Time.toISOString().slice(0,10) + " " + Time.getHours() + ":" + Time.getMinutes() + ":" + Time.getSeconds();
}