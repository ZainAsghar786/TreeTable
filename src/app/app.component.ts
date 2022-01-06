import { Component } from '@angular/core';
import { sampleData } from './datasource';
import { ToolbarItems } from '@syncfusion/ej2-angular-treegrid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public data: Object[] = [];
  public pager: Object = {};
  public editSettings: Object = {};
  public contextMenuItems: Object[] = [];
  ngOnInit(): void {
    this.editSettings = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: 'Row',
    };
    this.contextMenuItems = [
      'AutoFit',
      'AutoFitAll',
      'SortAscending',
      'SortDescending',
      'Edit',
      'Delete',
      'Save',
      'Cancel',
      'PdfExport',
      'ExcelExport',
      'CsvExport',
      'FirstPage',
      'PrevPage',
      'LastPage',
      'NextPage',
    ];

    this.pager = { pageSize: 8 };
    this.data = sampleData;
    console.log(this.data);
  }
}
