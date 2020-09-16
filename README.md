# JS Essentials

## AsciiTable
Prints tables using ASCII characters.

### Define a new AsciiTable
```
let table = new AsciiTable(
    WIDTH_MIN | int: columnWidth,
    ALIGN_LEFT | ALIGN_RIGHT,
    int: cellPadding,
    string: columns ...);
```

### Add Rows
```
table.addRow(string: content ...)
    .addRow(string: content ...)
    .addRow(string: content ...);
```

### Return String Representation
```
let tableStr = table.print();
```

### Shorthand
```
let tableStr = new AsciiTable(
        WIDTH_MIN | int: columnWidth,
        ALIGN_LEFT | ALIGN_RIGHT,
        int: cellPadding,
        string: columns ...)
    .addRow(string: content ...)
    .addRow(string: content ...)
    .addRow(string: content ...)
    .print();
```

## Canvas
Defines a html canvas element with predefined event listeners.

### Initialization
```
let canvas = new Canvas(
        string: title | null,
        string: id | null,
        int: width,
        int: height,
        int: tabIndex,
        element: parentElement = document.body,
        int: framesPerSecond,
        string: backgroundColor,
        bool: caseSensitivity,
        bool: pauseOnLoseFocus,
        function: refreshCallback,
        function: clickCallback);
```

### Getters
```
canvas2dcontext:
    canvas.graphics;
int:
    canvas.width;
    canvas.height;
    canvas.interval;
```

### Setters
```
canvas.refreshCallback = function(int: frame, obj: {int: x: mouseHoverX, int: y: mouseHoverY});
canvas.clickCallback = function(obj: {int: x: mouseHoverX, int: y: mouseHoverY});
```

### Check for Input
```
bool:
    canvas.isKeyDown(string: key);
```

## Logger
Improves console logging functions.
The following table demonstrates the minimum log level required for each log type and was made with an AsciiTable.
```
+--------+---+
| Type   | # | 
+--------+---+
| Debug  | 1 | 
+--------+---+
| Info   | 2 | 
+--------+---+
| Warn   | 3 | 
+--------+---+
| Error  | 4 | 
+--------+---+
| Severe | 5 | 
+--------+---+
```

### Set Minimum Log Level
In this example, Logger will only print `error` and `severe` logs.
```
Logger.logLevel = 4;
```

### Log Message
```
Logger.severe(string: message);
```
