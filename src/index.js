// debounce allows to delay the highlight, which allows the composition to render before the highlight
const highlightSearchTerm = (search, selector, options = {}) => {
  if (!CSS.highlights) return; // disable feature on Firefox as it does not support CSS Custom Highlight API

  const { customHighlightName = "search" } = options;
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
