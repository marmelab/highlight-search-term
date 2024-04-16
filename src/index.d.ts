declare module "highlight-search-term" {
  interface HighlightSearchTermParams {
    search?: string;
    selector: string;
    customHighlightName?: string;
  }
  function highlightSearchTerm(params: HighlightSearchTermParams): void;
  export = highlightSearchTerm;
}
