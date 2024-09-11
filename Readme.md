# rainSPOTjs

![](rainSPOTstrip.png)

A Javascript library for generating meteoblue "rainSPOT" visualizations with SVG or Canvas

A "rainSPOT" is a neat visualization of localized precipitation data developped by meteoblue.com.

See: https://content.meteoblue.com/en/private-customers/website-help/7-day-weather/rainspot

---

## Have a [play with the DEMO](https://borisanthony.github.io/rainSPOTjs/) <br >or check out the [basic example](https://borisanthony.github.io/rainSPOTjs/basic.html).

---

#### NOTE
If you are not familair with the "new" ways of using Javascript in your web projects
(*i.e.: you still just pull a script in with `<script src="script.js">` and then call the function*),
you need to quickly learn about modules and importing them.

The usage examples below use that method.
It's mostly the same, just adds flexibility and tidiness.

---

## Installation

### NPM

`npm i rainspotjs`

then include either directly

```javascript
<script type='module'>
import { create_rainSPOT_SVG } from './node_modules/rainspotjs/dist/rainSPOT.svg.min.js';
import { create_rainSPOT_Canvas } from './node_modules/rainspotjs/dist/rainSPOT.canvas.min.js';
</script>
```
or however you normally do it with all those fancy tools you have. 🔧🔨🪛


### Old Fashioned 🥃

Simply clone or [download](https://github.com/BorisAnthony/rainSPOTjs/archive/refs/heads/main.zip) this repo,
or grab the archive over in [Releases](https://github.com/BorisAnthony/rainSPOTjs/releases).

---

## Usage

rainSPOT provides two versions: SVG and Canvas. You can choose the one that best fits your needs.

### SVG Version

```javascript
<script type='module'>
import { create_rainSPOT_SVG } from './rainSPOT.svg.min.js';
</script>
```

### Canvas Version (PNG)
```javascript
<script type='module'>
import { create_rainSPOT_Canvas } from './rainSPOT.canvas.min.js';
</script>
```

### Options

rainSPOTjs has some built-in default styling which reflect the original style from meteoblue. These can be customized a little bit (maybe too much) via an options object (*a.k.a. associative array, hash, etc…*).

---

## License
MIT