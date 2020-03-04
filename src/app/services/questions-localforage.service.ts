import { Injectable } from '@angular/core';
import { IQuestionsService, LibraryInfo, Question } from '../Library/question-service';

import * as localforage from 'src/assets/js/localforage.min.js';

@Injectable({
  providedIn: 'root'
})
export class QuestionsLocalforageService implements IQuestionsService {

  private librariesInfoRepository: any;

  constructor() {
    this.librariesInfoRepository = localforage.createInstance({
      name: "HSST_librariesInfo"
    });
  }

  private questionsAction(lib: LibraryInfo, callbackfn: (databaseInstance) => void) {
    let instance = localforage.createInstance({
      name: lib.id
    });
    callbackfn(instance);
  }

  public addLibrary(name: string, creater: string): void {
    let dateStr = new Date().toUTCString();

    let libraryInfo: LibraryInfo = {
      id: `HSST_${creater}_${name}_${dateStr}`,
      name: name,
      creater: creater,
      date: dateStr
    };

    this.librariesInfoRepository.setItem(libraryInfo.id, libraryInfo);
  }

  public removeLibrary(id: string): void {
    this.librariesInfoRepository.removeItem(id);
  }

  async getAllLibraries(): Promise<LibraryInfo[]> {
    let libraries: LibraryInfo[] = [];

    await this.librariesInfoRepository.keys().then((keys) => {
      keys.forEach(key => {
        this.librariesInfoRepository.getItem(key).then(lib => {
          lib.date = new Date(lib.date);
          libraries.push(lib);
        });
      });
    });

    return libraries;
  }

  public setLibraryName(libraryInfo: LibraryInfo, name: string): void {
    libraryInfo.name = name;
    this.librariesInfoRepository.setItem(libraryInfo.id, libraryInfo);
  }

  public addQuestion(libraryInfo: LibraryInfo, question: Question): void {
    this.questionsAction(libraryInfo, (questions) => {
        questions.length().then(length => {
        question.id = length;
        questions.setItem(length.toString(), question);
      });
    });
  }
  
  public removeQuestion(libraryInfo: LibraryInfo, questionId: number): void {
    this.questionsAction(libraryInfo, (questions) => {
      questions.removeItem(questionId.toString());
    });
  }

  public async getAllQuestions(libraryInfo: LibraryInfo): Promise<Question[]> {
    let result: Question[];
    await this.questionsAction(libraryInfo, (questions) => {
      questions.iterate((value, key, iterationNumber) => {
        result = value;
      });
    });
    return result;
  }

  public setQuestion(libraryInfo: LibraryInfo, id: number, question: Question): void {
    this.questionsAction(libraryInfo, (questions) => {
      questions.setItem(id.toString(), question);
    });
  }

  public async export(libraryInfo: LibraryInfo): Promise<string> {
    let questions: Question[];
    await this.getAllQuestions(libraryInfo).then(result => {
      questions = result;
    });
    return JSON.stringify({
      lib: libraryInfo,
      questions: questions
    });
  }

  public import(data: any): boolean {
    try {
      this.librariesInfoRepository.setItem(data.lib.id, data.lib);
      this.questionsAction(data.lib, questions => {
        data.questions.forEach(quesiton => {
          this.addQuestion(data.lib, quesiton);
        });
      })
    }
    catch(error) {
      return false;
    }
    return true;
  }

  
}
