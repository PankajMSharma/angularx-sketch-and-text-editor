import { Component } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'ng-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public editorTitle = 'AngularX Editor';
  public selectedTool = new ReplaySubject<string>(1);

  public updateSelectedTool(tool: string) {
    this.selectedTool.next(tool);
  }
}
