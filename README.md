prescript.js
============

Fixing up inline scripts and dependency. Load any script asynchronously then run the dependant js

## Usage

### Load indevidual files in parallel

The fastest way to load indevidual files. Only works if the scripts you're 
loading are mutually exclusive.

    <script src="prescript.js">
        {
            "load" : ["file.js", "another"],
            "root" : "http://my.domain.com/js/",
            "run" : function () {
                console.warn("loaded 2");
            }
        }
    </script>


### Load indevidual files squentially 

Useful if you're scripts need to be loaded in order (as they have depenencies on each other), but slow.

    <script src="prescript.js">
        {
            "load" : ["file.js", "another"],
            "sequential" : 1,
            "root" : "http://my.domain.com/js/",
            "run" : function () {
                console.warn("loaded 2");
            }
        }
    </script>


### Load combined files

The fastest way to load multiple files at once.

    <script src="prescript.js">
        {
            "load" : ["file.js", "another"],
            "combo" : "http://my.domain.com/js/",
            "run" : function () {
                console.warn("loaded 2");
            }
        }
    </script>