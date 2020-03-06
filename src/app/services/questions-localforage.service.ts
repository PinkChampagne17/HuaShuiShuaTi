import { Injectable } from '@angular/core';
import { IQuestionsService, Library, Question } from '../Library/question-service';

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
  
  private getQuestionsRepository(id: string): any {
    return localforage.createInstance({ name: id });
  }

  public async getLibrary(id: string): Promise<Library> {
    let libs = await this.getAllLibraries();
    let lib = libs.find(lib => lib.id == id);
    return lib;
  }

  public addLibrary(name: string, creater: string, callbackfn: () => void): void {
    let dateStr = new Date().toUTCString();
    let lib = {
      id: `HSST_${creater}_${name}_${dateStr}`,
      name: name,
      creater: creater,
      date: dateStr
    };

    this.librariesInfoRepository.setItem(lib.id, lib).then(callbackfn);
  }

  public removeLibrary(id: string): void {
    this.librariesInfoRepository.removeItem(id);
  }

  async getAllLibraries(): Promise<Library[]> {
    let libs: Library[] = [];
    await this.librariesInfoRepository.iterate((value, key, iterationNumber) => {
        libs.unshift({
          id: value.id,
          name: value.name,
          creater: value.creater,
          date: new Date(value.date)
        });
    });
    return libs;
  }

  public setLibraryName(id: string, name: string): void {
    this.librariesInfoRepository.getItem(id).then(lib => {
      lib.name = name;
      this.librariesInfoRepository.setItem(id, lib);
    });
  }

  public async addQuestion(libraryId: string, question: Question, callbackfn: () => void): Promise<void> {
    let repository = this.getQuestionsRepository(libraryId);
    let keys = await repository.keys();
    question.id = keys.length == 0 ? 0 : Number.parseInt(keys.pop()) + 1;
    repository.setItem(question.id, question).then(callbackfn);
  }
  
  public removeQuestion(libraryId: string, questionId: number): void {
    let repository = this.getQuestionsRepository(libraryId);
    repository.removeItem(questionId);
  }

  public async getAllQuestions(id: string, isRandom: boolean = false): Promise<Question[]> {
    let questions: Question[] = [];

    let repository = this.getQuestionsRepository(id);
    
    await repository.iterate((value, key, iterationNumber) => {
      questions.push(value);
    });

    return questions;
  }

  public setQuestion(libraryId: string, question: Question): void {
    this.getQuestionsRepository(libraryId).setItem(question.id, question);
  }

  public async export(lib: Library): Promise<string> {
    return JSON.stringify({
      lib: lib,
      questions: await this.getAllQuestions(lib.id)
    });
  }

  public import(data: any): boolean {
    // try {
    //   this.librariesInfoRepository.setItem(data.lib.id, data.lib);
    //   this.getQuestionsRepository(data.lib, questionsRepository => {
    //     data.questions.forEach(quesiton => {
    //       this.addQuestion(data.lib, quesiton, () => {});
    //     });
    //   });
    // }
    // catch(error) {
    //   return false;
    // }
    return true;
  }

  
}
