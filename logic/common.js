var server = 'https://shawnluxy.ddns.net:80';
var regex1 = /^[0-9]+$/;
var regex2 = /^[0-9.]+$/;


function navigation(){
    $("#logout").on("click",logout);
    $("#goProfile").on("click",goProfile);
    $("#goStaff").on("click",goStaff);
    $("#goFood").on("click",goFood);
    $("#goEquipment").on("click",goEquipment);
    $("#goMenu").on("click",goMenu);
    $("#goOrder").on("click",goOrder);
}
function logout() {
    window.location.href = "../index.html";
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
function addEquipment() {
    window.location.href = "../page/addEquipment.html";
    localStorage.removeItem("Picked");
}
function addFood() {
    window.location.href = "../page/addFood.html";
    localStorage.removeItem("Picked");
}
function addMenu() {
    window.location.href = "../page/addMenu.html";
    localStorage.removeItem("Picked");
}
function addOrder() {
    window.location.href = "../page/addOrder.html";
    localStorage.removeItem("Picked");
}
function addStaff() {
    window.location.href = "../page/addStaff.html";
}

function nValudation(name) {
    var status = true;
    // check name input
    if(name.trim().length == 0) {
        $("#nameError").text("Name cannot be Empty");status = false;
    } else if(name[0].match(regex1)) {
        $("#nameError").text("Name cannot start with Number");status = false;
    } else {
        $("#nameError").text("");
    }
    return status;
}
function qValudation(quantity) {
    var status = true;
    // check quantity input
    if(quantity.trim().length == 0) {
        $("#quantityError").text("Quantity cannot be Empty");status = false;
    } else if(!quantity.match(regex1) ||  parseInt(quantity)==0) {
        $("#quantityError").text("Quantity must be a Positive Integer");status = false;
    } else {
        $("#quantityError").text("");
    }
    return status;
}
function pValudation(price) {
    var status = true;
    // check price input
    if(price.trim().length == 0) {
        $("#priceError").text("Price cannot be Empty");status = false;
    } else if(!price.match(regex2) || parseFloat(price)==0) {
        $("#priceError").text("Price must be a Positive Number");status = false;
    } else {
        $("#priceError").text("");
    }
    return status;
}

function randomString(len) {
    var chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
    var max = chars.length;
    var str = "";
    for (i=0; i<len; i++) {
        str += chars.charAt(Math.floor(Math.random() * max));
    }
    return str;
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

function getList(url) {
    var list = [];
    $.ajax({
        type:"get",
        url:server+url,
        async:false,
        timeout:10000,
        success:function(data) {
            if(data != "empty") {
                data = JSON.parse(data);
                list = data;
            }
        },
        error:function(type) {
            alert("timeout");
        },
    });
    return list;
}
//only for (list)equipment,food,menu,order
function showTable(list, category){
    var table = $(".w3-table");
    for(var i=0; i<list.length; i++) {
        var row = $('<tr></tr>').appendTo(table);
        if(category=='order'){
            var id = list[i].ID.slice(0,10) + " ... " + list[i].ID.slice(21,31);
            var time = list[i].TIME;
            if(list[i].STATUS === "1") {
                var status = "Completed";
            } else {
                var status = "In process";
            }
            $('<td></td>').attr({class: ["w3-col", "l3", "w3-center", "underline"].join(' ')}).text(id).appendTo(row);
            $('<td></td>').attr({class: ["w3-col", "l3", "w3-center"].join(' ')}).text(time).appendTo(row);
            $('<td></td>').attr({class: ["w3-col", "l3", "w3-center"].join(' ')}).text(status).appendTo(row);
        } else{
            var name = list[i].NAME;
            var price = list[i].PRICE;
            if(category=='menu'){
                var popularity = list[i].POPULARITY;
                $('<td></td>').attr({class: ["w3-col", "l3", "w3-center", "underline"].join(' ')}).text(name).appendTo(row);
                $('<td></td>').attr({class: ["w3-col", "l3", "w3-center"].join(' ')}).text(price).appendTo(row);
                $('<td></td>').attr({class: ["w3-col", "l3", "w3-center"].join(' ')}).text(popularity).appendTo(row);
            } else{
                var quantity = list[i].QUANTITY;
                $('<td></td>').attr({class: ["w3-col", "l3", "w3-center", "sname"].join(' ')}).text(name).appendTo(row);
                $('<td></td>').attr({class: ["w3-col", "l3", "w3-center"].join(' ')}).text(quantity).appendTo(row);
                $('<td></td>').attr({class: ["w3-col", "l3", "w3-center"].join(' ')}).text(price).appendTo(row);
            }
        }
        var lastcol = $('<td></td>').attr({class: ["w3-col", "l3", "w3-center"].join(' ')}).appendTo(row);
        $('<i></i>').attr({class: ["glyphicon", "glyphicon-pencil", "w3-hover-black"].join(' ')}).attr('style', 'margin-right: 2%').appendTo(lastcol);
        $('<i></i>').attr({class: ["glyphicon", "glyphicon-trash", "w3-hover-black"].join(' ')}).appendTo(lastcol);
    }
}

//only for (list)equipment,food,order,staff
function deleteItem(url) {
    $.ajax({
        type:"delete",
        url:server + url,
        async:false,
        timeout:5000,
        beforeSend:function(xhr){
            xhr.setRequestHeader("Authorization",localStorage.getItem("Authorization"));
        },
        success:function(data) {
            alert(data);
            return data;
        },
        error:function() {
            alert("timeout");
        },
    });
}
function deletes(target, list, url, attr) {
    var trash = target;
    var message = "";
    for(var i=0; i<trash.length; i++) {
        trash[i].addEventListener("click",function(index){
            return function (){
                var item = list[index];
                message = deleteItem(url+item[attr]);
            };
        }(i), true);
    }
    return message;
}

////only for (list)equipment,food,menu,order,staff
function editItem(target, list, link) {
    var pencil = target;
    for(var i=0; i<pencil.length; i++) {
        pencil[i].addEventListener("click",function(index){
            return function (){
                var item = list[index];
                localStorage.setItem("Picked", JSON.stringify(item));
                window.location.href = link;
            };
        }(i), true);
    }
}

function search(t) {
    var inputs = $("#search").val().toLowerCase();
    var target = $(t);
    for(var i=0; i<target.length; i++) {
        var row = $(target[i]).parent();
        if($(target[i]).text().toLowerCase().indexOf(inputs) > -1) {
            row.removeAttr("style");
        } else {
            row.attr("style", "display:none");
        }
    }
}