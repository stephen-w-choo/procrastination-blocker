
export interface TextData {
    text: TextSequence;
    class: TextClass;
}// eg procrastination or productive

export type TextClass = string;
// single lower case word token - keeping it simple

export type Token = string;
// the original text

export type TextSequence = string;

