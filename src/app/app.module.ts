import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';
import { EditorHeaderComponent } from './editor-header/editor-header.component';
import { EditorFooterComponent } from './editor-footer/editor-footer.component';
import { SelectService } from './services/select.service';
import { DomRendererService } from './services/dom-renderer/domrenderer.service';
import { ShapeFactory } from './models/shape-factory';
import { ShapeConfigGenerator } from './services/shape-config-generator/shape-config-generator';
import { DrawVariables } from './models/draw-variables';
import { TooltipDirective } from './directive/tooltip-directive';


@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [
    AppComponent,
    EditorComponent,
    EditorHeaderComponent,
    EditorFooterComponent,
    TooltipDirective
  ],
  providers: [
    SelectService,
    DomRendererService,
    ShapeFactory,
    DrawVariables
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
