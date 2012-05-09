---
layout : default
---

Load any script/s inline and asynchronously then run the dependant code.

## Why?

*   Scripts Block (this is slow)
*   Scripts have dependencies on other scripts, so one script needs to load before the other (this is slow)
*   Javascript should be able to be fetched in parallel and not slow down page load (this is slow)
*   Coupling JS with HTML can be difficult to manage (data attribute soup), and shouldn't always be apart of the meta data
*   Sometimes you can't put all your scripts in the footer
*   It's hard to know what javascript is being included on the page, sometimes you don't have that control.
*   Some javascript can be inadvertently loaded multiple times on the page

### Example

{% highlight html %}
<!-- html code -->
<div class="im-a-div" data-needy="fill-me-with-content"></div>
<script src="big-ego.js"></script>
<script src="needy.js"></script>
<p></p>
{% endhighlight %}
    
This above would put a big pause button on your page load, as it would need to fetch `big-ego.js` and parse it, once that is done, it does the same for `needy.js`, once that is done, it can continue parsing the page.

This is because the browser needs to 'compile' javascript in-place in case there is a `document.write`. So to fix that, W3C introduced a new attribute, `async`, which will load your script in the background, then parse it once it's loaded (keep in mind that parsing will block rendering or parsing of anything else).

The problem with `async` is that it can f*** up your dependencies. One script may need to make sure another one is on the page first, because it's a needy little so and so, and you may not be able to `async` all your scripts.

Also, `async` is not fully supported... anyone surprised?

## So...

What if you could do something, that would magically fetch the scripts you need, and run your dependant code once it's done?

***Cue hero music***

### prescript.js to the rescue

*   The browser fetches `prescript.js` from a speedy CDN
*   The browser parses the contents of `prescript.js`
*   `prescript.js` reads the config object that is embedded within the `<script>` element
*   `prescript.js` will then asynchronously `load` any javascript file/s you need
*   After they're loaded it will `run` the supplied function

#### Winning

*   `prescript.js` is only fetched by the browser once, it is then cached for every other use on the page (and any other page)
*   `prescript.js` is is tiny, so fetching and parsing it is pretty painless
*   `prescript.js` will only `run` your function once all the dependencies are loaded
*   `prescript.js` will only `load` each script once, regardless how many instances of `prescript.js` need to `load` it

Which means you can happy load your non blocking javascript quickly without needing to have complete knowledge of what javascript is currently on the page, and have faith that your code will run with all it's dependencies on the page

## Usage

### Load individual files sequentially (FAST) 

Useful if you're scripts need to be loaded in order (as they have dependencies on each other).

{% highlight html %}
<script src="prescript.js">
    {
        "load" : ["file.js", "another"],
        "sequential" : 1,
        "root" : "http://my.domain.com/js/", // optional
        "run" : function () {
            console.warn("loaded 2 files one after the other");
        }
    }
</script>
{% endhighlight %}

### Load individual files in parallel (FASTER)

Will load all your requirements in parallel, which is as fast as the browser will allow. Only works if the scripts you're loading are not dependant on each other.

{% highlight html %}
<script src="prescript.js">
    {
        "load" : ["file.js", "another"],
        "root" : "http://my.domain.com/js/", //optional
        "run" : function () {
            console.warn("loaded 2 file in parallel");
        }
    }
</script>
{% endhighlight %}

### Load combined files (FASTEREST)

The fastest way to load multiple files is to use a combination loader (if you have access to one). This will load all your files, in one request.

{% highlight html %}
<script src="prescript.js">
    {
        "load" : ["file.js", "another"],
        "combo" : "http://my.domain.com/js/",
        "run" : function () {
            console.warn("loaded 2 files with one request");
        }
    }
</script>
{% endhighlight %}