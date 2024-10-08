export interface BooksContextData {
  library: Book[];
  updateBookStatus: (
    id: string,
    updateOptions: { lastReadPageIndex: number }
  ) => void;
  finishBook: (id: string) => void;
  startBook: (id: string) => void;
}

export interface Book {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  pages: Page[];
  finished: boolean;
  finishedAt?: string;
  lastReadPageIndex?: number;
  lastReadAt?: string;
  purchaseLink?: string;
}

export enum ContentType {
  PARAGRAPH = 'PARAGRAPH',
  KEY_POINT = 'KEY_POINT',
}

export interface Paragraph {
  type: ContentType.PARAGRAPH;
  text: string;
}

export type PageContent = Paragraph;

export interface Page {
  title: string;
  content: PageContent[];
}
