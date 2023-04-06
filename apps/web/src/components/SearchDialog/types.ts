export interface Hit {
  // typesense
  objectID: string;
  text_match: number;
  // text_match_info: any;
  _highlightResult: {
    author: {
      value: string;
      matchLevel: string;
      matchedWords: string[];
    };
    ingredients: [
      {
        value: string;
        matchLevel: string;
        matchedWords: string[];
      }
    ];
    name: {
      value: string;
      matchLevel: string;
      matchedWords: string[];
    };
  };
  // 4ks
  id: string;
  author: string;
  name: string;
  imageUrl: string;
  ingredients: string[];
}
