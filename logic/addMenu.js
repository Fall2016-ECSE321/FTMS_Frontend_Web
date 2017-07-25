var newitem;
var recipeList = [];

function initial() {
	//navigate buttons
	$(".glyphicon-plus").on("click",addRecipe);
	$("#change").on("click",submit);
	$("#cancel").on("click",goMenu);
	//navigate side bar 
	navigation();
	
	newitem = true;
	showFoodSelector();
	showPicked();
	resize_sidebar();
	deleteRecipe();

}

function showFoodSelector() {
	var selector = $("#foodName");
	$.ajax({
		type:"get",
		url:server+'/food',
		async:false,
		timeout:10000,
		success:function(data) {
			if(data != "empty") {
				data = JSON.parse(data);
				for(var i=0; i<data.length; i++) {
					var name = data[i].NAME;
					selector.append("<option>"+name+"</option>");
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
		var menu = JSON.parse(localStorage.getItem("Picked"));
		var menuID = menu.ID;
		//get all the recipe for the menu
		$.ajax({
			type:"get",
			url:server+'/menu/' + menuID,
			async:false,
			timeout:10000,
			success:function(data) {
				if(data != "empty") {
					recipeList = JSON.parse(data);
				}
			},
			error:function(type) {
				alert("timeout");
			},
		});
		//display menu info
		$("#menuName").val(menu.NAME);
		$("#menuPrice").val(menu.PRICE);
		var table = $(".w3-table-all");
		for(var i=0; i<recipeList.length; i++) {
			var row = $('<tr></tr>').appendTo(table);
			$('<td></td>').text(recipeList[i].FOOD_NAME).appendTo(row);
			$('<td></td>').text(recipeList[i].AMOUNT).appendTo(row);
			var lastcol = $('<td></td>').appendTo(row);
			$('<i></i>').attr({class: ["glyphicon", "glyphicon-trash", "w3-hover-black"].join(' ')}).appendTo(lastcol);
		}
	}
}

function addRecipe() {
	var newRecipe = {};
	newRecipe.FOOD = $("#foodName option:selected").text();
	newRecipe.QUANTITY = $("#ingredientsQuan").val();
	//check input validation
	if(newRecipe.FOOD == "Choose food") {
		$("#foodError").text("Please choose a food"); return false;
	} else {$("#foodError").text("");}
	if(!qValudation(newRecipe.QUANTITY)){return false;}
	//add to the table
	var table = $(".w3-table-all");
	var row = $('<tr></tr>').appendTo(table);
	$('<td></td>').text(newRecipe.FOOD).appendTo(row);
	$('<td></td>').text(newRecipe.QUANTITY).appendTo(row);
	var lastcol = $('<td></td>').appendTo(row);
	$('<i></i>').attr({class: ["glyphicon", "glyphicon-trash", "w3-hover-black"].join(' ')}).appendTo(lastcol);
	deleteRecipe();
}
function deleteRecipe() {
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
	var newMenu = {};
	//error messages
	var message = "";
	newMenu.NAME = $("#menuName").val();
	newMenu.PRICE = $("#menuPrice").val();
	//check input validation
    if(!(nValudation(newMenu.NAME) && pValudation(newMenu.PRICE))){return false;}
	//update menu
	var reqType;
    var URL;
	if(newitem) {
		newMenu.ID = randomString(32);
		newMenu.POPULARITY = 0;
		reqType = 'post';
		URL = server+'/add_menu';
	} else {
		newMenu.ID = JSON.parse(localStorage.getItem("Picked")).ID;
		newMenu.POPULARITY = JSON.parse(localStorage.getItem("Picked")).POPULARITY;
        reqType = 'put';
        URL = server+'/update_menu';

		for(var i=0; i<recipeList.length; i++) {
			$.ajax({
				type:"delete",
				url:server+'/delete_recipe/' + recipeList[i].ID,
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
	if(message !== "SUCCESS") {alert(message);return false;}
	
	var newRecipe = {};
	newRecipe.MID = newMenu.ID;
	//update each recipe in the table
	var rows = $($(".w3-table-all").children()[1]).children();
	for(var i=0; i<rows.length; i++) {
		var food_name = $($(rows[i]).children()[0]).text();
		var amount = $($(rows[i]).children()[1]).text();
		newRecipe.FOOD_NAME = food_name;
		newRecipe.AMOUNT = amount;
		$.ajax({
			type:"post",
			url:server+'/add_recipe',
			contentType:"application/x-www-form-urlencoded",
			data:newRecipe,
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
	if(message == "SUCCESS") {goMenu();}
}