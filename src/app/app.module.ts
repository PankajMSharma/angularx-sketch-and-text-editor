import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';
import { EditorHeaderComponent } from './editor-header/editor-header.component';
import { EditorFooterComponent } from './editor-footer/editor-footer.component';


@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [
    AppComponent,
    EditorComponent,
    EditorHeaderComponent,
    EditorFooterComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
