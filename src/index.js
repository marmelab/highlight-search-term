/**
 * Highlight search term in the selected elements
 *
 * @example
 * import { highlightSearchTerm } from "highlight-search-term";
 * const search = document.getElementById("search");
 * search.addEventListener("input", () => {
 *   highlightSearchTerm({ search: search.value, selector: ".content" });
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

  // remove previous highlight
  CSS.highlights.delete(customHighlightName);
  if (!search) {
    // nothing to highlight
    return;
  }
  // find all text nodes containing the search term
  const ranges = [];
  try {
    const elements = document.querySelectorAll(selector);
    Array.from(elements).map((element) => {
      getTextNodesInElementContainingText(element, search).forEach((node) => {
        ranges.push(
          ...getRangesForSearchTermInElement(node.parentElement, search)
        );
      });
    });
  } catch (error) {
    // When combining static text with dynamic text in React, the textContent property may be different from the wholeText property.
    // wholeText will contains both static and dynamic text, while textContent will only contain the static text.
    // The Range object in chromium browsers seems to be using the textContent and it could throw
    // an error when we did detect the search term.
    console.error(error);
  }
  if (ranges.length === 0) return;
  // create a CSS highlight that can be styled with the ::highlight(search) pseudo-element
  const highlight = new Highlight(...ranges);
  CSS.highlights.set(customHighlightName, highlight);
};

const getTextNodesInElementContainingText = (element, text) => {
  const lowerCaseText = text.toLowerCase();
  const nodes = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (node.textContent?.toLowerCase().includes(lowerCaseText)) {
      nodes.push(node);
    }
  }
  return nodes;
};

const getRangesForSearchTermInElement = (element, search) => {
  const ranges = [];
  const lowerCaseSearch = search.toLowerCase();
  if (element.childNodes.length === 0) return ranges;
  // In some frameworks like React, when combining static text with dynamic text, the element may have multiple Text child nodes.
  // To avoid errors, we must find the child node that actually contains the search term.
  const childWithSearchTerm = Array.from(element.childNodes).find((node) =>
    node.textContent?.toLowerCase().includes(lowerCaseSearch)
  );
  if (!childWithSearchTerm) return ranges;
  const text = childWithSearchTerm.textContent?.toLowerCase() || "";
  let start = 0;
  let index;
  while ((index = text.indexOf(lowerCaseSearch, start)) >= 0) {
    const range = new Range();
    range.setStart(childWithSearchTerm, index);
    range.setEnd(childWithSearchTerm, index + search.length);
    ranges.push(range);
    start = index + search.length;
  }
  return ranges;
};

export { highlightSearchTerm };
