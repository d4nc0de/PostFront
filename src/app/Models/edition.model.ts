import { Book } from "./book.model";

export interface Edition {
    isbn: number;
    year: string;
    lang: string;
    libro: Book;
}