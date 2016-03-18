    /**
     * Created by Daniel Kristensen (www.smartArtsStudio.com.au) on 1/03/2016.
     *
     * The MIT License(MIT)  http://opensource.org/licenses/mit-license.html
     *
     * Copyright(c)  2016  Daniel Kristensen (www.smartArtsStudio.com.au)
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */

this["SmartSVGPath"] = (function () {   'use strict';
////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                                                                                                //
//        ██████                      ██   ██████ ██  ██ ██████ ██████        ██   ██             //
//        ██                          ██   ██     ██  ██ ██     ██  ██        ██   ██             //
//        ██     ████████ █████ ████ █████ ██     ██  ██ ██     ██  ██ █████ █████ █████          //
//        ██████ ██ ██ ██    ██ ██    ██   ██████ ██  ██ ██ ███ ██████    ██  ██   ██ ██          //
//            ██ ██ ██ ██ █████ ██    ██       ██ ██  ██ ██  ██ ██     █████  ██   ██ ██          //
//            ██ ██ ██ ██ ██ ██ ██    ██       ██  ████  ██  ██ ██     ██ ██  ██   ██ ██          //
//        ██████ ██ ██ ██ █████ ██    ████ ██████   ██   ██████ ██     █████  ████ ██ ██          //
//                                                                                                //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Name space for smarter SVG path management methods, to gain total mastery of SVG
     * path data to make more advanced SVG animations easier and more enjoyable.
     *
     * We don't always control the SVG output from Illustrator, Inkscape  etc... even when we do,
     * paths can still come out in an undesired order or direction for animation. Manipulating targeted
     * path data is probably a lot quicker, (now easier) and smarter than having the artist/designer
     * have to redo work they have already completed just in a different order.
     *
     * SmartSVGPath came about because I could not find a javascript library that knew how to
     * reverse an SVG path!! So reversing SVG path data, and arbitrarily change which vertex is the
     * first vertex are at least two features of this library which you will have trouble finding
     * elsewhere. Well at least prior to my release of this library, and I looked pretty hard.
     *
     * The 'd' String Methods: work directly on the SVGElement attribute 'd' data string.
     * SVGElement Methods: work directly on both individual and collections of DOM SVGElements
     * automatically:
     *      - converting there <shape> data and attributes to 'd' attribute data string.
     *      - rewriting an existing 'd' attribute data string.
     *
     * Node.js and Browser compatible, just drop it where-ever you want it and access it via
     * SmartSVGPath.methodName (or your own alias).
     *
     * Don't instantiate SmartSVGPath, its a static 'class', just use it.
     *
     * Why the strange SmartSVGPath['method'] string naming for method declarations?
     * Smarter google Closure compatibility. This produces optimised output that does not
     * depend on, or add additional Closure library bloat to your source code, JUST to access method
     * name 'symbols'. Closure compiler renames properties in Advanced mode, but it never renames
     * strings.
     *
     * Note the method SmartSVGPath['method'] naming convention is only for the public API methods.
     * So Closure can still aggressively optimise away on the private stuff.
     *
     * @static
     * @class   SmartSVGPath
     * @constructor
     */
    var SmartSVGPath = function () {};

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//     ██      ██████  ██        ██                  ██   ██        ██   ██             ██        //
//     ██      ██      ██                            ███ ███        ██   ██             ██        //
//  █████      ██     █████ ████ ██ █████ █████      ███████ █████ █████ █████ █████ █████ █████  //
//  ██ ██      ██████  ██   ██   ██ ██ ██ ██ ██      ██ █ ██ ██ ██  ██   ██ ██ ██ ██ ██ ██ ██     //
//  ██ ██          ██  ██   ██   ██ ██ ██ ██ ██      ██   ██ █████  ██   ██ ██ ██ ██ ██ ██ █████  //
//  ██ ██          ██  ██   ██   ██ ██ ██ ██ ██      ██   ██ ██     ██   ██ ██ ██ ██ ██ ██    ██  //
//  █████      ██████  ████ ██   ██ ██ ██ █████      ██   ██ █████  ████ ██ ██ █████ █████ █████  //
//                                           ██                                                   //
//                                        █████                                                   //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Returns an array of the commands that make up a <path d=''> path attribute string.
     *
     * @static
     * @public
     * @method  getCommands
     * @param   {String}    d   SVG <path d=''> path attribute string.
     * @returns {Array}         Array of subPaths.
     */
    SmartSVGPath["getCommands"] = function ( d ) {
        d = SmartSVGPath.normalize( d );
        // Split string before each command.
        var subPaths = d.replace( /([a-zA-Z])\s?/g, '|$1' ).split( '|' );
        // Discard the empty string created by origin split('|M').
        if ( subPaths[0] == '' ) {
            subPaths.splice( 0, 1 );
        }
        return subPaths;
    };

    /**
     * Normalise the data from an SVG <path d=''> path attribute string.
     *
     * Path strings can be delimited in a variety of ways, SmartSVGPath.normalize cleans up and
     * standardises the path string for SmartSVGPath operations.
     *
     * @static
     * @public
     * @method  normalize
     * @param   {String}            d   SVG <path d=''> path attribute string.
     * @returns {String|Boolean}    d   Normalised path attribute string, or FALSE if 'd' not String.
     */
    SmartSVGPath["normalize"] = function ( d ) {
        if ( typeof d !== 'string' ) {
            return false
        }
        d = d.replace( /[,\n\r]/g, ' ' );        // Replace commas, new line and carriage return characters with spaces.
        d = d.replace( /-/g, ' - ' );            // Space delimit 'negative' signs. (maybe excessive but safe)
        d = d.replace( /-\s+/g, '-' );           // Remove space to the right of 'negative's.
        d = d.replace( /([a-zA-Z])/g, ' $1 ' );  // Space delimit the command.
        d = d.replace( /\s+/g, ' ' ).trim();     // Compact excess whitespace.
        return d;
    };

    /**
     * Reverse an SVG <path d=''> path attribute.
     * ('Absolute' or 'Relative' path commands.)
     *
     * @static
     * @public
     * @method  reverse
     * @param   {string}    d               SVG <path d=""> attribute path string.
     * @param   {number}  [precision=1]     How many decimal places to round coordinates to.
     * @returns {string}
     */
    SmartSVGPath["reverse"] = function ( d, precision ) {
        var absolutePath = SmartSVGPath.toAbsolute( d, precision );
        return SmartSVGPath.reverseAbsolute( absolutePath );
    };

    /**
     * Reverse an SVG <path d=''> path attribute string containing absolute path
     * drawing commands.
     *
     * Reverses the path arguments and shifts the path commands left by
     * one or two vertices depending on the command:
     *
     *   Shifts L two arguments left,
     *   Shifts Q two arguments left,
     *   Shifts C four arguments left,
     *   Shifts A five arguments left,
     *   Shifts M to the start,
     *   and appends Z only if required.
     *
     * @static
     * @public
     * @method  reverseAbsolute
     * @param   {string}  absolutePath    SVG <path d=''> attribute string containing
     *                                    'absolute' path drawing commands.
     * @param   {number}  [precision=1]   How many decimal places to round coordinates to.
     * @returns {string}                  Reversed absolute path string.
     */
    SmartSVGPath["reverseAbsolute"] = function ( absolutePath, precision ) {

        absolutePath = SmartSVGPath.normalize( absolutePath );

        var tokens = absolutePath.split( ' ' );
        var tokensLength = tokens.length;
        var reversed = [];
        // current point & control points.
        var x, y, cx1, cy1, cx2, cy2;
        // arcTo arguments.
        var rx, ry, xAxisRotation, largeArcFlag, sweepFlag;
        // Reversed path data.
        var path, reversedPath, closePath;

        for (var i = 0; i < tokensLength; i++) {
            var token = tokens[i];

            // Parse tokens for path command.
            switch (token) {
                // For each command reverse its arguments and
                // shift the command itself appropriately.
                case 'M':
                {
                    x = tokens[++i];
                    y = tokens[++i];
                    reversed.push( y, x );
                    break;
                }
                case 'L':
                {
                    x = tokens[++i];
                    y = tokens[++i];
                    reversed.push( token, y, x );
                    break;
                }
                case 'Q':
                {
                    cx1 = tokens[++i];
                    cy1 = tokens[++i];
                    x = tokens[++i];
                    y = tokens[++i];
                    reversed.push( cy1, cx1, token, y, x );
                    break;
                }
                case 'C':
                {
                    cx1 = tokens[++i];
                    cy1 = tokens[++i];
                    cx2 = tokens[++i];
                    cy2 = tokens[++i];
                    x = tokens[++i];
                    y = tokens[++i];
                    reversed.push( cy1, cx1, cy2, cx2, token, y, x );
                    break;
                }
                case 'A':
                {
                    rx = tokens[++i];
                    ry = tokens[++i];
                    xAxisRotation = tokens[++i];
                    largeArcFlag = tokens[++i];
                    // cast string to number, reverse as boolean, cast boolean to number.
                    sweepFlag = +(!(+tokens[++i]));
                    x = tokens[++i];
                    y = tokens[++i];
                    reversed.push( sweepFlag, largeArcFlag, xAxisRotation, ry, rx, token, y, x );
                    break;
                }
                case 'Z':
                {
                    reversed.push( ' Z' );
                    break;
                }
                default:
                {
                    // This token is not an absolute path command!
                    // ie: lower case relative path command from a non absolute path string,
                    // or corrupted path output.
                    var before = tokens.slice( Math.max( i - 4, 0 ), 3 ).join( ' ' );
                    var after = tokens.slice( i + 1, Math.min( i + 3, tokensLength - 1 ) ).join( ' ' );
                    var span = before + ' >[' + token + ']< ' + after;
                    throw(
                        '[SmartSVGPath Error] SmartSVGPath.reverseAbsolute expected absolute SVG path command. At vertex ' + i + ' (' + span + ')\n' +
                        'either the path command is not an absolute path, or the path has become corrupted. Please check the data string.');
                }
            }
        }
        // Generate reversed path string.
        path = reversed.reverse();
        closePath = /[Z]/.test( path[0] ) ? path.shift() : '';
        reversedPath = 'M ' + path.join( ' ' ) + closePath;

        if ( !!precision ) {
            reversedPath = SmartSVGPath.roundDecimals( reversedPath, precision )
        }
        return reversedPath;
    };

    /**
     * Reverse subPaths contained within an <path d=''> string.
     * ('Absolute' or 'Relative' path commands.)
     *
     * By passing an array of subPath Number indices you wish to reverse, to the subPathIndices
     * parameter you can target or exclude specific sub-paths. Or pass TRUE: to reverse ALL sub-paths.
     *
     * If there are no subPaths with in the <path d=''> string, the whole path is reversed.
     *
     * @static
     * @public
     * @method  reverseSubPath
     * @param   {String}  path                          <path d=''> string.
     * @param   {Array.<Number>}  [subPathIndices=all]  Sub-path (1 based) indices you wish to reverse.
     *                                                  From the range 1 -> total sub-paths.
     * @param   {Boolean}         [absolute=false]      FALSE:  (default) passes 'd' into SmartSVGPath.toAbsolute().
     *                                                  TRUE:   skips ensuring 'd' is in absolute path commands.
     *                                                      Will throw an error if it is not absolute.
     * @returns {String}                                Reversed path/sub-path string.
     */
    SmartSVGPath["reverseSubPath"] = function ( path, subPathIndices, absolute ) {
        var indices, subPathArray;
        // reverseAbsolute() removes the arc commands which toAbsolute() needs the option to maintain.
        var absolutePath = !absolute ? this.toAbsolute( path ) : path;
        // Split sub-paths before 'moveTo' command(s).
        var paths = absolutePath.replace( /M/g, '|M' ).split( '|' );
        // Discard the empty string created by origin split('|M').
        paths.splice( 0, 1 );

        // define subPath indices array...
        if ( subPathIndices && subPathIndices.length > 0 ) {
            indices = subPathIndices.length;
            subPathArray = subPathIndices;
        }
        else {
            // set default to an all subPaths array.
            indices = paths.length;
            subPathArray = SmartSVGPath._newIndicesVector( indices );
        }
        if ( paths.length == 1 ) {
            // There are no sub-paths contained within this path.
            return this.reverseAbsolute( absolutePath );
        }
        for (var i = 0; i < indices; i++) {
            // Normalise 'subPathIndices' 1 based index, to the Array's 0 based index.
            var subPathIndex = subPathArray[i] - 1;
            var subPath = paths[subPathIndex];
            if ( subPath ) {
                paths[subPathIndex] = this.reverseAbsolute( subPath.trim() );
            }
        }
        return paths.join( ' ' );
    };


    /**
     * Ensures SVG <path d=''> attribute path string is in 'absolute' commands.
     * (Takes either 'Absolute' or 'Relative' path commands.)
     *
     * @static
     * @public
     * @method  toAbsolute
     * @param   {String}    d                   SVG <path d=""> attribute path string.
     * @param   {Number}    [precision=1]       How many decimal places to limit coordinates to.
     * @returns {String}
     */
    SmartSVGPath["toAbsolute"] = function ( d, precision/*, reversible*/ ) {
        if ( typeof d !== 'string' ) {
            return d
        }

        var absolutePath = '';
        var args = [], argsLength;
        var commands = SmartSVGPath.getCommands( d );
        var commandsLength = commands.length;
        var j, name, command, token;
        // current point
        var x = 0, y = 0;
        // start point
        var xStart = 0, yStart = 0;
        // Bézier curve control points.
        var cx1 = 0, cy1 = 0, cx2 = 0, cy2 = 0;
        // arcTo args
        var x1 = 0, y1 = 0, rx = 0, ry = 0;
        var xAxisRotation, largeArcFlag, sweepFlag;
        var x2 = 0, y2 = 0;
        var cubicSubPath;

        for (var i = 0; i < commandsLength; i++) {

            // Tokenise sub-path.
            command = commands[i];
            name = command.substring( 0, 1 );
            token = name.toLowerCase();
            args = command.replace( name, '' ).trim().split( ' ' );
            argsLength = args.length;

            // Parse tokens & build absolute path string.
            // What's with all the '+args[]'? ...The '+' is a bitwise operation,
            // The result of which Strings are returned as Numbers (32bits).
            switch (token) {

                /* Lines */

                // moveTo
                case 'm':
                {
                    if ( name === 'm' ) {
                        x += +args[0];
                        y += +args[1];
                    }
                    else {
                        x = +args[0];
                        y = +args[1];
                    }
                    absolutePath += ' M' + x + ' ' + y;
                    // Cache start vertex, for potential closePath command 'Z/z'
                    xStart = x;
                    yStart = y;
                    if ( argsLength > 2 ) {
                        // Process implied moveTo command(s).
                        for (j = 0; j < argsLength; j += 2) {
                            if ( name === 'm' ) {
                                x += +args[j];
                                y += +args[j + 1];
                            }
                            else {
                                x = +args[j];
                                y = +args[j + 1];
                            }
                            absolutePath += ' L ' + x + ' ' + y;
                        }
                    }
                    break;
                }
                // lineTo
                // Draw a line to the given coordinates.
                case 'l':
                {
                    for (j = 0; j < argsLength; j += 2) {
                        if ( name === 'l' ) {
                            x += +args[j];
                            y += +args[j + 1];
                        }
                        else {
                            x = +args[j];
                            y = +args[j + 1];
                        }
                        absolutePath += ' L ' + x + ' ' + y;
                    }
                    break;
                }
                // Draw a horizontal line to the given x-coordinate.
                case 'h':
                {
                    for (j = 0; j < argsLength; j++) {
                        if ( name === 'h' ) {
                            x += +args[j];
                        }
                        else {
                            x = +args[j];
                        }
                        absolutePath += ' L ' + x + ' ' + y;
                    }
                    break;
                }
                // Draw a vertical line to the given x-coordinate.
                case 'v':
                {
                    for (j = 0; j < argsLength; j++) {
                        if ( name === 'v' ) {
                            y += +args[j];
                        }
                        else {
                            y = +args[j];
                        }
                        absolutePath += ' L ' + x + ' ' + y;
                    }
                    break;
                }

                /* Bézier Curves */

                // Quadratic curveTo: from the current point to (x, y) using control point (cx1, cy1).
                case 'q':
                {
                    // In loop to account for 'poly-Bézier' arguments.
                    for (j = 0; j < argsLength; j += 4) {
                        if ( name === 'q' ) {
                            cx1 = x + +args[j];
                            cy1 = y + +args[j + 1];
                            x += +args[j + 2];
                            y += +args[j + 3];
                        }
                        else {
                            cx1 = +args[j];
                            cy1 = +args[j + 1];
                            x = +args[j + 2];
                            y = +args[j + 3];
                        }
                        absolutePath += ' Q ' + cx1 + ' ' + cy1 + ' ' + x + ' ' + y;
                    }
                    break;
                }
                // Quadratic curveTo: from the current point to (x, y) using a control point
                // which is the reflection of the previous Q command's control point,
                // else the current control point.
                case 't':
                {
                    // In loop to account for 'poly-Bézier' arguments.
                    for (j = 0; j < argsLength; j += 2) {
                        // Reflect previous control point across current point's new vector.
                        cx1 = x + (x - cx1);
                        cy1 = y + (y - cy1);
                        // New end vertex to interpolate to.
                        if ( name === 't' ) {
                            x += +args[j];
                            y += +args[j + 1];
                        }
                        else {
                            x = +args[j];
                            y = +args[j + 1];
                        }
                        absolutePath += ' Q ' + cx1 + ' ' + cy1 + ' ' + x + ' ' + y;
                    }
                    break;

                }
                // Cubic curveTo: from the current point to (x, y) using control point (cx1, cy1)
                // as the control point for the beginning of the curve and (cx2, cy2) as the
                // control point for the endpoint of the curve.
                case 'c':
                {
                    // In loop to account for 'poly-Bézier' arguments.
                    for (j = 0; j < argsLength; j += 6) {
                        if ( name === 'c' ) {
                            cx1 = x + +args[j];
                            cy1 = y + +args[j + 1];
                            cx2 = x + +args[j + 2];
                            cy2 = y + +args[j + 3];
                            x += +args[j + 4];
                            y += +args[j + 5];
                        }
                        else {
                            cx1 = +args[j];
                            cy1 = +args[j + 1];
                            cx2 = +args[j + 2];
                            cy2 = +args[j + 3];
                            x = +args[j + 4];
                            y = +args[j + 5];
                        }
                        absolutePath += ' C ' + cx1 + ' ' + cy1 + ' ' + cx2 + ' ' + cy2 + ' ' + x + ' ' + y;
                    }
                    break;
                }
                // Cubic curveTo: from the current point to (x, y), using (cx2, cy2) as the control
                // point for this new endpoint. The first control point will be the reflection
                // of the previous C command's ending control point. If there is no previous curve,
                // the current point will be used as the first control point.
                case 's':
                {
                    // In loop to account for 'poly-Bézier' arguments.
                    for (j = 0; j < argsLength; j += 4) {
                        // Reflect previous control point across x/y.
                        cx1 = x + (x - cx2);
                        cy1 = y + (y - cy2);
                        // New end vertex to interpolate to.
                        if ( name === 's' ) {
                            cx2 = x + +args[j];
                            cy2 = y + +args[j + 1];
                            x += +args[j + 2];
                            y += +args[j + 3];
                        }
                        else {
                            cx2 = +args[j];
                            cy2 = +args[j + 1];
                            x = +args[j + 2];
                            y = +args[j + 3];
                        }
                        absolutePath += ' C ' + cx1 + ' ' + cy1 + ' ' + cx2 + ' ' + cy2 + ' ' + x + ' ' + y;
                    }
                    break;
                }

                /* Geometric Arc curve */

                // arcTo: from the current (x, y) point using control point (cx1, cy1)
                // as the control point for the beginning of the curve and (cx2, cy2) as the
                // control point for the endpoint of the curve (x2, y2).
                case 'a':
                {
                    x1 = x;
                    y1 = y;
                    rx = +args[0];
                    ry = +args[1];
                    xAxisRotation = +args[2];
                    largeArcFlag = +args[3];
                    sweepFlag = +args[4];

                    if ( name === 'a' ) {
                        x2 = x += +args[5];
                        y2 = y += +args[6];
                    }
                    else {
                        x2 = x = +args[5];
                        y2 = y = +args[6];
                    }
                    // if ( !!reversible ) {
                    //      // convert arcs to concatenated Bézier curves
                    //      cubicSubPath = SmartSVGPath.arcToCurve( x1, y1, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x2, y2 );
                    //      // cubic arguments may contain 'poly-Bézier' arguments (chained Bézier curves),
                    //      // which are not 'absolute' path notation, so toAbsolute( command )...
                    //      absolutePath += ' '+ SmartSVGPath.toAbsolute( cubicSubPath, !!reversible );
                    // }
                    // else {
                    absolutePath += ' A ' + rx + ' ' + ry + ' ' + xAxisRotation + ' ' + largeArcFlag + ' '
                        + sweepFlag + ' ' + x + ' ' + y;
                    // }
                    break;
                }
                // closePath
                case 'z':
                {
                    // closePath...
                    absolutePath += ' Z';
                    // ...updates 'current vertex' to the start vertex.
                    // So 'moveTo' start vertex:
                    x = xStart;
                    y = yStart;
                    break;
                }
            }
        }

        if ( !!precision ) {
            absolutePath = SmartSVGPath.roundDecimals( absolutePath, precision )
        }
        return absolutePath.trim();
    };

    /**
     * Converts the arguments for an 'A/a' arcTo command which generates a geometric arcs, to a
     * 'C/c' command that generates an equivalent cubic Bézier curve (path command).
     *
     * @static
     * @public
     * @method  arcToCurve
     * @param x1                current x        Absolute coordinates of the current point on
     * @param y1                current y        the path, obtained from the last two arguments
     *                                           of the previous path command.
     * @param rx                radius x         X-axis radius.
     * @param ry                radius y         Y-axis radius.
     * @param angle             x-axis-rotation  From the x-axis of the current coordinate system
     *                                           to the x-axis of the ellipse.
     * @param largeArcFlag                       0 if an arc spanning less than or equal to 180
     *                                           degrees is chosen, or 1 if an arc spanning greater
     *                                           than 180 degrees is chosen.
     * @param sweepFlag                          0 if the line joining center to arc sweeps through
     *                                           decreasing angles, or 1 if it sweeps through
     *                                           increasing angles.
     * @param x2                end at X         X co-ordinate to interpolate to.
     * @param y2                end at Y         Y co-ordinate to interpolate to.
     * @param polyCubic                          This cubic-Bézier continues from the arguments
     *                                           immediately prior.
     * @returns {String}        cubic curveTo    Cubic (poly)Bézier sub-path.
     */
    SmartSVGPath["arcToCurve"] = function ( x1, y1, rx, ry, angle, largeArcFlag, sweepFlag, x2, y2, polyCubic ) {
        return ' C ' + SmartSVGPath._arcToCubicArgs( x1, y1, rx, ry, angle, largeArcFlag, sweepFlag, x2, y2, polyCubic ).toString();
    };

    /**
     * Converts 'A/a' arcTo command's arguments to an array of cubic Bézier ARGUMENTS.
     *
     * NOTE:    Returns cubic Bézier ARGUMENTS *NOT* a cubic Bézier path.
     *          SmartSVGPath.arcToCurve converts the _arcToCubicArgs array to a path.
     *
     *          http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
     *          6.3 Parameterization alternatives:
     *
     * @private
     * @method  _arcToCubicArgs
     * @param   {number}  x1
     * @param   {number}  y1
     * @param   {number}  rx
     * @param   {number}  ry
     * @param   {number}  angle
     * @param   {number}  largeArcFlag
     * @param   {number}  sweepFlag
     * @param   {number}  x2
     * @param   {number}  y2
     * @param   {Array}  polyCubic
     * @returns {Array}
     * @private
     */
    SmartSVGPath._arcToCubicArgs = function ( x1, y1, rx, ry, angle, largeArcFlag, sweepFlag, x2, y2, polyCubic ) {
        var rotate = SmartSVGPath._arcToCubicArgs.rotate;
        var sqrt = Math.sqrt;
        var abs = Math.abs;
        var asin = Math.asin;
        var cos = Math.cos;
        var sin = Math.sin;
        var tan = Math.tan;
        var PI = Math.PI;
        var degrees120 = PI * 120 / 180;
        var radians = PI / 180 * (+angle || 0);
        var vector;
        var args = [];

        if ( !polyCubic ) {
            // Get path vector.
            vector = rotate( x1, y1, -radians );
            x1 = vector.x;
            y1 = vector.y;
            vector = rotate( x2, y2, -radians );
            x2 = vector.x;
            y2 = vector.y;
            var x = (x1 - x2) / 2;
            var y = (y1 - y2) / 2;
            // pre calculate 'squared' values.
            var rx2 = rx * rx;
            var ry2 = ry * ry;
            var xx2 = x * x;
            var yy2 = y * y;
            var yLength = xx2 / rx2 + yy2 / ry2;
            if ( yLength > 1 ) {
                // Get arc radii.
                yLength = sqrt( yLength );
                rx = yLength * rx;
                ry = yLength * ry;
            }
            // Which side of the cubic path should control points be?
            var normal = (largeArcFlag == sweepFlag ? -1 : 1)
                * sqrt( abs( (rx2 * ry2 - rx2 * yy2 - ry2 * xx2)
                    / (rx2 * yy2 + ry2 * xx2 ) ) );
            var cx = normal * (rx * y / ry) + ((x1 + x2) / 2);
            var cy = normal * (-ry * x / rx) + ((y1 + y2) / 2);

            // Sweeping ClockWise or CounterClockWise?
            var flagA = asin( (y1 - cy) / ry );
            var flagB = asin( (y2 - cy) / ry );
            flagA = x1 < cx ? PI - flagA : flagA;
            flagB = x2 < cx ? PI - flagB : flagB;
            if ( flagA < 0 ) {
                flagA = flagA + PI * 2;
            }
            if ( flagB < 0 ) {
                flagB = flagB + PI * 2;
            }
            if ( sweepFlag && flagA > flagB ) {
                flagA = flagA - PI * 2;
            }
            if ( !sweepFlag && flagB > flagA ) {
                flagB = flagB - PI * 2;
            }
        }
        else {
            flagA = polyCubic[0];
            flagB = polyCubic[1];
            cx = polyCubic[2];
            cy = polyCubic[3];
        }
        var sweepAngle = flagB - flagA;
        if ( abs( sweepAngle ) > degrees120 ) {
            var x2old = x2;
            var y2old = y2;
            var flag2old = flagB;
            flagB = flagA + degrees120 * (sweepFlag && flagB > flagA ? 1 : -1);
            x2 = cx + rx * cos( flagB );
            y2 = cy + ry * sin( flagB );
            args = SmartSVGPath._arcToCubicArgs( x2, y2, rx, ry, angle, 0, sweepFlag, x2old, y2old, [flagB, flag2old, cx, cy] );
        }

        // Build cubic (poly)Bézier curve command arguments.
        sweepAngle = flagB - flagA;
        var cosA = cos( flagA );
        var sinA = sin( flagA );
        var cosB = cos( flagB );
        var sinB = sin( flagB );
        var arcUnit = tan( sweepAngle / 4 );
        var fourThirds = 4 / 3;
        var xLength = rx * fourThirds * arcUnit;
        yLength = ry * fourThirds * arcUnit;
        var arg1 = [x1, y1];
        var arg2 = [x1 + xLength * sinA, y1 - yLength * cosA];
        var arg3 = [x2 + xLength * sinB, y2 - yLength * cosB];
        var arg4 = [x2, y2];
        arg2[0] = 2 * arg1[0] - arg2[0];
        arg2[1] = 2 * arg1[1] - arg2[1];
        if ( polyCubic ) {
            return [arg2, arg3, arg4].concat( args );
        }
        else {
            args = [arg2, arg3, arg4].concat( args ).join().split( ',' );
            var cubicArgs = [];
            var argsLength = args.length;
            for (var i = 0; i < argsLength; i++) {
                cubicArgs[i] = i % 2 ? rotate( args[i - 1], args[i], radians ).y : rotate( args[i], args[i + 1], radians ).x;
            }
            return cubicArgs;
        }
    };

    /**
     * Rotate vector components by radians.
     *
     * NOTE: Rotate() is a static field for SmartSVGPath._arcToCubicArgs.
     *
     * @static
     * @private
     * @method  rotate
     * @param   {number}    x
     * @param   {number}    y
     * @param   {number}    radians
     * @returns {{x: number, y: number}}
     */
    SmartSVGPath._arcToCubicArgs.rotate = function ( x, y, radians ) {
        var X = x * Math.cos( radians ) - y * Math.sin( radians ),
            Y = x * Math.sin( radians ) + y * Math.cos( radians );
        return {x: X, y: Y};
    };

    /**
     * Creates a path from any <shape> SVGElement.
     *
     * @static
     * @public
     * @method  fromElement
     * @param   {SVGElement}    svgElement
     * @param   {Number}        [precision=1]     How many decimal places to round coordinates to.
     * @returns {String}
     */
    SmartSVGPath["fromElement"] = function ( svgElement, precision ) {

        if ( !svgElement ) {
            return
        }
        switch (svgElement.nodeName) {
            case 'circle':
                return SmartSVGPath.fromCircle( svgElement, precision );
            case 'ellipse':
                return SmartSVGPath.fromEllipse( svgElement, precision );
            case 'line':
                return SmartSVGPath.fromLine( svgElement, precision );
            case 'path':
                return SmartSVGPath.fromPath( svgElement, precision );
            case 'polygon':
                return SmartSVGPath.fromPolygon( svgElement, precision );
            case 'polyline':
                return SmartSVGPath.fromPolyline( svgElement, precision );
            case 'rect':
                return SmartSVGPath.fromRect( svgElement, precision );
        }
    };

    /**
     * Creates a path from a <circle> SVGElement.
     *
     * @static
     * @public
     * @method  fromCircle
     * @param   {SVGElement}    circleElement
     * @param   {Number}        [precision=1]     How many decimal places to round coordinates to.
     * @returns {String}
     */
    SmartSVGPath["fromCircle"] = function ( circleElement, precision ) {
        /* Specific attributes: cx cy r */
        var cx, cy, r, pathString;

        cx = +circleElement.getAttribute( 'cx' );
        cy = +circleElement.getAttribute( 'cy' );
        r = +circleElement.getAttribute( 'r' );

        pathString = SmartSVGPath._ellipsePathString( cx, cy, r );

        if ( pathString.indexOf( '.' ) != -1 ) {
            pathString = SmartSVGPath.roundDecimals( pathString, precision || 1 );
        }
        return  pathString;
    };

    /**
     * Creates a path from an <ellipse> SVGElement.
     *
     * @static
     * @public
     * @method  fromEllipse
     * @param   {SVGEllipseElement} ellipseElement
     * @param   {Number}            [precision=1]     How many decimal places to round coordinates to.
     * @returns {String}
     */
    SmartSVGPath["fromEllipse"] = function ( ellipseElement, precision ) {
        /* Specific attributes: cx cy rx ry */
        var cx, cy, rx, ry, transform, pathString;
        var xAxisRotation = 0;
        var transformArgs = [];

        cx = +ellipseElement.getAttribute( 'cx' );
        cy = +ellipseElement.getAttribute( 'cy' );
        rx = +ellipseElement.getAttribute( 'rx' );
        ry = +ellipseElement.getAttribute( 'ry' );
        transform = ellipseElement.getAttribute( 'transform' );

        // Check for x axis rotation.
        if ( transform && transform.indexOf( 'matrix' ) !== -1 ) {
            transformArgs = transform.replace( /^matrix\s*\(([\d.\s-]+)\)/g, '$1' ).split( /\s|,/ );
        }
        if ( transformArgs.length > 0 ) {
            xAxisRotation = Math.acos( transformArgs[0] ) * 180 / Math.PI;
            if ( transformArgs[transformArgs.length - 1] > 0 ) {
                xAxisRotation *= -1;
            }
        }
        pathString = SmartSVGPath._ellipsePathString( cx, cy, rx, ry, xAxisRotation );

        if ( pathString.indexOf( '.' ) != -1 ) {
            pathString = SmartSVGPath.roundDecimals( pathString, precision || 1 );
        }
        return  pathString;
    };

    /**
     * Creates a path string for an <ellipse> SVGElement, which includes a <circle>.
     *
     * @static
     * @public
     * @method  _ellipsePathString
     * @param   {number}    cx
     * @param   {number}    cy
     * @param   {number}    rx
     * @param   {number}    ry
     * @param   {number}    xAxisRotation
     * @returns {String}
     */
    SmartSVGPath._ellipsePathString = function ( cx, cy, rx, ry, xAxisRotation ) {
        cx = +cx;
        cy = +cy;
        rx = +rx;
        // No 'ry' or 'xAxisRotation' if it is a <circle>.
        ry = +ry || rx;
        xAxisRotation = +xAxisRotation || 0;
        var radians = xAxisRotation * Math.PI / 180;
        var x1 = cx - rx * Math.cos( radians );
        var y1 = cy - rx * Math.sin( radians );
        var x2 = x1 + 2 * rx * Math.cos( radians );
        var y2 = y1 + 2 * rx * Math.sin( radians );
        var isLargeArc = +(xAxisRotation - ry > 180);
        // Absolute path command.
        return 'M ' + x1 + ' ' + y1 +
            ' A' + rx + ' ' + ry + ' ' + 0 + ' ' + isLargeArc + ' ' + 0 + ' ' + x2 + ' ' + y2 +
            ' A' + rx + ' ' + ry + ' ' + 0 + ' ' + isLargeArc + ' ' + 0 + ' ' + x1 + ' ' + y1 + ' ' + 'Z';
    };

    /**
     * Creates a path from a <line> SVGElement.
     *
     * @static
     * @public
     * @method  fromLine
     * @param   {SVGElement}    lineElement
     * @param   {number}        [precision=1]     How many decimal places to round coordinates to.
     * @returns {string}
     */
    SmartSVGPath["fromLine"] = function ( lineElement, precision ) {
        /* Specific attributes: x1 x2 y1 y2 */
        var x1, y1, x2, y2;

        x1 = +lineElement.getAttribute( 'x1' );
        y1 = +lineElement.getAttribute( 'y1' );
        x2 = +lineElement.getAttribute( 'x2' );
        y2 = +lineElement.getAttribute( 'y2' );

        var pathString =
            'M ' + x1 + ' ' + y1
            + ' L ' + x2 + ' ' + y2;

        if ( pathString.indexOf( '.' ) != -1 ) {
            pathString = SmartSVGPath.roundDecimals( pathString, precision || 1 );
        }
        return  pathString;
    };

    /**
     * Creates a path from a <polygon> SVGElement.
     *
     * Arbitrary lineTo points defining any CLOSED path using: closePath 'Z/z'.
     *
     * @static
     * @public
     * @method  fromLine
     * @param   {SVGPolygonElement} polygonElement
     * @param   {number}            [precision=1]     How many decimal places to round coordinates to.
     * @returns {string}
     */
    SmartSVGPath["fromPolygon"] = function ( polygonElement, precision ) {
        /* Specific attributes: closedPath 'Z/z',  Points */
        var pathString = SmartSVGPath.fromPolyline( polygonElement, precision );
        return pathString + 'Z';
    };

    /**
     * Creates a path from a <polygon> SVGElement.
     *
     * Arbitrary drawing commands defining an OPEN or CLOSED path.
     *
     * @static
     * @public
     * @method  fromLine
     * @param   {SVGPolygonElement} pathElement
     * @param   {number}            [precision=1]     How many decimal places to round coordinates to.
     * @returns {string}
     */
    SmartSVGPath["fromPath"] = function ( pathElement, precision ) {
        /* Specific attributes: 'd' data string */
        var pathString = SmartSVGPath.normalize( pathElement.attributes.d.nodeValue );
        pathString = SmartSVGPath.toAbsolute( pathString );

        if ( !!precision && pathString.indexOf( '.' ) != -1 ) {
            pathString = SmartSVGPath.roundDecimals( pathString, precision );
        }
        return  pathString;
    };

    /**
     * Creates a path from a <polyline> SVGElement.
     *
     * Arbitrary lineTo points defining an OPEN path.
     *
     * @static
     * @public
     * @method  fromPoly
     * @param   {SVGPolylineElement}    polylineElement
     * @param   {number}                [precision=1]     How many decimal places to round coordinates to.
     * @returns {string}
     */
    SmartSVGPath["fromPolyline"] = function ( polylineElement, precision ) {
        /* Specific attributes: Points */
        var points, pathString;
        points = polylineElement.getAttribute( 'points' );
        // coordinates and coordinate pairs can be separated by commas or whitespace.
        points = SmartSVGPath.normalize( points );
        points = points.split( ' ' );

        pathString = 'M' + points[0] + ' ' + points[1];
        points = points.slice( 2 );
        var pointsLength = points.length;
        for (var i = 0; i < pointsLength; i += 2) {
            pathString += ' L' + points[i] + ' ' + points[i + 1];
        }

        if ( pathString.indexOf( '.' ) != -1 ) {
            pathString = SmartSVGPath.roundDecimals( pathString, precision || 1 );
        }
        return  pathString;
    };

    /**
     * Creates a path from a <rect> SVGElement.
     *
     * @static
     * @public
     * @method  fromRect
     * @param   {SVGRectElement}    rectElement
     * @param   {number}            [precision=1]     How many decimal places to round coordinates to.
     * @returns {string}
     */
    SmartSVGPath["fromRect"] = function ( rectElement, precision ) {
        /* Specific attributes: x y width height, rx, ry */
        var x, y, width, height, rx, ry, pathString;
        var x0, x1, x2, x3, x4, y0, y1, y2 , y3 , y4;
        var sideWidth, SideHeight, arcTo, arc1, arc2, arc3, arc4;

        x = +rectElement.getAttribute( 'x' );
        y = +rectElement.getAttribute( 'y' );
        width = +rectElement.getAttribute( 'width' );
        height = +rectElement.getAttribute( 'height' );
        rx = +rectElement.getAttribute( 'rx' );
        ry = +rectElement.getAttribute( 'ry' );

        if ( rx && rx != 0 /*&& ry && ry != 0*/ ) {
            // Rounded rectangle.
            sideWidth = width - rx * 2;
            SideHeight = height - ry * 2;
            // Is it even possible to have an rx without an ry? Just in case...
            ry = ry == 0 ? rx : ry;
            arcTo = 'A ' + rx + ' ' + ry + ' ' + 0 + ' ' + 0 + ' ' + 1 + ' ';

            // moveTo
            x0 = x += rx;
            y0 = y;
            // lineTo
            x1 = x += sideWidth;
            y1 = y;
            // arcTo
            arc1 = arcTo + (x += rx) + ' ' + (y += ry);
            // lineTo
            x2 = x;
            y2 = y += SideHeight;
            // arcTo
            arc2 = arcTo + (x -= rx) + ' ' + (y += ry);
            // lineTo
            x3 = x -= sideWidth;
            y3 = y;
            // arcTo
            arc3 = arcTo + (x -= rx) + ' ' + (y -= ry);
            // lineTo
            x4 = x;
            y4 = y -= SideHeight;
            // arcTo
            arc4 = arcTo + (x += rx) + ' ' + (y -= ry);

            pathString =
                'M ' + x0 + ' ' + y0
                + ' L ' + x1 + ' ' + y1 + ' ' + arc1
                + ' L ' + x2 + ' ' + y2 + ' ' + arc2
                + ' L ' + x3 + ' ' + y3 + ' ' + arc3
                + ' L ' + x4 + ' ' + y4 + ' ' + arc4
                + ' Z';
        }
        else {
            // standard rectangle
            x0 = x;
            y0 = y;

            x1 = x += width;
            y1 = y;

            x2 = x;
            y2 = y += height;

            x3 = x -= width;
            y3 = y;

            x4 = x;
            y4 = y -= height;

            pathString =
                'M ' + x0 + ' ' + y0
                + ' L ' + x1 + ' ' + y1
                + ' L ' + x2 + ' ' + y2
                + ' L ' + x3 + ' ' + y3
                + ' L ' + x4 + ' ' + y4
                + ' Z';
        }

        if ( pathString.indexOf( '.' ) != -1 ) {
            pathString = SmartSVGPath.roundDecimals( pathString, precision || 1 );
        }
        return  pathString;
    };

    /**
     * Checks to see it the Attr Node is contained within the exclude Array.
     * Returns TRUE if it is, FALSE otherwise.
     *
     * @static
     * @public
     * @method  isExcluded
     * @param   {Attr}              attribute   Attribute to test.
     * @param   {Array.<String>}    excluded    List of attributes to exclude.
     * @returns {Boolean}                       TRUE if in exclude list.
     *                                          FALSE otherwise.
     */
    SmartSVGPath["isExcluded"] = function ( attribute, excluded ) {
        if ( !attribute || !excluded || !Array.isArray( excluded ) ) {
            return false
        }
        return ( excluded.indexOf( attribute.nodeName ) != -1 );
    };

    /**
     * Takes any string and ensures all number's decimal places
     * are rounded off to a maximum of the specified precision.
     *
     * NOTE:    For CPU and File size optimisation.
     *
     * @static
     * @public
     * @method  roundDecimals
     * @param   {String}  string            SVG <path d=''> path attribute string.
     * @param   {Number}  [precision=1]     How many decimal places to round coordinates to.
     * @returns {String}                    SVG <path d=''> path attribute string.
     *                                      (Decimals rounded by precision.)
     */
    SmartSVGPath["roundDecimals"] = function ( string, precision ) {
        var tokens = string.split( ' ' );
        var tokensLength = tokens.length;

        for (var i = 0; i < tokensLength; i++) {
            var token = tokens[i];
            if ( token != '' && Number( token ) ) {
                tokens[i] = SmartSVGPath.smartRound( token, precision || 1 );
            }
        }
        return tokens.join( ' ' );
    };

    /**
     * Rounds floating point Numbers to a maximum of the specified decimal places.
     * It does not pad insignificant 0's to enforce the specified decimal places
     * like Javascript's Number.toFixed().
     *
     * toFixed() is uncompromising, appending insignificant trailing 0's to ensure
     * the decimal places satisfy its argument.
     *
     * Also Javascript toFixed() returns values as String data types not Number data
     * types. If you need the safety ans consistency of a Number, NOT a String:
     *
     * When using Number() to cast floating point Strings values to Number values,
     * certain values change a String values decimal places because 'Number'
     * 'evaluates' Strings it does not blindly copy their content.
     *
     * @static
     * @public
     * @method  smartRound
     * @param   {Number}  number        Number or String data type.
     * @param   {Number}  precision     How many decimal places to round to.
     * @returns {Number}
     */
    SmartSVGPath["smartRound"] = function ( number, precision ) {
        if ( precision && precision !== SmartSVGPath.smartRound.PRECISION ) {
            SmartSVGPath.smartRound.ERROR = precision !== false ? +Math.pow( .1, precision ).toFixed( precision ) : 1e-2;
            SmartSVGPath.smartRound.PRECISION = precision;
        }
        // cast Strings to efficient Numbers (efficient == stripped of insignificant trailing decimal 0's)
        number = +number;
        var rounded = +number.toFixed( precision - 1 );
        if ( +Math.abs( rounded - number ).toFixed( precision ) > SmartSVGPath.smartRound.ERROR ) {
            number = +number.toFixed( precision )
        }
        else {
            number = rounded;
        }
        return number;
        // TODO: smartRound: investigate if ?Faster alternative: Math.round(number * 100) / 100 (ie for 2 precision)
        // http://jsperf.com/parsefloat-tofixed-vs-math-round
    };
    SmartSVGPath.smartRound.PRECISION = 1;
    SmartSVGPath.smartRound.ERROR = 1e-2;

    /**
     * Set which vertex on the path is the initial vertex.
     *
     * @static
     * @public
     * @method  setFirstVertex
     * @param   {String}        d                   SVG <path d=''> path attribute string.
     * @param   {String|Number} firstVertex
     * @param   {Boolean}       [lineToWrap=false]  If the path is an OPEN path and the firstVertex
     *                                              is mid path, do you want the path to wrap with a:
     *                                                  TRUE: lineTo 'L' command (draw the wrap), or
     *                                                  FALSE: moveTo 'M' command (don't draw the wrap)
     * @returns {String|Boolean}                    SVG <path d=''> path attribute string.
     *                                              (Which starts at the nominated vertex)
     *                                              or FALSE if 'd' is not a string.
     */
    SmartSVGPath["setFirstVertex"] = function ( d, firstVertex, lineToWrap ) {
        if ( typeof d !== 'string' ) {
            return false
        }
        d = SmartSVGPath.toAbsolute( SmartSVGPath.normalize( d ) );
        var commands = SmartSVGPath.getCommands( d );
        var vertices = SmartSVGPath.traceVertices( d );
        // Convert moveTo command to lineTo.
        commands[0] = commands[0].replace( 'M', 'L' );
        var last = commands.length - 1;
        // wrap firstVertex value if firstVertex > total vertices.
        firstVertex = +firstVertex <= last ? +firstVertex : +firstVertex % last;
        // Handle CLOSED paths.
        var closePath = /[Zz]/.test( commands[last] ) ? commands.splice( last ) : [];
        // Handle OPEN paths potential vertex wrapping.
        var onWrap = !lineToWrap ? 'M ' : 'L ';
        var wrapPath = closePath.length < 1 ? [onWrap + vertices[firstVertex].from.x + ' ' + vertices[firstVertex].from.y] : [''];

        // Rotate paths to bring new first vertex to the start.
        var splice = commands.splice( 0, +firstVertex );
        var rotatedPaths = commands.concat( wrapPath ).concat( splice );
        var rotatedVertices = vertices.concat( vertices.splice( 0, firstVertex ) ); // no longer in sync due to commands.concat( wrapPath )
        // reCreate path data string.
        var pathString = 'M ' + rotatedVertices[0].from.x + ' ' + rotatedVertices[0].from.y + ' ';
        return pathString + rotatedPaths.join().replace( /\s+,/g, ' ' ) + closePath;
    };

    /**
     * Returns an array of vertex data objects, which provide the absolute vertex positions
     * which can be lost from relative commands once rotated.
     *
     * Provide a callback which console.logs the vertices data any way you wish to format it to
     * help identify the vertex you are looking for. Your callback will be passed an array of
     * objects which contain the following properties:
     *
     *  [{
     *      count: path vertices count up to and including 'current position' + 1 (the 'to:'),
     *      subPathIndex: subPath array index this object references,
     *      subPath: the subPath command + arguments string,
     *      from:   The path commands 'current point' coordinates prior to execution,
     *      to:   the new 'current point' coordinates after command execution
     *  }]
     *
     * @static
     * @public
     * @method  traceVertices
     * @param   {String}        d           SVG <path d=''> path attribute string.
     * @param   {Function}      logMethod   Callback which console.logs the vertices data.
     *                                      It will be passed an array of objects which contain
     *                                          [{  count: 'current position' path vertices count,
     *                                              subPathIndex: subPath array index this references,
     *                                              subPath: the subPath command + arguments string,
     *                                              from:   commands 'current point' coordinates,
     *                                              to:   'current point' coordinates after command
     *                                          }]
     * @returns {Object}                        Data object.
     */
    SmartSVGPath["traceVertices"] = function ( d, logMethod ) {
        if ( typeof d !== 'string' ) {
            return false
        }

        var commands = SmartSVGPath.getCommands( d );
        var commandsLength = commands.length;
        var j, vertices = [];
        // current point
        var x = 0;
        var y = 0;
        // start point
        var xStart = 0;
        var yStart = 0;
        var prevPath, count = 0;

        for (var i = 0; i < commandsLength; i++) {

            // Tokenise sub-path.
            var command = commands[i];
            var name = command.substring( 0, 1 );
            var args = command.replace( name, '' ).trim().split( ' ' );

            switch (name) {
                case 'M':
                {
                    prevPath = null;
                    vertices[i] = {
                        count       : count + 2,
                        subPathIndex: i,
                        subPath     : command,
                        from        : { x: +args[0], y: +args[1]},
                        to          : { x: +args[0], y: +args[1] }
                    };
                    xStart = x = +args[0];
                    yStart = y = +args[1];
                    prevPath = command;
                    break;
                }
                case 'L':
                {
                    vertices[i] = {
                        count       : count + 2,
                        subPathIndex: i,
                        subPath     : command,
                        from        : { x: x, y: y},
                        to          : { x: +args[0], y: +args[1] }
                    };
                    x = +args[0];
                    y = +args[1];
                    prevPath = command;
                    break;
                }
                case 'A':
                {
                    vertices[i] = {
                        count       : count + 2,
                        subPathIndex: i,
                        subPath     : command,
                        from        : { x: x, y: y},
                        to          : { x: +args[5], y: +args[6] }
                    };
                    x = +args[5];
                    y = +args[6];
                    prevPath = command;
                    break;
                }
                case 'Q':
                {
                    vertices[i] = {
                        count       : count + 2,
                        subPathIndex: i,
                        subPath     : command,
                        from        : { x: x, y: y},
                        to          : { x: +args[2], y: +args[3] }
                    };
                    x = +args[2];
                    y = +args[3];
                    prevPath = command;
                    break;
                }
                case 'C':
                {
                    vertices[i] = {
                        count       : count + 2,
                        subPathIndex: i,
                        subPath     : command,
                        from        : { x: x, y: y},
                        to          : { x: +args[4], y: +args[5] }
                    };
                    x = +args[4];
                    y = +args[5];
                    prevPath = command;
                    break;
                }
                case 'Z':
                {
                    vertices[i] = {
                        count       : count + 2,
                        subPathIndex: i,
                        subPath     : command,
                        from        : { x: x, y: y},
                        to          : { x: xStart, y: yStart }
                    };
                    x = xStart;
                    y = yStart;
                    prevPath = command;
                    break;
                }
                default:
            }
        }
        if ( !!logMethod ) {
            logMethod( vertices );
        }
        return vertices;
    };

    /**
     * @private
     * @method  _newIndicesVector
     * @param   {Number}       length
     * @return  {Array.<Number>}
     */
    SmartSVGPath._newIndicesVector = function ( length ) {
        var array = [];
        var index = 1;
        for (var i = 0; i < length; ++i) {
            array[i] = index++;
        }
        return array;
    };

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                                                                                                //
// ██████ ██  ██ ██████ ██████ ██                           ██   ██        ██   ██       ██       //
// ██     ██  ██ ██     ██     ██                           ███ ███        ██   ██       ██       //
// ██     ██  ██ ██     ██     █████ █████ █████ █████      ███████ █████ █████ █████ █████ █████ //
// ██████ ██  ██ ██ ███ ██████ ██ ██    ██ ██ ██ ██ ██      ██ █ ██ ██ ██  ██   ██ ██ ██ ██ ██    //
//     ██ ██  ██ ██  ██     ██ ██ ██ █████ ██ ██ █████      ██   ██ █████  ██   ██ ██ ██ ██ █████ //
//     ██  ████  ██  ██     ██ ██ ██ ██ ██ ██ ██ ██         ██   ██ ██     ██   ██ ██ ██ ██    ██ //
// ██████   ██   ██████ ██████ ██ ██ █████ █████ █████      ██   ██ █████  ████ ██ ██ █████ █████ //
//                                         ██                                                     //
//                                         ██                                                     //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Replaces any SVGElement(s) 'shape data' attributes with a 'd' path data attribute.
     *
     * @static
     * @public
     * @method  convertElements
     * @param   {SVGElement|HTMLCollection} svgElements
     * @param   {Number}                    [precision=1]       How many decimal places to round coordinates to.
     * @param   {Boolean|Array.<Number>}    [reversed=false]    TRUE To reverse all <shape> paths (or just some by...)
     *                                                               Specify subPaths with an array of indices [ 2,4,9 ...]
     *                                                          FALSE otherwise.
     * @param   {Boolean|Array.<Number>}    [subPaths=false]    TRUE To reverse all subPaths (or just some by...)
     *                                                               Specify subPaths with an array of indices [ 2,4,9 ...]
     *                                                               Pass NO subPaths array to reverse whole path.
     *                                                          FALSE otherwise.
     * @returns {SVGElement|HTMLCollection}
     */
    SmartSVGPath["convertElements"] = function ( svgElements, reversed, subPaths, precision ) {
        if ( !svgElements || svgElements.length == 0 ) {
            return console.log( 'SmartSVGPath ERROR: SmartSVGPath.convertElements received in-compatible data.' )
        }
        var elementName;
        if ( svgElements.nodeName ) {
            elementName = svgElements.nodeName;
        }
        else if ( svgElements[0].nodeName ) {
            elementName = svgElements[0].nodeName;
        }

        var Element = elementName.charAt( 0 ).toUpperCase() + elementName.slice( 1 );
        return SmartSVGPath['convert' + Element]( svgElements, reversed, subPaths, precision );
    };

    /**
     * Replaces any <path>(s) 'd' attribute with SmartSVGPath parse path data string.
     *
     * NOTE:    This essentially does NOTHING to <path> SVGElements.
     *          This method really just supports the convertElements() robustness so that
     *          you can throw any SVGElement collection(s) at convertElements() without having
     *          to filter <paths> out.
     *
     * @static
     * @public
     * @method  convertPath
     * @param   {SVGCircleElement|HTMLCollection}   pathElements  SVG <circle> element (or an Array of them).
     * @param   {Number}                           [precision=1]  How many decimal places to round coordinates to.
     * @param   {Boolean|Array.<Number>}        [reversed=false]  TRUE To reverse all <shape> paths (or just some by...)
     *                                                                 Specify subPaths with an array of indices [ 2,4,9 ...]
     *                                                            FALSE otherwise.
     * @param   {Boolean|Array.<Number>}        [subPaths=false]  TRUE To reverse all subPaths (or just some by...)
     *                                                                 Specify subPaths with an array of indices [ 2,4,9 ...]
     *                                                                 Pass NO subPaths array to reverse whole path.
     *                                                            FALSE otherwise.
     * @returns {SVGCircleElement|HTMLCollection}
     */
    SmartSVGPath["convertPath"] = function ( pathElements, reversed, subPaths, precision ) {
        /* Specific attributes: cx cy r */
        return SmartSVGPath._convertElementFactory( 'path', pathElements, reversed, subPaths, precision );
    };

    /**
     * Replaces any <circle> 'shape data' attributes with a 'd' path data attribute.
     *
     * @static
     * @public
     * @method  convertCircle
     * @param   {SVGCircleElement|HTMLCollection} circleElements  SVG <circle> element (or an Array of them).
     * @param   {Number}                           [precision=1]  How many decimal places to round coordinates to.
     * @param   {Boolean|Array.<Number>}        [reversed=false]  TRUE To reverse all <shape> paths (or just some by...)
     *                                                                 Specify subPaths with an array of indices [ 2,4,9 ...]
     *                                                            FALSE otherwise.
     * @param   {Boolean|Array.<Number>}        [subPaths=false]  TRUE To reverse all subPaths (or just some by...)
     *                                                                 Specify subPaths with an array of indices [ 2,4,9 ...]
     *                                                                 Pass NO subPaths array to reverse whole path.
     *                                                            FALSE otherwise.
     * @returns {SVGCircleElement|HTMLCollection}
     */
    SmartSVGPath["convertCircle"] = function ( circleElements, reversed, subPaths, precision ) {
        /* Specific attributes: cx cy r */
        return SmartSVGPath._convertElementFactory( 'circle', circleElements, reversed, subPaths, precision );
    };

    /**
     * Replaces any <ellipse> 'shape data' attributes with a 'd' path data attribute.
     *
     * @static
     * @public
     * @method  convertEllipse
     * @param   {SVGEllipseElement|HTMLCollection} ellipseElements  SVG <ellipse> element (or an Array of them).
     * @param   {Number}                           [precision=1]    How many decimal places to round coordinates to.
     * @param   {Boolean|Array.<Number>}        [reversed=false]    TRUE To reverse all <shape> paths (or just some by...)
     *                                                                   Specify subPaths with an array of indices [ 2,4,9 ...]
     *                                                              FALSE otherwise.
     * @param   {Boolean|Array.<Number>}        [subPaths=false]    TRUE To reverse all subPaths (or just some by...)
     *                                                                   Specify subPaths with an array of indices [ 2,4,9 ...]
     *                                                                   Pass NO subPaths array to reverse whole path.
     *                                                              FALSE otherwise.
     * @returns {SVGEllipseElement|HTMLCollection}
     */
    SmartSVGPath["convertEllipse"] = function ( ellipseElements, reversed, subPaths, precision ) {
        /* Specific attributes: cx cy rx ry */
        return SmartSVGPath._convertElementFactory( 'ellipse', ellipseElements, reversed, subPaths, precision );
    };

    /**
     * Replaces any <line> 'shape data' attributes with a 'd' path data attribute.
     *
     * @static
     * @public
     * @method  convertLine
     * @param   {SVGLineElement|HTMLCollection}     lineElements    SVG <line> element (or an Array of them).
     * @param   {Number}                           [precision=1]    How many decimal places to round coordinates to.
     * @param   {Boolean|Array.<Number>}        [reversed=false]    TRUE To reverse all <shape> paths (or just some by...)
     *                                                                   Specify subPaths with an array of indices [ 2,4,9 ...]
     *                                                              FALSE otherwise.
     * @param   {Boolean|Array.<Number>}        [subPaths=false]    TRUE To reverse all subPaths (or just some by...)
     *                                                                   Specify subPaths with an array of indices [ 2,4,9 ...]
     *                                                                   Pass NO subPaths array to reverse whole path.
     *                                                              FALSE otherwise.
     * @returns {SVGLineElement|HTMLCollection}
     */
    SmartSVGPath["convertLine"] = function ( lineElements, reversed, subPaths, precision ) {
        /* Specific attributes: x1 x2 y1 y2 */
        return SmartSVGPath._convertElementFactory( 'line', lineElements, reversed, subPaths, precision );
    };

    /**
     * Replaces any <polygon> 'shape data' attributes with a 'd' path data attribute.
     *
     * @static
     * @public
     * @method  convertPolygon
     * @param   {SVGPolygonElement|HTMLCollection}  polygonElements   SVG <polygon> element (or an Array of them).
     * @param   {Number}                               [precision=1]  How many decimal places to round coordinates to.
     * @param   {Boolean|Array.<Number>}            [reversed=false]  TRUE To reverse all <shape> paths (or just some by...)
     *                                                                     Specify subPaths with an array of indices [ 2,4,9 ...]
     *                                                                FALSE otherwise.
     * @param   {Boolean|Array.<Number>}            [subPaths=false]  TRUE To reverse all subPaths (or just some by...)
     *                                                                     Specify subPaths with an array of indices [ 2,4,9 ...]
     *                                                                     Pass NO subPaths array to reverse whole path.
     *                                                                FALSE otherwise.
     * @returns {SVGPolygonElement|HTMLCollection}
     */
    SmartSVGPath["convertPolygon"] = function ( polygonElements, reversed, subPaths, precision ) {
        /* Specific attributes: points, closedPath */
        return SmartSVGPath._convertElementFactory( 'polygon', polygonElements, reversed, subPaths, precision );
    };

    /**
     * Replaces any <polyline> 'shape data' attributes with a 'd' path data attribute.
     *
     * @static
     * @public
     * @method  convertPolyline
     * @param   {SVGPolylineElement|HTMLCollection}  polylineElements  SVG <polyline> element (or an Array of them).
     * @param   {Number}                               [precision=1]  How many decimal places to round coordinates to.
     * @param   {Boolean|Array.<Number>}            [reversed=false]  TRUE To reverse all <shape> paths (or just some by...)
     *                                                                     Specify subPaths with an array of indices [ 2,4,9 ...]
     *                                                                FALSE otherwise.
     * @param   {Boolean|Array.<Number>}            [subPaths=false]  TRUE To reverse all subPaths (or just some by...)
     *                                                                     Specify subPaths with an array of indices [ 2,4,9 ...]
     *                                                                     Pass NO subPaths array to reverse whole path.
     *                                                                FALSE otherwise.
     * @returns {SVGPolylineElement|HTMLCollection}
     */
    SmartSVGPath["convertPolyline"] = function ( polylineElements, reversed, subPaths, precision ) {
        /* Specific attributes: points */
        return SmartSVGPath._convertElementFactory( 'polyline', polylineElements, reversed, subPaths, precision );
    };

    /**
     * Replaces any <rect> 'shape data' attributes with a 'd' path data attribute.
     *
     * @static
     * @public
     * @method  convertRect
     * @param   {SVGRectElement|HTMLCollection}    rectElements  SVG <rect> element (or an Array of them).
     * @param   {Number}                          [precision=1]  How many decimal places to round coordinates to.
     * @param   {Boolean|Array.<Number>}       [reversed=false]  TRUE To reverse all <shape> paths (or just some by...)
     *                                                                Specify subPaths with an array of indices [ 2,4,9 ...]
     *                                                           FALSE otherwise.
     * @param   {Boolean|Array.<Number>}       [subPaths=false]  TRUE To reverse all subPaths (or just some by...)
     *                                                                Specify subPaths with an array of indices [ 2,4,9 ...]
     *                                                                Pass NO subPaths array to reverse whole path.
     *                                                           FALSE otherwise.
     * @returns {SVGRectElement|HTMLCollection}
     */
    SmartSVGPath["convertRect"] = function ( rectElements, reversed, subPaths, precision ) {
        /* Specific attributes: x y width height rx ry  */
        return SmartSVGPath._convertElementFactory( 'rect', rectElements, reversed, subPaths, precision )
    };

    /**
     * @static
     * @private
     * @method  _convertElementFactory
     * @param   {String}                                 name  The name of the SVGShapeElement.
     * @param   {SVGElement|HTMLCollection}     shapeElements  SVG <rect> element (or an Array of them).
     * @param   {Number}                        [precision=1]  How many decimal places to round coordinates to.
     * @param   {Boolean|Array.<Number>}     [reversed=false]  TRUE To reverse all <shape> paths (or just some by...)
     *                                                              Specify subPaths with an array of indices [ 2,4,9 ...]
     *                                                         FALSE otherwise.
     * @param   {Boolean|Array.<Number>}     [subPaths=false]  TRUE To reverse all subPaths (or just some by...)
     *                                                              Specify subPaths with an array of indices [ 2,4,9 ...]
     *                                                              Pass NO subPaths array to reverse whole path.
     *                                                         FALSE otherwise.
     * @returns {SVGElement|HTMLCollection}
     */
    SmartSVGPath._convertElementFactory = function ( name, shapeElements, reversed, subPaths, precision ) {

        switch (name) {
            case 'circle':
                return SmartSVGPath._convertElements(
                    shapeElements,
                    'circle',
                    [ 'cx', 'cy', 'r' ],
                    'fromCircle',
                    reversed,
                    subPaths,
                    precision
                );

            case 'ellipse':
                return SmartSVGPath._convertElements(
                    shapeElements,
                    'ellipse',
                    [ 'cx', 'cy', 'rx', 'ry' ],
                    'fromEllipse',
                    reversed,
                    subPaths,
                    precision
                );

            case 'line':
                return SmartSVGPath._convertElements(
                    shapeElements,
                    'line',
                    ['x1', 'x2', 'y1', 'y2'],
                    'fromLine',
                    reversed,
                    subPaths,
                    precision
                );

            case 'path':
                return SmartSVGPath._convertElements(
                    shapeElements,
                    'path',
                    ['d'],
                    'fromPath',
                    reversed,
                    subPaths,
                    precision
                );

            case 'polygon':
                return SmartSVGPath._convertElements(
                    shapeElements,
                    'polygon',
                    ['points'],
                    'fromPolygon',
                    reversed,
                    subPaths,
                    precision
                );

            case 'polyline':
                return SmartSVGPath._convertElements(
                    shapeElements,
                    'polyline',
                    ['points'],
                    'fromPolyline',
                    reversed,
                    subPaths,
                    precision
                );

            case 'rect':
                return SmartSVGPath._convertElements(
                    shapeElements,
                    'rect',
                    ['x', 'y', 'width', 'height', 'rx', 'ry'],
                    'fromRect',
                    reversed,
                    subPaths,
                    precision
                );

            default:
                var error = 'SmartSVGPath ERROR: SmartSVGPath._convertElementFactory( ' + name + ' ) received and incompatible SVGElement, or corrupt array of SVGElements. Please check the SVGElement(s) data you are trying to convert.';
                return console.log( error );
        }
    };

    /**
     * Detects and directs the svgElements by data type.
     *
     * @static
     * @private
     * @method  _convertElements
     * @param   {SVGElement|HTMLCollection}   svgElements     SVG <shape> element (or an Array of them).
     * @param   {String}                      shape           The name of the shape element.
     * @param   {Array.<String>}              attributes      Unique attributes to be filtered out of path clone.
     * @param   {Element}                     pathMethod      Method that generates the appropriate 'path' data.
     * @param   {Number}                      [precision=1]   How many decimal places to round coordinates to.
     * @param   {Boolean|Array.<Number>}    [reversed=false]  TRUE To reverse all <shape> paths (or just some by...)
     *                                                             Specify subPaths with an array of indices [ 2,4,9 ...]
     *                                                        FALSE otherwise.
     * @param   {Boolean|Array.<Number>}    [subPaths=false]  TRUE To reverse all subPaths (or just some by...)
     *                                                             Specify subPaths with an array of indices [ 1,7,11 ...]
     *                                                             Pass NO subPaths array to reverse whole path.
     *                                                        FALSE otherwise.
     * @returns {SVGElement|HTMLCollection}
     */
    SmartSVGPath._convertElements = function ( svgElements, shape, attributes, pathMethod, reversed, subPaths, precision ) {

        if ( svgElements.nodeName == shape ) {
            var array = SmartSVGPath._convertCollection( [svgElements], attributes, pathMethod, reversed, subPaths, precision );
            return array[0]
        }
        else if ( svgElements[0].nodeName == shape ) {
            return SmartSVGPath._convertCollection( svgElements, attributes, pathMethod, reversed, subPaths, precision );
        }
        var method = shape.charAt( 0 ).toUpperCase() + shape.slice( 1 );
        var error = 'SmartSVGPath ERROR: SmartSVGPath.convert' + method + ' received an incompatible SVGElement.';
        return console.log( error );
    };

    /**
     * Generates a <path> node from shapeElement(s) and removes the shapeElement(s) <shape> node.
     *
     * @static
     * @private
     * @method  _convertCollection
     * @param   {HTMLCollection}            svgElementCollection    SVG <circle> element (or an Array of them).
     * @param   {Array.<String>}            attributes              List of attributes unique to the shape element.
     * @param   {String}                    fromShapeMethod         The name of the fromShape method to extract path.
     * @param   {Boolean|Array.<Number>}    [reversed=false]        TRUE To reverse all <shape> paths (or just some by...)
     *                                                                   Specify subPaths with an array of (1-based, no 0 index)
     *                                                                   indices [ 2,4,9 ...]
     *                                                              FALSE otherwise.
     * @param   {Boolean|Array.<Number>}    [subPaths=false]        TRUE To reverse all subPaths (or just some by...)
     *                                                                   Specify subPaths with an array of (1-based, no 0 index)
     *                                                                   indices [ 2,4,9 ...]
     *                                                                   Pass NO subPaths array to reverse whole path.
     *                                                              FALSE otherwise.
     * @param   {Number}                    [precision=1]           How many decimal places to round coordinates to.
     * @returns {HTMLCollection}
     */
    SmartSVGPath._convertCollection = function ( svgElementCollection, attributes, fromShapeMethod, reversed, subPaths, precision ) {
        var reverseIndices;
        var exclude = attributes;
        var elementsLength = svgElementCollection.length;
        var pathCollection = [];
        if ( !!reversed ) {
            reverseIndices = Array.isArray( reversed ) ? reversed : SmartSVGPath._newIndicesVector( elementsLength );
        }
        for (var i = 0; i < elementsLength; i++) {
            var node = svgElementCollection[i];
            var pathString = SmartSVGPath[fromShapeMethod]( node, precision );
            // i+1 to account for 1-based indices index.
            if ( !!reversed && reverseIndices.indexOf( i + 1 ) != -1 ) {
                pathString = SmartSVGPath.reverseSubPath( pathString, subPaths, true );
            }
            if ( node.nodeName != 'path' ) {
                var pathNode = SmartSVGPath.createSVGNode( 'path', node );
                var nodeAttributes = node.attributes;
                pathNode = SmartSVGPath.copyFilteredAttributes( pathNode, nodeAttributes, exclude );
                pathNode.setAttribute( 'd', pathString );
                pathCollection.push( node.parentNode.insertBefore( pathNode, node ) );
            }
            else {
                node.setAttribute( 'd', pathString );
            }
        }
        if ( pathNode ) {
            // remove shapeElement element nodes.
            while (svgElementCollection.length > 0) {
                svgElementCollection.item( 0 ).parentNode.removeChild( svgElementCollection.item( 0 ) );
            }
        }
        return pathCollection;
    };

    /**
     * Create an SVG node by tag name.
     *
     * @static
     * @public
     * @method  createSVGNode
     * @param   {String}        type        Node type by name.
     * @param   {SVGElement}    svgElement  Node from the existing SVG, from which to
     *                                      detect active DOM properties.
     * @returns {HTMLElement}
     */
    SmartSVGPath["createSVGNode"] = function ( type, svgElement ) {
        var svg = svgElement;
        // get parent SVGSVGElement reference.
        while (!(svg instanceof SVGSVGElement)) {
            svg = svg.parentNode
        }
        var svgNS = svg.getAttribute( 'xmlns' );

        // get parent document (HTMLHtmlElement) reference.
        var document = svg;
        while (!(document instanceof HTMLDocument)) {
            document = document.parentNode
        }
        return document.createElementNS( svgNS, type );
    };

    /**
     * Copy all attributes from an HTMLElement.attributes NamedNodeMap, which can exclude
     * specified attributes listed in the 'excluded' array.
     *
     * @static
     * @public
     * @method  copyFilteredAttributes
     * @param   {HTMLElement}       pathNode    Shape element to receive copied attributes.
     * @param   {NamedNodeMap}      attributes  NamedNodeMap to copy attributes from.
     * @param   {Array.<String>}    excluded    List of shape element unique properties NOT to copy.
     * @returns {HTMLElement}
     */
    SmartSVGPath["copyFilteredAttributes"] = function ( pathNode, attributes, excluded ) {
        for (var i = 0; i < attributes.length; i++) {
            if ( !SmartSVGPath.isExcluded( attributes[i], excluded ) ) {
                pathNode.setAttribute( attributes[i].nodeName, attributes[i].nodeValue );
            }
        }
        return pathNode;
    };

    return SmartSVGPath;

})();
(this["module"] && this["module"]["exports"] && (this["module"]["exports"] = this["SmartSVGPath"]));