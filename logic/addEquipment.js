var newitem;
var raw_name = "";

function initial() {
	//navigate buttons
	$("#change").on("click",change);
	$("#cancel").on("click",goEquipment);
	//navigate side bar 
    navigation();
	
	newitem = true;
	showPicked();
}

//show the info of chosen item in list pages
function showPicked() {
	if(localStorage.getItem("Picked") != null) {
		var equip = JSON.parse(localStorage.getItem("Picked"));
		$("#name").val(equip.NAME);
		$("#quantity").val(equip.QUANTITY);
		$("#price").val(equip.PRICE);
		newitem = false;
		raw_name = equip.NAME.toString();
	}
}
//event handler - post changed info to backend
function change() {
	var newEquip = {};
	newEquip.NAME = $("#name").val();
	newEquip.QUANTITY = $("#quantity").val();
	newEquip.PRICE = $("#price").val();
	newEquip.RAW_NAME = raw_name;
	//check input validation
    if(!(nValudation(newEquip.NAME) && qValudation(newEquip.QUANTITY) && pValudation(newEquip.PRICE))){return false;}
    var reqType;
    var URL;
    if(newitem) {
        reqType = 'post';
        URL = server+'/add_equipment';
    } else {
        reqType = 'put';
        URL = server+'/update_equipment';
    }
    $.ajax({
        type:reqType,
        url:URL,
        contentType:"application/x-www-form-urlencoded",
        data:newEquip,
        async:false,
        timeout:5000,
        beforeSend:function(xhr){
            xhr.setRequestHeader("Authorization",localStorage.getItem("Authorization"));
        },
        success:function(data) {
            alert(data);
            if(data == "SUCCESS") {
                goEquipment();
            }
        },
        error:function(type) {
            alert("timeout");
        },
    });
}
