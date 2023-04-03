import {
    Directive,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    Output,
  } from '@angular/core';
import { ContactComponent } from './contact.component';
  
  @Directive({
    selector: '[appDragDropSwap]',
  })
  export class ContactDirective {
    constructor(public contact: ContactComponent) {}
  
    @HostBinding('attr.draggable') draggable = true;
    @Input('elemPosition') elemPosition: number;
    @Input('list') list: any;
    @Output('returnUpdatedList') returnUpdatedList = new EventEmitter<any>();
  
    @HostListener('dragstart', ['$event'])
    onDragStart(e: any) {
      e.dataTransfer.setData('object', this.elemPosition);
    }
  
    @HostListener('drop', ['$event'])
    onDrop(e: any) {
      e.preventDefault();
      this.contact.sourceElementIndex = e.dataTransfer.getData('object');
      this.contact.destElementIndex = this.elemPosition;
      let clonedList = [...this.list];
      if (this.contact.sourceElementIndex !== this.contact.destElementIndex) {
        clonedList.splice(this.contact.destElementIndex, 1, this.list[this.contact.sourceElementIndex])
        clonedList.splice(this.contact.sourceElementIndex, 1, this.list[this.contact.destElementIndex])
        this.returnUpdatedList.emit(clonedList);
      }
    }
  
    @HostListener('dragover', ['$event'])
    onDragOver(e: any) {
      e.preventDefault();
    }
  }
  