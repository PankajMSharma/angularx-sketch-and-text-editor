import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';
import { EditorHeaderComponent } from './editor-header/editor-header.component';
import { EditorFooterComponent } from './editor-footer/editor-footer.component';
import { SelectService } from './services/select.service';
import { DomRendererService } from './services/dom-renderer/domrenderer.service';
import { ShapeFactory } from './models/shape-factory';
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent, EditorComponent, EditorHeaderComponent, EditorFooterComponent
      ],
      providers: [ SelectService , DomRendererService, ShapeFactory ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'AngularX Editor'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.editorTitle).toEqual('AngularX Editor');
  }));
});
