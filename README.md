prescript.js
============

Fixing up inline scripts and dependency.

Load any script/s inline and asynchronously then run the dependant code.

## Why?

*   Scripts Block (this is slow)
*   Scripts have dependencies on other scripts, so one script needs to load before the other (this is slow)
*   Javascript should be able to run in parallel and not slow down page load
*   Sometimes you can't put all your scripts in the footer
*   Coupling JS with code can be difficult to manage (data attribute soup)

### Example

    <!-- html code -->
    <div class="im-a-div" data-needy="fill-me-with-content"></div>
    <script src="big-ego.js"></script>
    <script src="needy.js"></script>
    <p></p>
    
This above would destroy your page load, as it would need to fetch `big-ego.js` and parse it, then once that is done, it does the same for `needy.js`, once that is done, it can continue parsing the page.

This is because the parser needs to compile in-place in case there is a `document.write`. So to fix that, they introduced a new attribute `async` which will load your script in the background, then parse it once it's loaded (keep in mind that parsing will block rendering or parsing of anything else).

The problem with `async` is that it fucks up your dependencies. One script may need to make sure another one is on the page first, because it's a needy little so and so, and you may not be able to `async` all your scripts.

Also, async is not fully supported... anyone surprised?

## So...

What if you could do something, that would magically fetch the scripts you need, and run your dependant code once it's done?

*** Cue hero music ***

That is where `prescript.js` comes in.

It will require the page to load `prescript.js`, but it only does this once (and the file is tiny), it is the cached for the next time you use it. After that it parses the config file in the script and will `load` any javascript file you need (this is also only done once per file), after all the files you need are loaded it will `run` the function.

## Usage

### Load individual files sequentially (FAST) 

Useful if you're scripts need to be loaded in order (as they have dependencies on each other), but slow.

    <script src="prescript.js">
        {
            "load" : ["file.js", "another"],
            "sequential" : 1,                    // by default this is false
            "root" : "http://my.domain.com/js/", // optional
            "run" : function () {
                console.warn("loaded 2");
            }
        }
    </script>

### Load individual files in parallel (FASTER)

The fastest way to load individual files. Only works if the scripts you're loading are not dependant on each other.

    <script src="prescript.js">
        {
            "load" : ["file.js", "another"],
            "root" : "http://my.domain.com/js/", //optional
            "run" : function () {
                console.warn("loaded 2");
            }
        }
    </script>


### Load combined files (FASTEREST)

The fastest way to load multiple files is to use a combination loader (if you have access to one). This will load all your files, in one request.

    <script src="prescript.js">
        {
            "load" : ["file.js", "another"],
            "combo" : "http://my.domain.com/js/",
            "run" : function () {
                console.warn("loaded 2");
            }
        }
    </script>