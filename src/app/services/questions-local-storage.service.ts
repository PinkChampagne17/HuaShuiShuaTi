import { Injectable } from '@angular/core';

import { QuestionOption, IQuestionsService, QuestionType, LibraryInfo, Question } from '../Library/question-service';

interface LsQuestionLibraryData {
  libraryInfo: LibraryInfo;
  questions: string;
}

class LsQuestions{
  id: Array<number> = [-1];
  type: Array<QuestionType> = [];
  title: Array<string> = [];
  options: Array<Array<QuestionOption>> = [];
  answerText: Array<string> = [];
}

@Injectable({
  providedIn: 'root'
})
export class QuestionsLocalStorageService implements IQuestionsService {

  private libraryListKey = "HSST_Library";

  getAllLibraries(): Array<LibraryInfo> {
    let librariesStr = localStorage.getItem(this.libraryListKey);
    return librariesStr == null ? [] : JSON.parse(librariesStr);
  }

  private librariesAction(callbackfn: (libraries: Array<LibraryInfo>) => void) : void {
    let libraries: Array<LibraryInfo> = this.getAllLibraries();
    callbackfn(libraries);
    localStorage.setItem(this.libraryListKey, JSON.stringify(libraries));
  }

  private QuestionsAction(libraryInfo: LibraryInfo, callbackfn: (lsQuestions: LsQuestions) => void) : void {
    let questionsStr = localStorage.getItem(libraryInfo.id);
    let lsqs: LsQuestions = questionsStr == null ? new LsQuestions() : JSON.parse(questionsStr);
    callbackfn(lsqs);
    localStorage.setItem(libraryInfo.id, JSON.stringify(lsqs));
  }

  addLibrary(name: string, creater: string): void {
    let datestr = new Date().toUTCString();
    let id = `HSST_${name}_${creater}_${datestr}`;

    this.librariesAction(libraries => {
      libraries.push({
        id: id,
        name: name,
        creater: creater,
        date: datestr,
      });
    });
  }

  removeLibrary(id: string): void {
    this.librariesAction(libraries => {
      let index = libraries.findIndex(lib => lib.id ==id);
      localStorage.removeItem(libraries[index].id);
      libraries.splice(index, 1);
    });
  }

  setLibraryName(libraryInfo: LibraryInfo, name: string): void {
    this.librariesAction(libraries => libraries.find(lib => lib.id == libraryInfo.id).name = name);
  }

  
  addQuestion(libraryInfo: LibraryInfo, question: Question): void {
    this.QuestionsAction(libraryInfo, lsqs => {
      let index = lsqs.id[0] == -1 ? 0 : lsqs.id.length;
      lsqs.id[index] = index == 0 ? 1 : Math.max(...lsqs.id) + 1;
      lsqs.title[index] = question.title;
      lsqs.type[index] = question.type;
      lsqs.options[index] = question.options;
      lsqs.answerText[index] = question.answerText;
    });
  }

  removeQuestion(libraryInfo: LibraryInfo, id: number): void {
    this.QuestionsAction(libraryInfo, lsqs => {
      let index = lsqs.id.indexOf(id);
      lsqs.id.splice(index, 1);
      lsqs.title.splice(index, 1);
      lsqs.type.splice(index, 1);
      lsqs.options.splice(index, 1);
      lsqs.answerText.splice(index, 1);
    });
  }

  getAllQuestions(libraryInfo: LibraryInfo): Question[] {
    let questions: Question[] = [];
    this.QuestionsAction(libraryInfo, lsqs => {
      if(lsqs.id[0] != -1) {
        for (let i = 0; i < lsqs.id.length; i++) {
          questions.push({
            id: lsqs.id[i],
            type: lsqs.type[i],
            title: lsqs.title[i],
            options: lsqs.options[i],
            answerText: lsqs.answerText[i]
          });
        }
      }
    });
    return questions;
  }

  setQuestion(libraryInfo: LibraryInfo, id: number, question: Question): void {
    this.QuestionsAction(libraryInfo, lsqs => {
        let index = lsqs.id.indexOf(id);
        lsqs.title[index] = question.title;
        lsqs.type[index] = question.type;
        lsqs.options[index] = question.options;
        lsqs.answerText[index] = question.answerText;
    });
  }

  export(libraryInfo: LibraryInfo): string {
    let data: LsQuestionLibraryData = {
      libraryInfo: libraryInfo,
      questions: localStorage.getItem(libraryInfo.id)
    }
    return JSON.stringify(data);
  }

  import(jsonString: string): boolean {
    let data: LsQuestionLibraryData = JSON.parse(jsonString);
    try {
      this.librariesAction( libraries => {
        let index = libraries.findIndex(lib => lib.id == data.libraryInfo.id)
        if(index != -1) {
          libraries[index] = data.libraryInfo;
        }
        else {
          libraries.push(data.libraryInfo);
        }
      });
      localStorage.setItem(data.libraryInfo.id, data.questions);
    } 
    catch (error) {
      return false;
    }
    return true;
  }

}
