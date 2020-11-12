import moment from 'moment';
let utils = {};
import gui from '../lib/gui';
utils.getIconNameDefault = function (typeCategory) {
    let image = null;
    switch (typeCategory) {
        case "congviec":
            image = require("../assets/images/tab_congviec_off.png");
            break;
        case "giaoxe":
            image = require("../assets/images/tab_giaoxe_off.png");
            break;
        case "scan":
            image = require("../assets/images/tab_scan.png");
            break;
        case "noti":
            image = require("../assets/images/tab_noti_off.png");
            break;
        case "taikhoan":
            image = require("../assets/images/tab_taikhoan_off.png");
            break;
        default:
            image = null;
    }
    return image;
}

utils.getSelectedIconName = function (typeCategory) {
    let image = null;
    switch (typeCategory) {
        case "congviec":
            image = require("../assets/images/tab_congviec_on.png");
            break;
        case "giaoxe":
            image = require("../assets/images/tab_giaoxe_on.png");
            break;
        case "scan":
            image = require("../assets/images/tab_scan.png");
            break;
        case "noti":
            image = require("../assets/images/tab_noti_on.png");
            break;
        case "taikhoan":
            image = require("../assets/images/tab_taikhoan_on.png");
            break;
        default:
            image = null;
    }
    return image;
}
utils.getStatusColor = function (status) {
    let color;
    switch (status) {
        case "pending":
            color = 'orange';
            break;
        case "delivering":
            color = 'green';
            break;
        case "delivered":
            color = gui.mainColor;
            break;
        case "closed":
            color = 'red';
            break;
        default:
            color = 'gray';
    }
    return color;
}
utils.getStatusText = function (status) {
    let textStatus;
    switch (status) {
        case "assigned":
            textStatus = 'Đã giao';
            break;
        case "received":
            textStatus = 'Đã nhận';
            break;
        case "rejected":
            textStatus = 'Từ chối';
            break;
        case "finished":
            textStatus = 'Hoàn thành';
            break;
        case "cancelled":
            textStatus = 'Hủy';
            break;
        case "error":
            textStatus = 'Có lỗi';
            break;
        case "checked":
            textStatus = 'Kiểm tra OK';
            break;
        case "errorchecked":
            textStatus = 'Kiểm tra lỗi';
            break;
        case "autoInactive":
            textStatus = 'Yêu cầu nếu cần';
            break;
        default:
            textStatus = 'Không xác định';
    }
    return textStatus;
}
utils.getStatusVehicleText = function (status) {
    let textStatus;
    switch (status) {
        case "pending":
            textStatus = 'Chờ giao';
            break;
        case "porting":
            textStatus = 'Về từ cảng';
            break;
        case "instock":
            textStatus = 'Trong kho';
            break;
        case "outstock":
            textStatus = 'Đã xuất kho';
            break;
        case "delivering":
            textStatus = 'Đang vận chuyển';
            break;
        case "delivered":
            textStatus = 'Bàn giao đại lý';
            break;
        case "finished":
            textStatus = 'Đại lý đã nhận';
            break;
        case "error":
            textStatus = 'Có sự cố';
            break;
        case "checkout":
            textStatus = 'Đã kiểm tra xuất';
            break;
        case "temp":
            textStatus = 'Nhận tạm';
            break;
        case "coming":
            textStatus = 'Xe đã về cổng';
            break;
        default:
            textStatus = 'Không xác định';
    }
    return textStatus;
}
utils.getStatusColorQLK = function (status) {
    let color;
    switch (status) {
        case "assigned":
            color = '#627792';
            break;
        case "received":
            color = 'blue';
            break;
        case "rejected":
            color = 'red';
            break;
        case "finished":
            color = 'green';
            break;
        case "cancelled":
            color = '#627792';
            break;
        case "error":
            color = 'red';
            break;
        case "checked":
            color = gui.mainColor;
            break;
        case "errorchecked":
            color = 'red';
            break;
        case "autoInactive":
            color = '#333';
            break;
            
        default:
            color = 'gray';
    }
    return color;
}
utils.getDeliveryColor = function (status) {
    let color;
    switch (status) {
        case "temp":
            color = 'darkgray';
            break;
        case "coming":
            color = 'lightblue';
            break;
        case "pending":
            color = 'gray';
            break;
        case "instock":
            color = 'blue';
            break;
        case "outstock":
            color = 'green';
            break;
        case "delivering":
            color = 'darkcyan';
            break;
        case "delivered":
            color = 'darkgoldenrod';
            break;
        case "error":
            color = 'red';
            break;    
        case "checkout":
            color = 'skyblue';
            break;    
        default:
            color = 'darkgray';
    }
    return color;
}

utils.getTimeFmt = function(time) {

    let m = moment().valueOf() - Number(time);

    let seconds = Math.floor(m / 1000);

    let minutes = Math.floor(m / (1000 * 60));

    let hours = Math.floor(m / (1000 * 60 * 60));

    let days = Math.floor(m / (1000 * 60 * 60 * 24));

    let weeks = Math.floor(m / (1000 * 60 * 60 * 24 * 7));

    let months = Math.floor(m / (1000 * 60 * 60 * 24 * 30));

    let years = Math.floor(m / (1000 * 60 * 60 * 24 * 30 * 12));

    if (seconds < 60) {
        if (seconds < 0) {
            seconds = 0;
        }
        return seconds + ' giây trước';
    }
     if (minutes < 60) {
        return minutes + ' phút trước';
    } 
     if (hours < 24) {
        return hours + ' giờ trước';
    } 
     if (days < 7) {
        return days + ' ngày trước';
    } 
     if (weeks < 4) {
        return weeks + ' tuần trước';
    } 
     if (months < 12) {
        return months + ' tháng trước'
    } 
     if (years < 100) {
        return years + ' năm trước'
    }
}

utils.clearDot = function(str) {
    str = str.replace(".", "");
    return str;
}

export default utils;