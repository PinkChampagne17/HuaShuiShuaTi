import { Injectable } from '@angular/core';
import { IQuestionsService, Library, Question } from '../lib/question-service';

import * as localforage from 'src/assets/js/localforage.min.js';

interface LfLibrary {
  id: string;
  name: string;
  creater: string;
  date: string;
}

interface LfLibraryAndQuestions {
  library: LfLibrary;
  questions: Array<Question>;
}

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

  // async ngOnInit(): Promise<void> {
  //   let lengths = [];
  //   await this.librariesInfoRepository.iterate((value, key, iterationNumber) => {
  //     let repository = this.getLibrary(value.id)
  //   });
  // }
  
  private getQuestionsRepository(id: string): any {
    return localforage.createInstance({ name: id });
  }

  public async getLibrary(id: string): Promise<Library> {
    return await this.librariesInfoRepository.getItem(id);
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

  public async removeLibrary(id: string): Promise<void> {
    this.librariesInfoRepository.removeItem(id);
    await this.getQuestionsRepository(id).dropInstance({ name: id });
  }

  private lengths: object = {};
  async getAllLibraries(): Promise<Array<Library>> {
    let libs: Array<Library> = [];

    await this.librariesInfoRepository.iterate((value, key, iterationNumber) => {
        libs.unshift({
          id: value.id,
          name: value.name,
          creater: value.creater,
          date: new Date(value.date)
        });
        this.getQuestionsRepository(value.id).length().then(length => {
          this.lengths[value.id] = length;
        });
    });
    libs.sort((x, y) => x.date < y.date ? 1 : -1);
    return libs;
  }

  public setLibraryName(id: string, name: string): void {
    this.librariesInfoRepository.getItem(id).then(lib => {
      lib.name = name;
      this.librariesInfoRepository.setItem(id, lib);
    });
  }

  public async addQuestion(libraryId: string, question: Question): Promise<void> {
    let repository = this.getQuestionsRepository(libraryId);

    let keys = await repository.keys();

    question.id = keys.length == 0 ? 0 : Number.parseInt(keys.pop()) + 1;
    
    return repository.setItem(question.id, question);
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

  public async export(libraryId: string): Promise<string> {
    let ex: LfLibraryAndQuestions = {
      library: await this.librariesInfoRepository.getItem(libraryId),
      questions: await this.getAllQuestions(libraryId)
    };

    return JSON.stringify(ex);
  }

  public async import(data: string): Promise<boolean> {
    if (!data) {
      return false;
    }

    try {
      let im: LfLibraryAndQuestions = JSON.parse(data);
      let lib = im.library;
      let questions = im.questions;

      let questionRespository = await this.getQuestionsRepository(lib.id);
      this.librariesInfoRepository.setItem(lib.id, lib);

      questions.forEach(question => {
        questionRespository.setItem(question.id, question);
      });
    }
    catch(error) {
      return false;
    }
    return true;
  }

  public getLibraryLength(libraryId: string): number {
    return this.lengths[libraryId];
  }

}
