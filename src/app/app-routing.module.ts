import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { QuestionsComponent } from './components/questions/questions.component';
import { EditLibraryComponent } from './components/edit-library/edit-library.component';

const routes: Routes = [
  // { path: '', redirectTo: '/home', pathMatch: 'full' },  
  { 
    path: '', component: HomeComponent, 
    // children:[
    //   { path: 'welcome', component: WelcomeComponent },
    // ]
  },

  { path: 'editlibrary/:id', component: EditLibraryComponent }, 
  { path: 'questions/:id', component: QuestionsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


