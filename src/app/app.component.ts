import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  TreeGridComponent,
  PageSettingsModel,
} from '@syncfusion/ej2-angular-treegrid';
import { getValue, isNullOrUndefined } from '@syncfusion/ej2-base';
import { BeforeOpenCloseEventArgs } from '@syncfusion/ej2-inputs';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { MenuItemModel } from '@syncfusion/ej2-navigations';
import { stringify } from 'querystring';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { EmitType } from '@syncfusion/ej2-base';
import { HttpRequestService } from './services/http-request.service';
import { HttpErrorResponse } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ConfirmationService } from 'primeng/api';
import { MasterDataService } from './services/master-data.service';
import { column, backCol } from './models/column';
import { SortEventArgs } from '@syncfusion/ej2-grids';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  /* #region  ---------------------INITIALIZATION-------------------- */
  public sourceTable: any;
  public tableData;
  tableSubscription;
  public data: Object[] = [];
  public columns: any[];
  @ViewChild('treegrid')
  public treegrid: TreeGridComponent;
  fieldData;
  contextMenuIds = {
    rowAddNext: 'rowAddNext',
    rowAddChild: 'rowAddChild',
    rowDel: 'rowDel',
    rowEdit: 'rowEdit',
    rowMultiSelect: 'rowMultiSelect',
    rowCopy: 'rowCopy',
    rowCut: 'rowCut',
    rowPasteNext: 'rowPasteNext',
    rowPasteChild: 'rowPasteChild',
    colEdit: 'colEdit',
    colNew: 'colNew',
    colDell: 'colDell',
    colChoose: 'colChoose',
    colFreeze: 'colFreeze',
    colFilter: 'colFilter',
    colMultiSort: 'colMultiSort',
  };
  public contextMenuItems = [
    /* #region  ROWS */
    {
      text: 'Add Next',
      target: '.e-content',
      id: this.contextMenuIds.rowAddNext,
      cellType: 'row',
    },
    {
      text: 'Add Child',
      target: '.e-content',
      id: this.contextMenuIds.rowAddChild,
      cellType: 'row',
    },
    {
      text: 'Delete Row',
      target: '.e-content',
      id: this.contextMenuIds.rowDel,
      cellType: 'row',
    },
    {
      text: 'Edit Row',
      target: '.e-content',
      id: this.contextMenuIds.rowEdit,
      cellType: 'row',
    },
    {
      text: 'MultiSelect',
      target: '.e-content',
      id: this.contextMenuIds.rowMultiSelect,
      cellType: 'row',
    },
    {
      text: 'Copy Rows',
      target: '.e-content',
      id: this.contextMenuIds.rowCopy,
      cellType: 'row',
    },
    {
      text: 'Cut Rows',
      target: '.e-content',
      id: this.contextMenuIds.rowCut,
      cellType: 'row',
    },
    {
      text: 'Paste Next',
      target: '.e-content',
      id: this.contextMenuIds.rowPasteNext,
      cellType: 'row',
    },
    {
      text: 'Paste Child',
      target: '.e-content',
      id: this.contextMenuIds.rowPasteChild,
      cellType: 'row',
    },
    /* #endregion */
    /* #region  COLS */
    {
      text: 'Edit Col',
      target: '.e-headercontent',
      id: this.contextMenuIds.colEdit,
      cellType: 'col',
    },
    {
      text: 'New Col',
      target: '.e-headercontent',
      id: this.contextMenuIds.colNew,
      cellType: 'col',
    },
    {
      text: 'Del Col',
      target: '.e-headercontent',
      id: this.contextMenuIds.colDell,
      cellType: 'col',
    },
    {
      text: 'Choose Col',
      target: '.e-headercontent',
      id: this.contextMenuIds.colChoose,
      cellType: 'col',
    },
    {
      text: 'Freeze Col',
      target: '.e-headercontent',
      id: this.contextMenuIds.colFreeze,
      cellType: 'col',
    },
    {
      text: 'Filter Col',
      target: '.e-headercontent',
      id: this.contextMenuIds.colFilter,
      cellType: 'col',
    },
    {
      text: 'Multi Sort',
      target: '.e-headercontent',
      id: this.contextMenuIds.colMultiSort,
      cellType: 'col',
    },
    /* #endregion */
  ];
  constructor(
    private http: HttpRequestService,
    private confirmationService: ConfirmationService,
    private store: MasterDataService
  ) {}
  /* #endregion */

  /* #region  ---------------------LIFE CYCLE------------------- */
  ngOnInit(): void {
    this.store.loadTableData();
    this.tableSubscription = this.store.tableDataList.subscribe((data) => {
      if (data) {
        this.sourceTable = { ...data.Data };
        this.columns = [...this.sourceTable.ColData];
        this.tableData = [...this.sourceTable.Data];
        this.getColNames();
        this.getFieldsData();
      } else {
        this.tableData = [];
      }
    });
    this.sortSettings = { columns: [] };
    this.pageSettings = { pageSize: 10 };
  }
  ngOnDestroy(): void {
    this.tableSubscription.unsubscribe();
  }

  /* #endregion */

  /* #region ----------------------CONTEXT MENU FUNCTIONS---------------- */
  public isRow: boolean = false;
  public isCol: boolean = false;
  public clickedMenuHeading = 'Dialog';
  public clickedMenuID;
  public clickedColHeader;
  public clickedColField;
  public clickedRowDetail;
  contextMenuOpen(arg?: BeforeOpenCloseEventArgs): void {
    let selectedRow;
    if (arg) {
      /* #region  -------------------GETTING CELL TYPE ON CLICK ROW OR COL-------------- */
      console.log(arg);
      const cellTypeSource = arg['rowInfo'];
      if (cellTypeSource && cellTypeSource['row']) {
        this.isRow = true;
        this.isCol = false;
        this.clickedRowDetail = arg['rowInfo']['rowData'];
      } else if (cellTypeSource && !cellTypeSource['row']) {
        this.isCol = true;
        this.isRow = false;
      }
      /* #endregion */
    }
    let elem: Element = arg.event.target as Element;
    /* #region  UNUSED YET */
    let row: Element = elem.closest('.e-row');
    let uid: string = row && row.getAttribute('data-uid');
    if (uid) {
      let rowdata = this.treegrid.grid.getRowObjectFromUID(uid).data;
    }
    /* #endregion */

    /* #region  GETTING MENU AND DIFFERENTIATE ROW MENU AND COL MENU ON THE BASIS OF CONTEXTMENU ID */
    let totalMenu: Array<HTMLElement> = [].slice.call(
      document.querySelectorAll('.e-menu-item')
    );
    const rowMenu = totalMenu.filter((x) => x.id.toLowerCase().includes('row'));
    const colMenu = totalMenu.filter((x) => x.id.toLowerCase().includes('col'));
    /* #endregion */
    if (this.isCol) {
      for (let i: number = 0; i < colMenu.length; i++) {
        colMenu[i].setAttribute('style', 'display: block;');
        if (colMenu[i].id === this.contextMenuIds.colChoose) {
          this.showColumnChooser
            ? (colMenu[i].style.backgroundColor = '#69E433')
            : (colMenu[i].style.backgroundColor = 'white');
        }
        if (colMenu[i].id === this.contextMenuIds.colFilter) {
          this.allowFilter
            ? (colMenu[i].style.backgroundColor = '#69E433')
            : (colMenu[i].style.backgroundColor = 'white');
        }
        if (colMenu[i].id === this.contextMenuIds.colMultiSort) {
          this.allowSorting
            ? (colMenu[i].style.backgroundColor = '#69E433')
            : (colMenu[i].style.backgroundColor = 'white');
        }
      }
      for (let i: number = 0; i < rowMenu.length; i++) {
        rowMenu[i].setAttribute('style', 'display: none;');
      }
    } else if (this.isRow) {
      for (let i: number = 0; i < rowMenu.length; i++) {
        rowMenu[i].setAttribute('style', 'display: block;');
        if (rowMenu[i].id === this.contextMenuIds.rowAddChild) {
          if (this.clickedRowDetail.parentItem) {
            rowMenu[i].setAttribute('style', 'display:none');
          }
        }
        if (
          rowMenu[i].id === this.contextMenuIds.rowPasteChild ||
          rowMenu[i].id === this.contextMenuIds.rowPasteNext
        ) {
          if (Object.entries(this.copyPasteObj.rowData).length <= 0)
            rowMenu[i].setAttribute('style', 'display:none');
        }
        if (rowMenu[i].id === this.contextMenuIds.rowMultiSelect) {
          this.allowSelection
            ? (rowMenu[i].style.backgroundColor = '#69E433')
            : (rowMenu[i].style.backgroundColor = 'white');
        }
        if (rowMenu[i].id === this.contextMenuIds.rowCopy) {
          this.copyPasteObj.copyOrCut === 'copy'
            ? (rowMenu[i].style.backgroundColor = '#69E433')
            : (rowMenu[i].style.backgroundColor = 'white');
        }
        if (rowMenu[i].id === this.contextMenuIds.rowCut) {
          this.copyPasteObj.copyOrCut === 'cut'
            ? (rowMenu[i].style.backgroundColor = '#69E433')
            : (rowMenu[i].style.backgroundColor = 'white');
        }
      }
      for (let i: number = 0; i < colMenu.length; i++) {
        colMenu[i].setAttribute('style', 'display: none;');
      }
    }
  }
  contextMenuClick(args?: MenuEventArgs): void {
    console.log(args);
    this.clickedMenuHeading = args['item']['text'];
    this.clickedMenuID = args['item']['id'];
    this.clickedColHeader = args['column']['headerText'];
    this.clickedColField = args['column']['field'];
    if (this.isCol) {
      if (
        this.clickedMenuID === this.contextMenuIds.colNew ||
        this.clickedMenuID === this.contextMenuIds.colEdit
      ) {
        this.showAddEditCol();
      } else if (this.clickedMenuID === this.contextMenuIds.colDell) {
        this.confirmDeleteCol();
      } else if (this.clickedMenuID === this.contextMenuIds.colChoose) {
        this.showColumnChooser = !this.showColumnChooser;
        this.allowPaging = !this.allowPaging;
        if (this.showColumnChooser) {
          this.toolbar = ['ColumnChooser'];
        } else {
          this.toolbar = '';
        }
      } else if (this.clickedMenuID === this.contextMenuIds.colFilter) {
        this.allowFilter = !this.allowFilter;
      } else if (this.clickedMenuID === this.contextMenuIds.colFreeze) {
        this.resetCol();
        this.Col = {
          ...this.columns.filter((x) => x.field === this.clickedColField)[0],
        };
        this.confirmFreezeCol();
      } else if (this.clickedMenuID === this.contextMenuIds.colMultiSort) {
        this.sortDialog = true;
      }
    } else if (this.isRow) {
      if (this.clickedMenuID === this.contextMenuIds.rowAddNext) {
        console.log('row');
        this.resetRow();
        this.row.clickedRowTaskID = this.clickedRowDetail.TaskID;
        this.rowHeader = this.clickedMenuHeading;
        this.row.flag = 'next';
        this.rowDialog = true;
      } else if (this.clickedMenuID === this.contextMenuIds.rowAddChild) {
        this.resetRow();
        this.row.clickedRowTaskID = this.clickedRowDetail.TaskID;
        this.rowHeader = this.clickedMenuHeading;
        this.rowDialog = true;
      } else if (this.clickedMenuID === this.contextMenuIds.rowEdit) {
        this.rowHeader = this.clickedMenuHeading;
        this.rowDialog = true;
        this.row.rowData = this.clickedRowDetail;
        this.trimRowData(this.row.rowData);
      } else if (this.clickedMenuID === this.contextMenuIds.rowMultiSelect) {
        // this.allowPaging = !this.allowPaging;
        this.allowSelection = !this.allowSelection;
        setTimeout(() => {
          this.columns = [...this.sourceTable.ColData];
        }, 0);
      } else if (this.clickedMenuID === this.contextMenuIds.rowDel) {
        this.confirmRowDelete();
      } else if (this.clickedMenuID === this.contextMenuIds.rowCopy) {
        console.log(Object.entries(this.copyPasteObj.rowData).length >= 1);
        this.copyPasteObj.rowData = this.clickedRowDetail;
        this.copyPasteObj.copyOrCut = 'copy';
        this.trimRowData(this.copyPasteObj.rowData);
      } else if (this.clickedMenuID === this.contextMenuIds.rowCut) {
        console.log(Object.entries(this.copyPasteObj.rowData).length >= 1);
        this.copyPasteObj.rowData = this.clickedRowDetail;
        this.copyPasteObj.copyOrCut = 'cut';
        this.trimRowData(this.copyPasteObj.rowData);
      } else if (this.clickedMenuID === this.contextMenuIds.rowPasteNext) {
        this.copyPasteObj.clickedRowTaskID = this.clickedRowDetail.TaskID;
        this.copyPasteObj.pasteWhere = 'next';
        this.confirmCopyPasteSubmit();
      } else if (this.clickedMenuID === this.contextMenuIds.rowPasteChild) {
        this.copyPasteObj.clickedRowTaskID = this.clickedRowDetail.TaskID;
        this.copyPasteObj.pasteWhere = 'child';
        this.confirmCopyPasteSubmit();
      }
    }
  }
  /* #endregion */

  /* #region  ---------------------COLS--------------------------------------------------------------------------------------------- */

  /* #region  -----------------------ADD EDIT Col------------------- */
  public Col = {
    field: '',
    headerText: '',
    dataType: null,
    width: 200,
    defaultValue: 1,
    isFrozen: false,
  };
  public fieldsData;
  getFieldsData() {
    const fieldDataArray = this.sourceTable.Data[0];
    let keys = Object.keys(fieldDataArray);
    this.fieldData = keys.map((x) => {
      return { field: x };
    });
  }
  /* #region  Submit */
  colSubmit() {
    if (this.isCol) {
      if (this.clickedMenuID === this.contextMenuIds.colNew) {
        this.http.postRequest('menu1/newCol', this.Col).subscribe(
          (data) => {
            this.http.showTost('info', 'Success', data.Status.message);
            this.store.loadTableData();
            this.displayResponsive = false;
            this.resetCol();
          },
          (err: HttpErrorResponse) => {
            console.log(err);
            this.http.showTost(
              'error',
              'Request Failed',
              err.error.Status.message
            );
          }
        );
      } else if (
        this.clickedMenuID === this.contextMenuIds.colEdit ||
        this.clickedMenuID === this.contextMenuIds.colFreeze
      ) {
        this.http.putRequest('menu1/editCol', this.Col).subscribe(
          (data) => {
            this.http.showTost('info', 'Success', data.Status.message);
            this.store.loadTableData();
            this.displayResponsive = false;
          },
          (err: HttpErrorResponse) => {
            console.log(err);
            this.http.showTost(
              'error',
              'Request Failed',
              err.error.Status.message
            );
          }
        );
      }
    }
  }
  /* #endregion */

  resetCol() {
    this.Col = {
      field: '',
      headerText: '',
      dataType: null,
      width: 200,
      defaultValue: 120,
      isFrozen: false,
    };
  }
  /* #endregion */

  /* #region  ----------------------SHOW DIALOG */
  colHeader = 'Col';
  displayResponsive = false;
  showAddEditCol() {
    this.colHeader = this.clickedMenuHeading;
    this.displayResponsive = true;
    if (this.isCol) {
      if (this.clickedMenuID === this.contextMenuIds.colEdit) {
        const clickedColDetail = this.columns.filter(
          (x) => x.headerText === this.clickedColHeader
        )[0];
        this.Col = clickedColDetail;
        console.log(clickedColDetail);
      } else if (this.clickedMenuID === this.contextMenuIds.colNew) {
        this.resetCol();
      }
    }
  }

  /* #endregion */

  /* #region ------------------------Submit Call-------------- */
  SubmitBox(api, data, dialog) {
    this.http.postRequest(api, data).subscribe(
      (data) => {
        // this.store.loadAccountData();
        dialog = false;
        this.columns.push(this.Col);
        this.resetCol();
        // this.http.showTost('info', 'Success', data.Status.message);
      },
      (err: HttpErrorResponse) => {
        // this.http.showTost('error', 'Request Failed', 'Something went wrong!');
      }
    );
  }
  /* #endregion */

  /* #region  -----------------------CHOOSE COLUMN-------------- */
  showColumnChooser = false;
  allowPaging = false;
  public pageSettings: PageSettingsModel;
  public toolbar: any;

  /* #endregion */

  /* #region  -----------------------DELETE COL------------------ */
  confirmDeleteCol() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteColSubmit();
      },
      reject: () => {},
    });
  }
  deleteColSubmit() {
    this.http.deleteRequest('menu1/delCol/' + this.clickedColField).subscribe(
      (data) => {
        this.store.loadTableData();
        this.http.showTost('info', 'Success', data.Status.message);
      },
      (err: HttpErrorResponse) => {
        this.http.showTost('error', 'Request Failed', err.error.Status.message);
      }
    );
  }
  /* #endregion */

  /* #region  -----------------------FREEZE COL--------------- */
  confirmFreezeCol() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.Col.isFrozen = !this.Col.isFrozen;
        this.colSubmit();
      },
      reject: () => {},
    });
  }
  /* #endregion */

  /* #region  -----------------------FILTER------------------- */
  allowFilter = false;
  /* #endregion */

  confirmSubmit() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.colSubmit();
      },
      reject: () => {},
    });
  }

  /* #region  -------------SORT DIALOG--------------- */
  colsList = [];
  sortDialog = false;
  allowSorting = false;
  sortSettings;
  selectedSorted;
  getColNames() {
    this.colsList = this.columns.map((x) => {
      return {
        field: x.field,
        headerText: x.headerText,
        direction: 'Ascending',
      };
    });
  }
  onAllowSortChange() {
    this.sortSettings = {};
    if (!this.allowSorting) {
      this.colsList = [];
      this.selectedSorted = [];
    } else {
      this.getColNames();
    }
  }
  onMultiSortChange(option) {
    this.sortSettings = {};
    this.sortSettings = { columns: this.selectedSorted };
  }

  /* #endregion */
  /* #endregion */

  /* #region  ---------------------ROWS------------------- */
  trimRowData(row) {
    /* #region  ---DELETE EXTRA OBJECT--- */
    if (row['Crew']) {
      delete row['Crew'];
    }
    if (row['taskData']) {
      delete row['taskData'];
    }
    if (row['childRecords']) {
      delete row['childRecords'];
    }
    if (row['parentItem']) {
      delete row['parentItem'];
    }
    /* #endregion */
  }
  /* #region  ---------------ADD ROWS */
  rowDialog = false;
  rowHeader = 'Row';
  public row = {
    rowData: {
      TaskID: null,
      FIELD1: '',
      FIELD2: null,
      FIELD3: null,
      FIELD4: null,
    },
    clickedRowTaskID: null,
    flag: '',
  };
  resetRow() {
    this.row = {
      rowData: {
        TaskID: null,
        FIELD1: '',
        FIELD2: null,
        FIELD3: null,
        FIELD4: null,
      },
      clickedRowTaskID: null,
      flag: '',
    };
  }
  confirmRowSubmit() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.rowSubmit();
      },
      reject: () => {},
    });
  }
  rowSubmit() {
    if (this.isRow) {
      if (
        this.clickedMenuID === this.contextMenuIds.rowAddNext ||
        this.clickedMenuID === this.contextMenuIds.rowAddChild
      ) {
        this.http.postRequest('menu2/newRow', this.row).subscribe(
          (data) => {
            this.store.loadTableData();
            this.rowDialog = false;
            this.resetRow();
            this.http.showTost('info', 'Success', data.Status.message);
          },
          (err: HttpErrorResponse) => {
            this.http.showTost('error', 'Request Failed', err.error.message);
          }
        );
      } else if (this.clickedMenuID === this.contextMenuIds.rowEdit) {
        this.http.putRequest('menu2/editRow', this.row).subscribe(
          (data) => {
            this.store.loadTableData();
            this.rowDialog = false;
            this.http.showTost('info', 'Success', data.Status.message);
          },
          (err: HttpErrorResponse) => {
            this.http.showTost('error', 'Request Failed', err.error.message);
          }
        );
      }
    }
  }
  /* #endregion */

  /* #region  -------------------ROW DELETE---------------- */
  confirmRowDelete() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.rowDeleteSubmit();
      },
      reject: () => {},
    });
  }
  rowDeleteSubmit() {
    this.http
      .deleteRequest('menu2/delRow/' + this.clickedRowDetail.TaskID)
      .subscribe(
        (data) => {
          this.store.loadTableData();
          this.http.showTost('info', 'Success', data.Status.message);
        },
        (err: HttpErrorResponse) => {
          this.http.showTost(
            'error',
            'Request Failed',
            'Something went wrong!'
          );
        }
      );
  }
  /* #endregion */

  /* #region  ----------------COPY CUT ROW------------- */
  public copyPasteObj = {
    pasteWhere: '',
    copyOrCut: '',
    clickedRowTaskID: null,
    rowData: {},
  };
  public canPaste = false;
  resetCopyPasteObj() {
    this.copyPasteObj = {
      pasteWhere: '',
      copyOrCut: '',
      clickedRowTaskID: null,
      rowData: {},
    };
  }

  confirmCopyPasteSubmit() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.copyPasteSubmit();
      },
      reject: () => {},
    });
  }
  copyPasteSubmit() {
    if (this.isRow) {
      this.http.postRequest('menu2/paste', this.row).subscribe(
        (data) => {
          this.store.loadTableData();
          this.resetCopyPasteObj();
          this.http.showTost('info', 'Success', data.Status.message);
        },
        (err: HttpErrorResponse) => {
          this.http.showTost('error', 'Request Failed', err.error.message);
        }
      );
    }
  }

  /* #endregion */

  /* #region  --------MULTI SELECT */
  public selectionsettings = {
    type: 'multiple',
    mode: 'both',
    checkboxOnly: true,
    persistSelection: true,
  };
  allowSelection = true;
  /* #endregion */

  /* #endregion */

  /* #region  -----------test---------- */
  getTestData() {
    if (this.treegrid && this.treegrid.selectionModule) {
      console.log(this.treegrid);
    }
  }
  test() {
    console.log('object');
  }
  /* #endregion */
}
