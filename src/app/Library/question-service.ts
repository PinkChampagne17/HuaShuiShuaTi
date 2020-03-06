export interface Library{
    id: string;
    name: string;
    creater: string;
    date: Date;
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

export interface Question {
    id: number,
    type: QuestionType;
    title: string;
    options: Array<QuestionOption>;
    answerText: string;
}

export interface IQuestionsService {
    addLibrary(name: string, creater: string, callbackfn: () => void): void;
    removeLibrary(id: string): void;
    getLibrary(id: string): Promise<Library>;
    getAllLibraries(): Promise<Array<Library>>;
    setLibraryName(id: string, name: string): void;

    addQuestion(libraryId: string, question: Question, callbackfn: () => void): void;
    removeQuestion(libraryId: string, questionId: number): void;
    getAllQuestions(libraryId: string): Promise<Array<Question>>;
    setQuestion(libraryId: string, question: Question): void;

    export(lib: Library): Promise<string>;
    import(data: any): boolean;
}