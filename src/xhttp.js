'use strict';
/**
 * Use this to send HTTP requests to a server.
 */
class XHTTP {
    /**
     * Make an HTTP request
     * @param destination The destination path or filename to make a request to
     * @param callback The callback function on success, should have a string parameter
     */
    static request(destination, callback) {
        const xhttp = window.XMLHttpRequest ? new XMLHttpRequest() :
            new ActiveXObject('Microsoft.XMLHTTP');
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4) {
                if(xhttp.status >= 200 && xhttp.status < 300) {
                    callback(xhttp.responseText);
                } else {
                    throw destination+' returned with error '+xhttp.status+
                        (xhttp.statusText ? ': '+xhttp.statusText : '');
                }
            }
        };
        xhttp.open('GET', destination, true);
        xhttp.send();
    }
}
