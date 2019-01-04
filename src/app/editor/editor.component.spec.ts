import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorComponent } from './editor.component';
import { EditorHeaderComponent } from '../editor-header/editor-header.component';
import { EditorFooterComponent } from '../editor-footer/editor-footer.component';
import { BrowserModule } from '@angular/platform-browser';
import { ShapeFactory } from '../models/shape-factory';
import { DomRendererService } from '../services/dom-renderer/domrenderer.service';
import { SelectService } from '../services/select.service';
import { TOOLNAMES } from '../constants/namespace';
import { ReplaySubject } from 'rxjs';

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ BrowserModule ],
      declarations: [ EditorComponent, EditorHeaderComponent, EditorFooterComponent ],
      providers: [
        SelectService,
        DomRendererService,
        ShapeFactory
      ],
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(EditorComponent);
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    component.selectedTool = new ReplaySubject<string>();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
