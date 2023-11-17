import { unstable_noStore as noStore } from 'next/cache';

// import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';
import Typesense from 'typesense';

const apikey = `${process.env.NEXT_PUBLIC_TYPESENSE_API_KEY}`;

let searchClient: any;

function NewTypesenseInstantSearchClient() {
  noStore();
  const client = new Typesense.Client({
    nodes: [
      {
        host: `${process.env.TYPESENSE_URL}`,
        port: parseInt(process.env.TYPESENSE_PORT as string) || 8108,
        protocol: process.env.TYPESENSE_PROTOCOL || 'http',
      },
    ],
    apiKey: apikey,
    numRetries: 3, // A total of 4 tries (1 original try + 3 retries)
    connectionTimeoutSeconds: 10,
    // logLevel: 'debug',
  });
  return client;
}

export function getSearchClient() {
  if (!searchClient) {
    searchClient = NewTypesenseInstantSearchClient();
  }
  return searchClient;
}

interface TypesenseSearchHitHighlight {
  matched_tokens: string[];
  snippet: string;
}

interface TypesenseSearchHitHighlights {
  field: string;
  matched_tokens: string[];
  snippet: string;
}

export interface TypesenseSearchHit {
  document: {
    id: string;
    author: string;
    name: string;
    imageURL: string;
    ingredients: string[];
  };
  highlight: {
    author: TypesenseSearchHitHighlight[];
    ingredients: TypesenseSearchHitHighlight[];
    name: TypesenseSearchHitHighlight[];
  };
  highlights: TypesenseSearchHitHighlights[];
  text_match: number;
  text_match_info: {
    best_field_score: number;
    best_field_weight: number;
    fields_matched: number;
    score: number;
    tokens_matched: number;
  };
}

export interface TypesenseSearchResult {
  facet_counts: [];
  found: number;
  hits: TypesenseSearchHit[];
  out_of: number;
  page: number;
  request_params: {
    collection_name: string;
    per_page: number;
    q: string;
  };
  search_cutoff: boolean;
  search_time_ms: number;
}
