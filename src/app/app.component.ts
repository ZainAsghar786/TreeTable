import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  TreeGridComponent,
  PageSettingsModel,
} from '@syncfusion/ej2-angular-treegrid';
import { getValue, isNullOrUndefined } from '@syncfusion/ej2-base';
import { BeforeOpenCloseEventArgs } from '@syncfusion/ej2-inputs';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { HttpRequestService } from './services/http-request.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationService } from 'primeng/api';
import { MasterDataService } from './services/master-data.service';
import { SortEventArgs } from '@syncfusion/ej2-grids';
import { dataSource, virtualData } from './datasource2';
import { templateJitUrl } from '@angular/compiler';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  /* #region  ---------------------INITIALIZATION-------------------- */
  public sourceTableData: any;
  public tableData: any[] = [];
  public data: Object[] = [];
  public sourceColumns: any[];
  public columns: any[];

  tableSubscription;
  @ViewChild('treegrid')
  public treegrid: TreeGridComponent;

  allowVirtualization = true;
  childMapping = 'Crew';
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
      text: 'Sorting',
      target: '.e-headercontent',
      id: this.contextMenuIds.colMultiSort,
      cellType: 'col',
    },
    /* #endregion */
  ];
  constructor(
    private http: HttpRequestService,
    private confirmationService: ConfirmationService,
    private store: MasterDataService,
    private spinner: NgxSpinnerService
  ) {}
  /* #endregion */

  /* #region  ---------------------LIFE CYCLE------------------------ */
  ngOnInit(): void {
    this.store.loadTableData();
    this.spinner.show();
    this.tableSubscription = this.store.tableDataList.subscribe((data) => {
      if (data) {
        this.spinner.show();
        this.sourceColumns = [...data.Data.ColData];
        this.sourceTableData = [...data.Data.Data];
        this.refreshWholeData();
        this.spinner.hide();
        this.sortSettings = { columns: [] };
        this.pageSettings = { pageSize: 10 };
      }
    });
  }
  ngOnDestroy(): void {
    this.tableSubscription.unsubscribe();
  }
  refreshWholeData() {
    this.columns = [];
    this.tableData = [];
    setTimeout(() => {
      this.columns = [...this.sourceColumns];
      this.tableData = [...this.sourceTableData];
      this.getColNames();
      this.getFieldsData();
      this.checkFreezeCol();
    }, 0);
  }

  /* #endregion */

  /* #region ----------------------CONTEXT MENU FUNCTIONS------------- */
  public isRow: boolean = false;
  public isCol: boolean = false;
  public clickedMenuHeading = 'Dialog';
  public clickedMenuID;
  public clickedColHeader;
  public clickedColField;
  public clickedRowDetail;
  contextMenuOpen(arg?: BeforeOpenCloseEventArgs): void {
    if (arg) {
      /* #region  -------------------GETTING CELL TYPE ON CLICK ROW OR COL-------------- */
      console.log(arg);
      const cellTypeSource = arg['rowInfo'];
      const ColDetail = arg['column'];
      if (cellTypeSource && cellTypeSource['row']) {
        this.isRow = true;
        this.isCol = false;
        this.clickedRowDetail = { ...arg['rowInfo']['rowData'] };
      } else if (
        cellTypeSource &&
        !cellTypeSource['row'] &&
        ColDetail != null
      ) {
        this.isCol = true;
        this.isRow = false;
      } else {
        this.isRow = false;
        this.isCol = false;
      }
      /* #endregion */
    }

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
          this.allowColumnChooser
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
        if (rowMenu[i].id === this.contextMenuIds.rowPasteChild) {
          this.clickedRowDetail.parentItem
            ? rowMenu[i].setAttribute('style', 'display: none;')
            : '';
        }
        if (rowMenu[i].id === this.contextMenuIds.rowPasteNext) {
        }
      }
      for (let i: number = 0; i < colMenu.length; i++) {
        colMenu[i].setAttribute('style', 'display: none;');
      }
    } else {
      for (let i: number = 0; i < totalMenu.length; i++) {
        totalMenu[i].setAttribute('style', 'display: none;');
        if (totalMenu[i].id === this.contextMenuIds.rowAddNext) {
          totalMenu[i].setAttribute('style', 'display: block;');
        }
      }
    }
  }
  contextMenuClick(args?: MenuEventArgs): void {
    console.log(args);
    this.clickedMenuHeading = args['item']['text'] ? args['item']['text'] : '';
    this.clickedMenuID = args['item']['id'] ? args['item']['id'] : '';
    this.clickedColHeader = args['column'] ? args['column']['headerText'] : '';
    this.clickedColField = args['column'] ? args['column']['field'] : '';
    if (this.isCol) {
      if (
        this.clickedMenuID === this.contextMenuIds.colNew ||
        this.clickedMenuID === this.contextMenuIds.colEdit
      ) {
        this.showAddEditCol();
      } else if (this.clickedMenuID === this.contextMenuIds.colDell) {
        this.confirmDeleteCol();
      } else if (this.clickedMenuID === this.contextMenuIds.colChoose) {
        this.allowColumnChooser = !this.allowColumnChooser;
        if (this.allowColumnChooser) {
          this.toolbar = ['ColumnChooser'];
          this.allowPaging = true;
          this.allowVirtualization = false;
        } else {
          this.toolbar = '';
          this.allowPaging = false;
          this.allowVirtualization = true;
        }
        // this.resetTableData();
      } else if (this.clickedMenuID === this.contextMenuIds.colFilter) {
        this.allowFilter = !this.allowFilter;
      } else if (this.clickedMenuID === this.contextMenuIds.colFreeze) {
        this.resetCol();
        this.Col = {
          ...this.columns.filter((x) => x.field === this.clickedColField)[0],
        };
        this.confirmFreezeCol();
      } else if (this.clickedMenuID === this.contextMenuIds.colMultiSort) {
        this.allowSorting = !this.allowSorting;
      }
    } else if (this.isRow) {
      if (this.clickedMenuID === this.contextMenuIds.rowAddNext) {
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
        this.row.rowData = { ...this.clickedRowDetail };
        this.trimRowData(this.row.rowData);
      } else if (this.clickedMenuID === this.contextMenuIds.rowMultiSelect) {
        // this.allowPaging = !this.allowPaging;
        this.allowSelection = !this.allowSelection;
        this.resetCopyPasteObj();
        this.resetTableData();
        if (this.allowSelection) {
          this.isMultiSelected = true;
        } else {
          this.isMultiSelected = false;
        }
      } else if (this.clickedMenuID === this.contextMenuIds.rowDel) {
        if (this.isMultiSelected && this.multiSelectedRows.length >= 1) {
          this.deleteRowList = this.multiSelectedRows;
        } else {
          const tempObj = { ...this.clickedRowDetail };
          this.deleteRowList = [tempObj];
        }

        this.deleteRowList = this.deleteRowList.map((x) => {
          return {
            TaskID: x.TaskID,
            level: x.level,
          };
        });
        this.confirmRowDelete();
      } else if (this.clickedMenuID === this.contextMenuIds.rowCopy) {
        if (this.isMultiSelected) {
          const tempObj = [...this.multiSelectedRows];
          this.copyPasteObj.rowData = tempObj;
        } else {
          const tempOBJ = { ...this.clickedRowDetail };
          this.copyPasteObj.rowData = [tempOBJ];
        }
        this.copyPasteObj.rowData.forEach((x) => this.trimRowData(x));
        this.copyPasteObj.copyOrCut = 'copy';
      } else if (this.clickedMenuID === this.contextMenuIds.rowCut) {
        if (this.isMultiSelected) {
          this.copyPasteObj.rowData = this.multiSelectedRows;
        } else {
          const tempOBJ = { ...this.clickedRowDetail };
          this.copyPasteObj.rowData = [tempOBJ];
        }
        this.copyPasteObj.rowData.forEach((x) => this.trimRowData(x));
        this.copyPasteObj.copyOrCut = 'cut';
      } else if (this.clickedMenuID === this.contextMenuIds.rowPasteNext) {
        this.copyPasteObj.clickedRowTaskID = this.clickedRowDetail.TaskID;
        this.copyPasteObj.pasteWhere = 'next';
        this.confirmCopyPasteSubmit();
      } else if (this.clickedMenuID === this.contextMenuIds.rowPasteChild) {
        this.copyPasteObj.clickedRowTaskID = this.clickedRowDetail.TaskID;
        this.copyPasteObj.pasteWhere = 'child';
        this.confirmCopyPasteSubmit();
      }
    } else {
      if (this.clickedMenuID === this.contextMenuIds.rowAddNext) {
        this.resetRow();
        this.row.clickedRowTaskID = null;
        this.rowHeader = this.clickedMenuHeading;
        this.row.flag = 'next';
        this.rowDialog = true;
      }
    }
  }
  /* #endregion */

  /* #region  -------------------RESET THE TABLE DATA FOR STABILITY---------- */
  resetTableData() {
    this.tableData = [];
    setTimeout(() => {
      this.tableData = [...this.sourceTableData];
    }, 0);
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
    if (this.tableData.length >= 1) {
      const fieldDataArray = this.tableData[0];
      let keys = Object.keys(fieldDataArray);
      const keysInShowedCols = this.columns.map((x) => x.field);
      this.fieldData = keys
        .filter((x) => !keysInShowedCols.includes(x))
        .filter((x) => x !== this.childMapping)
        .map((x) => {
          return { field: x };
        });
    } else {
      this.http.showTost('warn', 'No Data', 'Please Add Some Data first');
    }
  }
  colSubmit() {
    if (this.isCol) {
      this.spinner.show();
      if (this.clickedMenuID === this.contextMenuIds.colNew) {
        this.http.postRequest('menu1/newCol', this.Col).subscribe(
          (data) => {
            this.http.showTost('info', 'Success', data.Status.message);
            this.sourceColumns = [...data.Data.ColData];
            this.resetCol();
            this.refreshWholeData();
            this.displayResponsive = false;
            this.spinner.hide();
          },
          (err: HttpErrorResponse) => {
            this.spinner.hide();
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
            this.sourceColumns = [...data.Data.ColData];
            this.refreshWholeData();
            this.displayResponsive = false;
            this.spinner.hide();
          },
          (err: HttpErrorResponse) => {
            this.spinner.hide();
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
          (x) => x.field === this.clickedColField
        )[0];
        this.Col = clickedColDetail;
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
  allowColumnChooser = false;
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
    this.spinner.show();
    this.http.deleteRequest('menu1/delCol/' + this.clickedColField).subscribe(
      (data) => {
        this.store.loadTableData();
        this.sourceColumns = [...data.Data.Data];
        this.sourceColumns = [...data.Data.ColData];
        this.refreshWholeData();
        this.spinner.hide();
        this.http.showTost('info', 'Success', data.Status.message);
      },
      (err: HttpErrorResponse) => {
        this.spinner.hide();
        this.http.showTost('error', 'Request Failed', err.error.Status.message);
      }
    );
  }
  /* #endregion */

  /* #region  -----------------------FREEZE COL--------------- */
  checkFreezeCol() {
    this.allowVirtualization = true;
    this.columns.forEach((x) => {
      if (x.isFrozen) {
        this.allowVirtualization = false;
        return;
      }
    });
  }
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

  /* #region  ---------------------ROWS-------------------------------------------------------------------------- */

  /* #region  ---------------------TRIM ROW-------------------------- */
  trimRowData(row) {
    /* #region  ---DELETE EXTRA OBJECT--- */
    if (row.hasOwnProperty('Crew')) {
      delete row['Crew'];
    }
    if (row.hasOwnProperty('taskData')) {
      delete row['taskData'];
    }
    if (row.hasOwnProperty('childRecords')) {
      delete row['childRecords'];
    }
    if (row.hasOwnProperty('parentItem')) {
      delete row['parentItem'];
    }
    if (row.hasOwnProperty('hasChildRecords')) {
      delete row['hasChildRecords'];
    }
    // if (row.hasOwnProperty('level')) {
    //   delete row['level'];
    // }
    if (row.hasOwnProperty('expanded')) {
      delete row['expanded'];
    }
    if (row.hasOwnProperty('checkboxState')) {
      delete row['checkboxState'];
    }
    if (row.hasOwnProperty('index')) {
      delete row['index'];
    }
    if (row.hasOwnProperty('uniqueID')) {
      delete row['uniqueID'];
    }
    if (row.hasOwnProperty('parentUniqueID')) {
      delete row['parentUniqueID'];
    }
    /* #endregion */
  }
  /* #endregion */

  /* #region  --------------------ADD ROWS---------------------------- */
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
    if (
      this.clickedMenuID === this.contextMenuIds.rowAddNext ||
      this.clickedMenuID === this.contextMenuIds.rowAddChild
    ) {
      this.spinner.show();
      this.http.postRequest('menu2/newRow', this.row).subscribe(
        (data) => {
          this.store.loadTableData();
          this.rowDialog = false;
          this.resetRow();
          this.spinner.hide();
          this.http.showTost('info', 'Success', data.Status.message);
        },
        (err: HttpErrorResponse) => {
          this.spinner.hide();
          this.http.showTost('error', 'Request Failed', err.error.message);
        }
      );
    } else if (this.clickedMenuID === this.contextMenuIds.rowEdit) {
      this.spinner.show();
      this.http.putRequest('menu2/editRow', this.row).subscribe(
        (data) => {
          this.store.loadTableData();
          this.rowDialog = false;
          this.spinner.hide();
          this.http.showTost('info', 'Success', data.Status.message);
        },
        (err: HttpErrorResponse) => {
          this.spinner.hide();
          this.http.showTost('error', 'Request Failed', err.error.message);
        }
      );
    }
  }
  /* #endregion */

  /* #region  --------------------ROW DELETE-------------------------- */
  deleteRowList: any[] = [];
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
    this.spinner.show();
    this.http.putRequest('menu2/delRow/', this.deleteRowList).subscribe(
      (data) => {
        this.deleteRowList = [];
        this.store.loadTableData();
        this.spinner.hide();
        this.http.showTost('info', 'Success', data.Status.message);
      },
      (err: HttpErrorResponse) => {
        this.spinner.hide();
        this.http.showTost('error', 'Request Failed', err.error.Status.message);
      }
    );
  }
  /* #endregion */

  /* #region  --------------------COPY CUT ROW------------------------ */
  public copyPasteObj = {
    pasteWhere: '',
    copyOrCut: '',
    clickedRowTaskID: null,
    rowData: [],
  };
  public canPaste = false;
  resetCopyPasteObj() {
    this.copyPasteObj = {
      pasteWhere: '',
      copyOrCut: '',
      clickedRowTaskID: null,
      rowData: [],
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
      this.spinner.show();
      this.http.postRequest('menu2/pasteRow', this.copyPasteObj).subscribe(
        (data) => {
          this.store.loadTableData();
          this.resetCopyPasteObj();
          this.spinner.hide();
          this.http.showTost('info', 'Success', data.Status.message);
        },
        (err: HttpErrorResponse) => {
          this.spinner.hide();
          this.http.showTost('error', 'Request Failed', err.error.message);
        }
      );
    }
  }

  /* #endregion */

  /* #region  --------------------MULTI SELECT------------------------- */
  public selectionSettings = {
    checkboxOnly: true,
    persistSelection: true,
  };
  allowSelection = false;
  isMultiSelected = false;
  multiSelectedRows: any[] = [];
  rowSelected(data) {
    let rowList;
    if (data.rowIndexes) {
      if (data.isHeaderCheckboxClicked) {
        this.multiSelectedRows = data.data;
      } else {
        const selectedRowIndexes = data.rowIndexes;
        const flatData = this.treegrid.flatData.map((x) => x);
        this.multiSelectedRows = flatData.filter((x, i) => {
          return selectedRowIndexes.includes(i);
        });
      }
      console.log(data);

      // this.multiSelectedRows.forEach((x) => this.trimRowData(x));
      this.multiSelectedRows.length >= 1
        ? (this.isMultiSelected = true)
        : (this.isMultiSelected = false);
    }
  }
  /* #endregion */

  /* #endregion */

  test(r) {
    console.log(r, ' for ');
  }
}
