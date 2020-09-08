'use strict';
/**
 * Defines a logger with system logging functions.
 * @param logLevel Determines the minimum type of logs to display.
 */
class Logger {
    static #_logLevel = 0;
    static set logLevel(logLevel) { Logger.#_logLevel = isFinite(+logLevel) ? +logLevel : 0; }

     /**
      * Print a message for debugging. (Log level = 1)
      * @param message Message to print.
      */
    static debug(message) { Logger.#printLog(1, 'DEBUG', '#aaa', message); }

    /**
     * Print an informational message. (Log Level = 2)
     * @param message Message to print.
     */
    static info(message) { Logger.#printLog(2, 'INFO', '#fff', message); }

    /**
     * Print a warning. (Log Level = 3)
     * @param message Message to print.
     */
    static warn(message) { Logger.#printLog(3, 'WARN', '#ff5', message); }

    /**
     * Print an error message. (Log Level = 4)
     * @param message Message to print.
     */
    static error(message) { Logger.#printLog(4, 'ERROR', '#faa', message); }

    /**
     * Print an error with the highest severity. (Log Level = 5)
     * @param message Message to print.
     */
    static severe(message) { Logger.#printLog(5, 'SEVERE', '#f55', message); }

    static #printLog(level, typeString, fontColor, message) {
        if(Logger.#_logLevel <= level) {
            console.log('%c[' + typeString.toUpperCase() + '] ' + Logger.#getLineNumber() +
                ' - ' + Logger.#getCurrentTime() +
                '\n\t' + message.toString().trim(),
                'color:' + fontColor + ';');
        }
    };

    static #getLineNumber() {
        // Error[0] => getLineNumber[1] => print[2] => Logger[3] => Caller[4] => Caller[5...]
        const caller = (new Error).stack.trim().split('\n')[4].trim().replace(/^.*[\\\/ ]/, '').split(':');
        return caller[0] + ':' + parseInt(caller[1]);
    };

    static #getCurrentTime = () => {
        const now = new Date();
        return now.getHours().toString().padStart(2, '0') + ':' +
            now.getMinutes().toString().padStart(2, '0') + ':' +
            now.getSeconds().toString().padStart(2, '0') + '.' +
            now.getMilliseconds().toString().padStart(3, '0');
    };
}
