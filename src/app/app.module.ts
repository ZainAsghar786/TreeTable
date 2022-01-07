import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ContextMenuModule } from '@syncfusion/ej2-angular-navigations';
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
  imports: [BrowserModule, TreeGridModule, ContextMenuModule],
  providers: [
    PageService,
    FilterService,
    EditService,
    ToolbarService,
    SortService,
    ResizeService,
    ExcelExportService,
    PdfExportService,
    ContextMenuService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
