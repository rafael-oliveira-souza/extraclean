import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { map, Observable, startWith, Subject } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { EnderecoDTO } from '../../domains/dtos/EnderecoDTO';

@Component({
  selector: 'app-auto-complete',
  standalone: true,
  imports: [
    MatAutocompleteModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    AsyncPipe,
    CommonModule
  ],
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss']
})
export class AutoCompleteComponent implements OnInit {
  @Input('label')
  public label: string = "";

  @Input('optionsValue')
  public optionsValue: string = "";

  @Input('optionsDescription')
  public optionsDescription: string = "";

  @Input('options')
  public options: any[] = [];

  @Input('value')
  public value!: any;

  @Output()
  public valueChange: EventEmitter<any> = new EventEmitter();

  @Output()
  public getOptionsSelected: EventEmitter<any[]> = new EventEmitter();

  public myControl = new FormControl<any>('');
  public filteredOptions: Observable<any[]> = new Subject();

  constructor() { }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        this.value = name;
        this.valueChange.emit(this.value);
        const valueFiltered = name ? this._filter(name as string) : this.sort(this.options.slice());
        this.getOptionsSelected.emit(valueFiltered);
        return valueFiltered;
      }),
    );
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    if (this.optionsDescription) {
      return this.sort(this.options
        .filter(option => option[this.optionsDescription].toLowerCase().includes(filterValue)));
    } else if (this.optionsValue) {
      return this.sort(this.options
        .filter(option => option[this.optionsValue].toLowerCase().includes(filterValue)));
    } else {
      return this.sort(this.options
        .filter(option => option.toLowerCase().includes(filterValue)));
    }
  }

  sort(list: any[]) {
    if (this.optionsDescription) {
      return list.sort((a, b) => {
        let nameA = a[this.optionsDescription] ? a[this.optionsDescription] : a;
        let nameB = b[this.optionsDescription] ? b[this.optionsDescription] : b;
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
    } else {
      return list.sort((a, b) => {
        let nameA = a[this.optionsValue] ? a[this.optionsValue] : a;
        let nameB = b[this.optionsValue] ? b[this.optionsValue] : b;
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
    }

    // return list;
  }

  displayFn(data: any): string {
    return data ? data : '';
  }

}
