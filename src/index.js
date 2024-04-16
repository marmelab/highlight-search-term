/**
 * Highlight search term in the selected elements
 *
 * @example
 * import { default as highlightSearchTerm } from "https://cdn.jsdelivr.net/npm/highlight-search-term@0.0.8/src/index.js";
 * const search = document.getElementById("search");
 * search.addEventListener("input", () => {
 *   highlightSearchTerm({ search: search.value, selector: ".content p" });
 * });
 */
const highlightSearchTerm = ({
  search,
  selector,
  customHighlightName = "search",
}) => {
  if (!selector) {
    throw new Error("The selector argument is required");
  }

  if (!CSS.highlights) return; // disable feature on Firefox as it does not support CSS Custom Highlight API

  // @ts-ignore
  CSS.highlights.delete(customHighlightName);
  if (!search) {
    // nothing to highlight
    return;
  }
  const ranges = [];
  const elements = document.querySelectorAll(selector);
  Array.from(elements).forEach((element) => {
    ranges.push(...getRangesForSearchTermInElement(element, search));
  });
  if (ranges.length === 0) return;
  const highlight = new Highlight(...ranges); // eslint-disable-line no-undef
  // create a CSS highlight that can be styled with the ::highlight(search) pseudo-element
  // @ts-ignore
  CSS.highlights.set(customHighlightName, highlight);
};

const getRangesForSearchTermInElement = (element, search) => {
  const ranges = [];
  if (!element.firstChild) return ranges;
  const text = element.textContent?.toLowerCase() || "";
  let start = 0;
  let index;
  while ((index = text.indexOf(search, start)) >= 0) {
    const range = new Range();
    range.setStart(element.firstChild, index);
    range.setEnd(element.firstChild, index + search.length);
    ranges.push(range);
    start = index + search.length;
  }
  return ranges;
};

export default highlightSearchTerm;
