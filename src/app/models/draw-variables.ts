import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";


@Injectable()
export class DrawVariables {
    public elementUnderContruction: BehaviorSubject<Element> = new BehaviorSubject(null);
}