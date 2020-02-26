export interface LibraryInfo{
    id: string;
    name: string;
    creater: string;
    date: string;
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
    addLibrary(name: string, creater: string): void;
    removeLibrary(id: string): void;
    getAllLibraries(): Array<LibraryInfo>;
    setLibraryName(libraryInfo: LibraryInfo, name: string): void;

    addQuestion(libraryInfo: LibraryInfo, question: Question): void;
    removeQuestion(libraryInfo: LibraryInfo, questionId: number): void;
    getAllQuestions(libraryInfo: LibraryInfo): Array<Question>;
    setQuestion(libraryInfo: LibraryInfo, id: number, question:Question): void;

    export(libraryInfo: LibraryInfo): any;
    import(data: any): boolean;
}