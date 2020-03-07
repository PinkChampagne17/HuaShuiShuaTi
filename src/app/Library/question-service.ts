export interface Library{
    id: string;
    name: string;
    creater: string;
    date: Date;
}

export interface Question {
    id: number,
    type: QuestionType;
    title: string;
    options: Array<QuestionOption>;
    answerText: string;
}

export enum QuestionType {
    MultipleChoice,
    MultipleAnswers,
    TureOrFalse,
    FillInTheBlank
}

export interface QuestionOption {
    text: string;
    isRight: boolean;
}

export interface IQuestionsService {
    addLibrary(name: string, creater: string, callbackfn: () => void): void;
    removeLibrary(libraryId: string): void;
    getLibrary(libraryId: string): Promise<Library>;
    getAllLibraries(): Promise<Array<Library>>;
    setLibraryName(libraryId: string, name: string): void;

    addQuestion(libraryId: string, question: Question): Promise<void>;
    removeQuestion(libraryId: string, questionId: number): void;
    getAllQuestions(libraryId: string): Promise<Array<Question>>;
    setQuestion(libraryId: string, question: Question): void;

    export(libraryId: string): Promise<string>;
    import(data: any): Promise<boolean>;
}