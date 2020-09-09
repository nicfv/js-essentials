'use strict';
/**
 * Defines a canvas element with existing event handlers used as a base to build games.
 */
class Canvas {
    static #isSet(x) { return x !== undefined && x !== null; }
    static #isNumeric(x) { return Canvas.#isSet(x) && isFinite(+x); }
    static #isBool(x) { return Canvas.#isSet(x) && x === !!x; }
    static #isString(x) { return Canvas.#isSet(x) && x === x.toString(); }
    static #MS_PER_SEC = 1000;
    
    #title = null;
    #id = null;
    #width = 600;
    #height = 400;
    #tabIndex = 1;
    #parentElement = document.body;
    #framesPerSecond = 10;
    #backgroundColor = '#000';
    #caseSensitivity = false;
    #pauseOnLoseFocus = true;
    #refreshCallback = (frame, e) => {};
    #clickCallback = (e) => {};
    
    #refreshRate = Canvas.#MS_PER_SEC / this.#framesPerSecond;
    #canvas = document.createElement('canvas');
    #context = this.#canvas.getContext('2d');
    #keysDown = [];
    #mouseHover = { 'x':0, 'y':0 };
    #frame = 0;

    /**
     * Create a new HTML canvas element with pre built event handlers.
     * @param title The title of the game. Leave null to keep the existing value.
     * @param id The HTML id of the canvas.
     * @param width The width of the canvas in pixels.
     * @param height The height of the canvas in pixels.
     * @param tabIndex The tab index of the canvas.
     * @param parentElement The element that this canvas is nested in.
     * @param framesPerSecond The amount of frames to be displayed, per second.
     * @param backgroundColor A valid CSS color code for the background color of the canvas.
     * @param caseSensitivity When true, input received is case sensitive.
     * @param pauseOnLoseFocus When true, the game will pause when it loses focus.
     * @param refreshCallback The function(int: frame, obj: mouseLocation) to call on frame update.
     * @param clickCallback The function(obj: mouseLocation) to call on mouse click.
     */
    constructor(title, id, width, height, tabIndex, parentElement, framesPerSecond, backgroundColor, caseSensitivity, pauseOnLoseFocus, refreshCallback, clickCallback) {
        this.#title = Canvas.#isString(title) ? title : this.#title;
        this.#id = Canvas.#isString(id) ? id : this.#id;
        this.#width = Canvas.#isNumeric(width) ? width : this.#width;
        this.#height = Canvas.#isNumeric(height) ? height : this.#height;
        this.#tabIndex = Canvas.#isNumeric(tabIndex) ? tabIndex : this.#tabIndex;
        this.#parentElement = Canvas.#isSet(parentElement) ? parentElement : this.#parentElement;
        this.#refreshRate = Canvas.#MS_PER_SEC / (Canvas.#isNumeric(framesPerSecond) ? framesPerSecond : this.#framesPerSecond);
        this.#backgroundColor = Canvas.#isString(backgroundColor) ? backgroundColor : this.#backgroundColor;
        this.#caseSensitivity = Canvas.#isBool(caseSensitivity) ? caseSensitivity : this.#caseSensitivity;
        this.#pauseOnLoseFocus = Canvas.#isBool(pauseOnLoseFocus) ? pauseOnLoseFocus : this.#pauseOnLoseFocus;
        this.#refreshCallback = Canvas.#isSet(refreshCallback) ? refreshCallback : this.#refreshCallback;
        this.#clickCallback = Canvas.#isSet(clickCallback) ? clickCallback : this.#clickCallback;
        this.#setup();
    }

    /**
     * Represents the graphics tool to draw objects onto the canvas.
     */
    get graphics() { return this.#context; }
    /**
     * Returns the width of the canvas in pixels.
     */
    get width() { return this.#width; }
    /**
     * Returns the height of the canvas in pixels.
     */
    get height() { return this.#height; }
    /**
     * Returns the delta time in between each frame, in milliseconds.
     */
    get interval() { return this.#refreshRate; }
    /**
     * Set the callback function(int: frame, obj: mouseLocation) to call on frame update.
     */
    set refreshCallback(x) { this.#refreshCallback = Canvas.#isSet(x) ? x : this.#refreshCallback; }
    /**
     * Set the callback function(obj: mouseLocation) to call on mouse click.
     */
    set clickCallback(x) { this.#clickCallback = Canvas.#isSet(x) ? x : this.#clickCallback; }
    /**
     * Check if a key is pressed.
     * @param key Returns true if this key is pressed.
     */
    isKeyDown(key) { return this.#keysDown.includes(this.#caseSensitivity ? key : key.toLowerCase()); }
    
    #setup() {
        if(!!this.#id) { this.#canvas.id = this.#id; }
        this.#canvas.width = this.#width;
        this.#canvas.height = this.#height;
        this.#canvas.style.backgroundColor = this.#backgroundColor;
        this.#canvas.tabIndex = this.#tabIndex;
        this.#canvas.addEventListener('keydown', (e) => {
            e.preventDefault();
            let keyName = e.key;
            if(!this.#caseSensitivity) { keyName = keyName.toLowerCase(); }
            if(!this.#keysDown.includes(keyName)) {
                this.#keysDown.push(keyName);
            }
        }, false);
        this.#canvas.addEventListener('keyup', (e) => {
            e.preventDefault();
            let keyName = e.key;
            if(!this.#caseSensitivity) { keyName = keyName.toLowerCase(); }
            if(this.#keysDown.includes(keyName)) {
                for(let i = 0; i < this.#keysDown.length; i++) {
                    if(this.#keysDown[i] === keyName) {
                        this.#keysDown.splice(i, 1);
                        return;
                    }
                }
            }
        }, false);
        this.#canvas.addEventListener('mousemove', (e) => {
            e.preventDefault();
            const clientRect = e.target.getBoundingClientRect();
            this.#mouseHover.x = e.clientX - clientRect.left;
            this.#mouseHover.y = e.clientY - clientRect.top;
        }, false);
        this.#canvas.addEventListener('click', (e) => {
            e.preventDefault();
            this.#canvas.focus(); // Redundancy
            const clientRect = e.target.getBoundingClientRect();
            this.#clickCallback({ 'x':(e.clientX - clientRect.left), 'y':(e.clientY - clientRect.top) });
        }, false);
        if(this.#title) { document.title = this.#title; }
        this.#parentElement.appendChild(this.#canvas);
        this.#canvas.focus();
        setInterval(this.#refresh, this.#refreshRate);
    }

    #refresh = () => {
        if(!this.#pauseOnLoseFocus || this.#canvas === document.activeElement) {
            this.#context.clearRect(0, 0, this.#width, this.#height);
            this.#refreshCallback(++this.#frame, this.#mouseHover);
        }
    };
}
