import { Component } from '@angular/core';

@Component({
  selector: 'ng-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public editorTitle = 'AngularX Editor';
  public selectedTool;

  public updateSelectedTool(tool: string) {
    this.selectedTool = tool;
  }
}
