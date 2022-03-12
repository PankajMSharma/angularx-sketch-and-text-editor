import { Subscription } from "rxjs";

export interface DrawMouseSubscriptions {
    mouseMoveSubscription: Subscription;
    mouseUpSubscription: Subscription;
}