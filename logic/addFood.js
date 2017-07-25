var newitem;
var raw_name = "";

function initial() {
	//navigate buttons
	$("#change").on("click",change);
	$("#cancel").on("click",goFood);
	//navigate side bar 
	navigation();
	
	newitem = true;
	showPicked();
}

//show the info of chosen item in list pages
function showPicked() {
	if(localStorage.getItem("Picked") != null) {
		var food = JSON.parse(localStorage.getItem("Picked"));
		$("#foodName").val(food.NAME);
		$("#foodQuantity").val(food.QUANTITY);
		$("#foodPrice").val(food.PRICE);
		newitem = false;
		raw_name = food.NAME.toString();
	}
}
//event handler - post changed info to backend
function change() {
	var newFood = {};
	newFood.NAME = $("#foodName").val();
	newFood.QUANTITY = $("#foodQuantity").val();
	newFood.PRICE = $("#foodPrice").val();
	newFood.RAW_NAME = raw_name;
	// check input validation
	if(!(nValudation(newFood.NAME) && qValudation(newFood.QUANTITY) && pValudation(newFood.PRICE))){return false;}
	var reqType;
	var URL;
	if(newitem) {
		reqType = 'post';
		URL = server+'/add_food';
	} else {
        reqType = 'put';
        URL = server+'/update_food';
	}
    $.ajax({
        type:reqType,
        url:URL,
        contentType:"application/x-www-form-urlencoded",
        data:newFood,
        async:false,
        timeout:5000,
        beforeSend:function(xhr){
            xhr.setRequestHeader("Authorization",localStorage.getItem("Authorization"));
        },
        success:function(data) {
            alert(data);
            if(data == "SUCCESS") {
                goFood();
            }
        },
        error:function(type) {
            alert("timeout");
        },
    });
}