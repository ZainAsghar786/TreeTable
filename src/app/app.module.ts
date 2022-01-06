import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { TreeGridModule } from '@syncfusion/ej2-angular-treegrid';
import {
  PageService,
  FilterService,
  EditService,
  ToolbarService,
} from '@syncfusion/ej2-angular-treegrid';
import {
  SortService,
  ResizeService,
  ExcelExportService,
  PdfExportService,
  ContextMenuService,
} from '@syncfusion/ej2-angular-treegrid';
import { AppComponent } from './app.component';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, TreeGridModule, ButtonModule, DropDownListAllModule],
  providers: [
    PageService,
    SortService,
    FilterService,
    EditService,
    SortService,
    ResizeService,
    ExcelExportService,
    PdfExportService,
    ContextMenuService,
    ToolbarService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
