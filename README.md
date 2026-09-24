# MarkdJS
**MarkdJS** is a lightweight & easy-to-use `markdown` to `html` rendering `javascript` library with XSS protection.

## Set Up
Setting up the library is pretty simple, just drag the files in the repository in the same directory in your project, import `main.js` in your `html` document & execute `rendMD();`

```html
<script type="module">
  import rendMD from 'main.js';

  let stringVar = "lorem ipsum dolor sit amet...";

  let renderedText = rendMD(stringVar);
</script>
```

`rendMD();` renders your `markdown` to `html` meaning you can make it reactive by just declaring it as a parameter & access your rendered text by just calling the variable holding `rendMD();`
