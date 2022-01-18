import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContextMenuModule } from '@syncfusion/ej2-angular-navigations';
import { TreeGridModule } from '@syncfusion/ej2-angular-treegrid';
import {
  PageService,
  ColumnChooserService,
  FilterService,
  EditService,
  ToolbarService,
  FreezeService,
} from '@syncfusion/ej2-angular-treegrid';
import {
  SortService,
  ResizeService,
  ExcelExportService,
  PdfExportService,
  ContextMenuService,
} from '@syncfusion/ej2-angular-treegrid';
// import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { AppComponent } from './app.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { HttpRequestService } from './services/http-request.service';
import { MasterDataService } from './services/master-data.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    TreeGridModule,
    ContextMenuModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    ToastModule,
    ConfirmDialogModule,
    InputSwitchModule,
    CheckboxModule,
    DropDownListAllModule,
  ],
  providers: [
    HttpRequestService,
    MasterDataService,
    PageService,
    FilterService,
    ColumnChooserService,
    EditService,
    ToolbarService,
    SortService,
    ResizeService,
    ExcelExportService,
    PdfExportService,
    ContextMenuService,
    FreezeService,
    MessageService,
    ConfirmationService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
