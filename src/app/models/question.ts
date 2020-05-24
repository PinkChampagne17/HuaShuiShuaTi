import { QuestionOption } from './question-option';
import { QuestionType } from './question-type';

export interface Question {
    id: number,
    type: QuestionType;
    title: string;
    options: Array<QuestionOption>;
    answerText: string;
}
