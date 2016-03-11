
# smart-svg-path

#### SmartSVGPath.js smarter easier SVG path management methods.
#### For total mastery of SVG path data, make fine tuning advanced SVG path animations easier. 

#### Can't find how to:
##### - Reverse an SVG path.
##### - Set any path vertex as the paths first vertex.
#### ...I couldn't either!
##### - Automatically Convert all SVG elements (individually or by collection) to paths, keeping all other attributes.
##### - Automatically Convert geometric arcTo commands to cubic Bezier curveTo commands.
##### - and more...

We don't always control the SVG output from Illustrator, Inkscape  etc... even when we do,
paths can still come out in an undesired order or direction for animation. Manipulating targeted
problem path data is probably a lot quicker, (now easier) and smarter than having the artist/designer
have to redo work they have already completed just in a different order.

SmartSVGPath came about because I could not find a library that knew how to reverse an SVG path!!

So reversing SVG path data, and arbitrarily changing which vertex is the starting vertex on a path
are at least two features of this light weight library which you will have trouble finding
elsewhere. Well, at least prior to my release of this library, I looked pretty hard because I had no
idea how to do it.

### How to use:
This library is designed to be Node.js and Browser compatible, just drop it where-ever you want it
and access it via the SmartSVGPath name space (or your own alias).

Don't instantiate SmartSVGPath, its a static 'class', just use it.

The source code is fully self documenting and commented for education and enlightenment.
The source code is also fully YUIdoc-umented, you can generate YUIDocs locally if I have not yet posted the documentation online.
(I have more pressing matters currently, but a GruntFile with the usual tasks and documentation are on the TODO list.)
Or simply read the source:

#### 'd' String Methods: 
Work directly on the SVGElement attribute 'd' data string. Independant so you can build your own tools incorporating them.
Otherwise SmartSVGPath does provide some basic tools...

####SVGElement Methods: 
Work directly on both individual and collections of DOM SVGElements automatically:
     - Converting there <shape> data and attributes to 'd' attribute data string.
     - Rewriting an existing 'd' attribute data string

Why the strange SmartSVGPath['method'] string naming for method declarations?
Smarter google Closure compatibility. This convention produces optimised output that does not
depend on, or add additional Closure library bloat to your source code, JUST to access method
name 'symbols'. Closure compiler renames properties in Advanced mode, but it never renames
strings.

Note the method SmartSVGPath['method'] naming convention is only for the public API methods.
So Closure can still aggressively optimise away on the private stuff.
