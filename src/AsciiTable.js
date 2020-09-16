'use strict';
/**
 * Use this class to create a table with ASCII characters.
 */
class AsciiTable {
    /**
     * Each column is the smallest width that fits all the contents on 1 line
     */
    static WIDTH_MIN = 0;
    /**
     * Align text in all cells to the left
     */
    static ALIGN_LEFT = 0;
    /**
     * Align text in all cells to the right
     */
    static ALIGN_RIGHT = 1;

    #colWidth = 0;
    #cellAlign = 0;
    #cellPadding = 1;
    #cols = 0;
    #rows = [];

    /**
     * Create a new instance of an ASCII Table. This function can be chained with addRow(...) and print()
     * @param colWidth Define the static width of each column in characters, or use WIDTH_MIN
     * @param cellAlign Set the text alignment in all the cells using ALIGN_LEFT or ALIGN_RIGHT
     * @param cellPadding Set the padding of each cell in character spaces
     * @param columns Input any number of column headers here, as string
     */
    constructor(colWidth, cellAlign, cellPadding, ... columns) {
        if(isFinite(+colWidth)) {
            this.#colWidth = +colWidth;
        } else {
            'Invalid column width';
        }
        if(isFinite(+cellAlign)) {
            this.#cellAlign = +cellAlign;
        } else {
            'Invalid cell align';
        }
        if(isFinite(+cellPadding)) {
            this.#cellPadding = +cellPadding;
        } else {
            'Invalid cell padding';
        }
        this.#cols = columns.length;
        if(this.#cols <= 0) {
            throw 'No columns defined';
        }
        this.#rows.push([]);
        for(let i = 0; i < columns.length; i++) {
            this.#rows[0].push(columns[i]);
        }
        return this;
    }

    /**
     * Append a new row to the bottom of the table.
     * This function can be chained together.
     * @param contents Content to fill the cells with in this row
     */
    addRow(... contents) {
        if(this.#cols !== arguments.length) {
            throw 'Each row should accept '+this.#cols+' arguments. Found '+arguments.length;
        }
        this.#rows.push([]);
        for(let col = 0; col < this.#cols; col++) {
            this.#rows[this.#rows.length-1].push(arguments[col]);
        }
        return this;
    }

    /**
     * Return the ASCII representation of this table.
     */
    print() {
        let table = '';
        table += '+';
        for(let col = 0; col < this.#rows[0].length; col++) {
            table += '-'.repeat(this.#getRowLengthPadding(col));
            table += '+';
        }
        table += '\n';
        for(let row = 0; row < this.#rows.length; row++) {
            for(let line = 0; line < this.#getLinesRequired(row); line++) {
                table += '|'+this.#getPadding();
                for(let col = 0; col < this.#rows[row].length; col++) {
                    table += this.#getChunk(row, col, line);
                    table += this.#getPadding()+'|'+this.#getPadding();
                }
                table += '\n';
            }
            table += '+';
            for(let col = 0; col < this.#rows[row].length; col++) {
                table += '-'.repeat(this.#getRowLengthPadding(col));
                table += '+';
            }
            table += '\n';
        }
        return table;
    }

    #getPadding() {
        return ' '.repeat(this.#cellPadding);
    }

    #getRowLength(col) {
        if(this.#colWidth === AsciiTable.WIDTH_MIN) {
            return this.#getLongest(col);
        } else if(this.#colWidth > 0) {
            return this.#colWidth;
        } else {
            throw 'Invalid column width';
        }
    }

    #getRowLengthPadding(col) {
        return this.#getRowLength(col) + 2 * this.#cellPadding;
    }

    #getLongest(col) {
        let longest = 0;
        for(let row = 0; row < this.#rows.length; row++) {
            if(this.#rows[row][col].length > longest) {
                longest = this.#rows[row][col].length;
            }
        }
        return longest;
    }

    #getLinesRequired(row) {
        let lines = 0;
        for(let col = 0; col < this.#rows[row].length; col++) {
            const current = Math.ceil(this.#rows[row][col].length / this.#getRowLength(col));
            if(current > lines) { lines = current; }
        }
        return lines;
    }

    #getChunk(row, col, line) {
        const rowLength = this.#getRowLength(col);
        switch(this.#cellAlign) {
            case AsciiTable.ALIGN_LEFT: {
                return (this.#rows[row][col].substr(line * rowLength, rowLength) + ' '.repeat(rowLength))
                    .substr(0, rowLength);
            }
            case AsciiTable.ALIGN_RIGHT: {
                return (' '.repeat(rowLength) + this.#rows[row][col].substr(line * rowLength, rowLength))
                    .substr(-rowLength)
            }
            default: {
                throw 'Invalid cell alignment';
            }
        }
    }
}
