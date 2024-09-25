import { ELASTICSEARCH_DOCUMENT } from '../constants';

export type TElasticsearchDocumentType =
  (typeof ELASTICSEARCH_DOCUMENT)[keyof typeof ELASTICSEARCH_DOCUMENT];
