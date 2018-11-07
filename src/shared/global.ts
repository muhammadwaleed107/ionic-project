// globals.ts
import { Injectable } from '@angular/core';
import { Dictionary } from './dictionary';

@Injectable()
export class Globals {
  public mediaDictionary: Dictionary<{}>;

  constructor() {
    this.mediaDictionary = new Dictionary<{}>();
  }
}
