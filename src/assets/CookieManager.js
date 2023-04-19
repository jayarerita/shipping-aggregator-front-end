
export function setCookie(name,value,expiry) {
    var expires = "";
    if (expiry) {
        expires = "; expires=" + expiry.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

export function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

export function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

/* Create a function which takes in an integer specifying a quantity and a string specifying days, hours, minutes, or seconds and returns a Date object of the current datetime plus the delta specified by the quantity and unit. */
export function getExpiry(quantity, unit) {
    let expiry = new Date();
    switch (unit) {
        case 'days':
            expiry.setTime(expiry.getTime() + quantity*24*60*60*1000);
            break;
        case 'hours':
            expiry.setTime(expiry.getTime() + quantity*60*60*1000);
            break;
        case 'minutes':
            expiry.setTime(expiry.getTime() + quantity*60*1000);
            break;
        case 'seconds':
            expiry.setTime(expiry.getTime() + quantity*1000);
            break;
        default:
            break;
    }
    return expiry;
}

