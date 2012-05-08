/**

    # prescript.js
    
    Load any script asynchronously then run the dependant js

    ## Usage
    
    ### Load indevidual files squentially 
    
    Useful if you're scripts need to be loaded in order
    
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
*/


(function (window, document, undefined) {
    "use strict";
    
    var DELAY = 25, //milliseconds of delay when loading scripts
        instance = window._prescript_ || (window._prescript_ = {}),
        placeholder = document.getElementsByTagName("head")[0],
        scriptTags = document.getElementsByTagName("script"),
        thisScript = scriptTags[scriptTags.length - 1],
        content = thisScript.text;

    // 
    //  addScript
    //  Adds a <script> tag to the placeholder and fires a callback once loaded
    //  
    //  @param  src  <String>    A fully qualified or relational path to a js file
    //  @param  cb   <Function>  The callback to file once the script has loaded
    // 
    function addScript(src, cb) {
        var pre = instance[src],
            s = (pre) ? pre.script 
                      : document.createElement("script"),
            
            loaded = function () {
                //set the global instance to recognise that this file is loaded
                pre.loaded = 1;
                //remove the script file if it's still on the dom
                if (s.parendNode) {
                    s.parentNode.removeChild(s);
                    s = null; // garbage collect that shiz - this one could be problematic
                }
                //fire the callback
                cb();
            };
        
        if (!pre || !pre.loaded) {
            //add an event listener to the script tag if it's not already loaded
            if (s.addEventListener) {
                s.addEventListener("load", loaded);
            } else {
                s.attachEvent("onreadystatechange", function () {
                    if (s.readyState == 'loaded') loaded();
                });
            }
            //set the src if a pre existing instance of this script tag doesn't exits
            if (!pre) {
                pre = instance[src] = { script : s };
                placeholder.appendChild(s);
                s.src = src;
            }
        } else {
            //file is already loaded, fire the callback
            cb();
        }
    }
    
    // 
    //  loadOne
    //  Fires the addScript function at a delay
    //  
    //  @param  script  <String>    A fully qualified or relational path to a js file
    //  @param  cb      <Function>  The callback to file once the script has loaded
    //
    function loadOne(script, cb) {
        setTimeout(function () {
            addScript(script, cb);
        }, DELAY);
    }
    
    // 
    //  complete
    //  Fires the "run" function from the config (if it's a function)
    //  
    //  @param  run  <Function>  The function to run once everything has loaded
    //  
    function complete(run) {
        if (typeof run === "function") run();
    }
    
    // 
    //  parse
    //  Uses the config object to load the scripts (The controller)
    //  
    //  @param  obj             <Object>    An object with properties
    //          obj.load        <Array>     File paths that need to be loaded
    //          obj.run         <Function>  Function that should be called after scripts loaded
    //          obj.root        <String>    The common root path for the paths
    //          obj.combo       <String>    The combo root
    //          obj.sequential  <Boolean>   If the files should be loaded sequentially (default:false)
    //
    function parse(obj) {
        var i, il,
            scriptsLoaded = 0, 
            load = obj.load || [],
            run = obj.run || 0,
            root = obj.root || "";

        if (load.length) {
            //if you have a combo loader you can combine them all into one request
            if (obj.combo) {
                load = [obj.combo + load.join("&")];
            }   
            //load in parallel      
            if (!obj.sequential) {
                for (i = 0, il = load.length; i < il; i += 1) {
                    loadOne(root + load[i], function() {
                        scriptsLoaded += 1;
                        if (scriptsLoaded >= il) complete(run);
                    });
                }
            //load in sequence
            } else {
                (function reccur () {
                    loadOne(root + load[scriptsLoaded], function () {
                        scriptsLoaded += 1;
                        if (load[scriptsLoaded]) {
                            reccur();
                        } else {
                            complete(run);
                        }
                    });
                })();
            }
        } else {
            //call function straight away if we don't have to load any scripts
            complete(run); 
        }
    }
    
    //remove the script
    thisScript.parentNode.removeChild(thisScript);
    thisScript = null; // garbage collect that shiz
    
    //yeah i'm aware how shit using eval is
    try {
        parse(eval("(" + content +")"));
    } catch (ex) {
        console.error(ex);
    }
    
})(window, document);