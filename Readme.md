# Highlight Search Term

Highlight search term in a page. Vanilla JS, compatible with frontend frameworks (React, Vite, Angular, etc). 

Does not modify the DOM. Relies on the browser's [CSS Custom Highlight API](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Custom_Highlight_API).

## Usage

The library exports a single function that expects a search term and a CSS selector of the element to search in.

```html
<script type="module">
    import { default as highlightSearchTerm } from "https://cdn.jsdelivr.net/npm/highlight-search-term@0.0.8/src/index.js";
    const search = document.getElementById("search");
    search.addEventListener("input", () => {
      highlightSearchTerm({
        search: search.value,
        selector: ".content p"
      });
    });
</script>
```

This creates a highlight range named "search" that you can highlight with CSS, e.g.:

```css
::highlight(search) {
    background-color: yellow;
    color: black;
}
```

## License

MIT, courtesy of [Marmelab](https://marmelab.com)