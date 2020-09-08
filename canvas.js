/**
 * Create a new HTMLCanvasElement with existing event handlers.
 * @param {string} title The title of the game. Leave null to keep title as existing value.
 * @param {string} id The HTML id of the canvas.
 * @param {number} width The width of the canvas, in pixels.
 * @param {number} height The height of the canvas, in pixels.
 * @param {number} tabIndex The tab index of the canvas.
 * @param {HTMLElement} parentElement The element that the canvas is nested in.
 * @param {number} framesPerSecond The amount of frames to be displayed, per second.
 * @param {string} backgroundColor The hex code of the background color.
 * @param {boolean} caseSensitivity When true, the input received is case sensitive.
 * @param {boolean} pauseOnLoseFocus When true, the game will pause when the window loses focus.
 * @param {number} fadeSpeed How fast the previous frame fades behind the new frame. 0 = never, 1 = instant
 * @param {function} refreshCallback The function to call on frame update. (int: frame)
 * @param {function} clickCallback The function to call on mouse click. (int: x, int: y)
 */
function Canvas(title, id, width, height, tabIndex, parentElement, framesPerSecond, backgroundColor, caseSensitivity, pauseOnLoseFocus, fadeSpeed, refreshCallback, clickCallback) {
    // ====================== //
    // === Default Values === //
    // ====================== //
    const defaultTitle = null;
    const defaultId = null;
    const defaultWidth = 600;
    const defaultHeight = 400;
    const defaultTabIndex = 1;
    const defaultParentElement = document.body;
    const msPerSec = 1000;
    const defaultFramesPerSecond = 10;
    const defaultBackgroundColor = "#000";
    const defaultCaseSensitivity = false;
    const defaultPauseOnLoseFocus = true;
    const defaultFadeSpeed = 1;
    const defaultRefreshCallback = (frame) => {};
    const defaultClickCallback = (x, y) => {};
    // ========================== //
    // === Private Properties === //
    // ========================== //
    const _title = title || defaultTitle;
    const _id = id || defaultId;
    const _width = width || defaultWidth;
    const _height = height || defaultHeight;
    const _tabIndex = tabIndex || defaultTabIndex;
    const _parentElement = parentElement || defaultParentElement;
    const _refreshRate = msPerSec / (framesPerSecond ? framesPerSecond : defaultFramesPerSecond);
    const _backgroundColor = backgroundColor || defaultBackgroundColor;
    const _caseSensitivity = (caseSensitivity === true || caseSensitivity === false) ?
        caseSensitivity : defaultCaseSensitivity;
    const _pauseOnLoseFocus = (pauseOnLoseFocus === true || pauseOnLoseFocus === false) ?
        pauseOnLoseFocus : defaultPauseOnLoseFocus;
    const _fadeSpeed = fadeSpeed >= 0 ? fadeSpeed : defaultFadeSpeed;
    const _canvas = document.createElement("canvas");
    const _context = _canvas.getContext("2d");
    const _keysDown = [];
    let   _frame = 0;
    let   _refreshCallback = refreshCallback || defaultRefreshCallback;
    let   _clickCallback = clickCallback || defaultClickCallback;
    // ====================== //
    // === Public Methods === //
    // ====================== //
    this.graphics = () => _context;
    this.getWidth = () => _width;
    this.getHeight = () => _height;
    this.getInterval = () => _refreshRate;
    this.isKeyDown = (key) => _keysDown.includes(_caseSensitivity ? key : key.toLowerCase());
    this.setRefreshCallback = (newRefreshCallback) => {
        _refreshCallback = newRefreshCallback || _refreshCallback || defaultRefreshCallback;
    };
    this.setClickCallback = (newClickCallback) => {
        _clickCallback = newClickCallback || _clickCallback || defaultClickCallback;
    };
    // ==================== //
    // === Canvas Setup === //
    // ==================== //
    if(_id) { _canvas.id = _id; }
    _canvas.width = _width;
    _canvas.height = _height;
    _canvas.style.backgroundColor = _backgroundColor;
    _canvas.tabIndex = _tabIndex;
    // ====================== //
    // === Event Handling === //
    // ====================== //
    _canvas.addEventListener("keydown", (e) => {
        e.preventDefault();
        let keyName = e.key;
        if(!_caseSensitivity) { keyName = keyName.toLowerCase(); }
        if(!_keysDown.includes(keyName)) {
            _keysDown.push(keyName);
        }
    }, false);
    _canvas.addEventListener("keyup", (e) => {
        e.preventDefault();
        let keyName = e.key;
        if(!_caseSensitivity) { keyName = keyName.toLowerCase(); }
        if(_keysDown.includes(keyName)) {
            for(let i = 0; i < _keysDown.length; i++) {
                if(_keysDown[i] === keyName) {
                    _keysDown.splice(i, 1);
                    return;
                }
            }
        }
    }, false);
    _canvas.addEventListener("click", (e) => {
        e.preventDefault();
        _canvas.focus(); // Redundancy
        _clickCallback(e.x, e.y);
    }, false);
    const _refresh = () => {
        if(_pauseOnLoseFocus && _canvas === document.activeElement) {
            if(_fadeSpeed >= 1) {
                _context.clearRect(0, 0, _width, _height);
            } else if(_fadeSpeed > 0) {
                _context.fillStyle = "rgba(0,0,0," + _fadeSpeed + ")";
                _context.fillRect(0, 0, _width, _height);
            }
            _refreshCallback(++_frame);
        }
    };
    setInterval(_refresh, _refreshRate);
    // ======================= //
    // === Document Append === //
    // ======================= //
    if(_title) { document.title = _title; }
    _parentElement.appendChild(_canvas);
    _canvas.focus();
}
