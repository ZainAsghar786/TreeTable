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
  /* #region  -------------------------INITIALIZATION-------------------- */
  public tableSource;
  public tableData;
  tableSubscription;
  public data: Object[] = [];
  public columns: any[];
  @ViewChild('treegrid')
  public treegrid: TreeGridComponent;
  public contextMenuItems: Object;
  fieldData = [
    { id: 1, name: 'name' },
    { id: 2, name: 'fielde2' },
  ];

  constructor(
    private http: HttpRequestService,
    private confirmationService: ConfirmationService,
    private store: MasterDataService
  ) {}
  /* #endregion */

  /* #region  --------------------------LIFE CYCLE------------------- */
  ngOnInit(): void {
    this.pageSettings = { pageSize: 10 };
    this.sortSettings = { columns: [] };
    this.store.loadTableData();
    this.tableSubscription = this.store.tableData.subscribe((data) => {
      if (data) {
        console.log(data.Data.ColData);
        this.columns = data.Data.ColData;
        this.data = data.Data.Data;
        this.getColNames();
      }
    });
    /* #region  OLD COL */
    this.columns = backCol;
    /* #endregion */
    this.contextMenuItems = [
      /* #region  ROWS */
      {
        text: 'Add Next',
        target: '.e-content',
        id: 'row-addnext',
        cellType: 'row',
      },
      {
        text: 'Add Child',
        target: '.e-content',
        id: 'row-addchild',
        cellType: 'row',
      },
      {
        text: 'Delete Row',
        target: '.e-content',
        id: 'row-del',
        cellType: 'row',
      },
      {
        text: 'Edit Row',
        target: '.e-content',
        id: 'row-edit',
        cellType: 'row',
      },
      {
        text: 'MultiSelect',
        target: '.e-content',
        id: 'row-multi-select',
        cellType: 'row',
      },
      {
        text: 'Copy Rows',
        target: '.e-content',
        id: 'row-copy',
        cellType: 'row',
      },
      {
        text: 'Cut Rows',
        target: '.e-content',
        id: 'row-cut',
        cellType: 'row',
      },
      {
        text: 'Paste Next',
        target: '.e-content',
        id: 'row-paste-next',
        cellType: 'row',
      },
      {
        text: 'Paste Child',
        target: '.e-content',
        id: 'row-paste-child',
        cellType: 'row',
      },
      /* #endregion */
      /* #region  COLS */
      {
        text: 'Edit Col',
        target: '.e-headercontent',
        id: 'col-edit',
        cellType: 'col',
      },
      {
        text: 'New Col',
        target: '.e-headercontent',
        id: 'col-new',
        cellType: 'col',
      },
      {
        text: 'Del Col',
        target: '.e-headercontent',
        id: 'col-del',
        cellType: 'col',
      },
      {
        text: 'Choose Col',
        target: '.e-headercontent',
        id: 'col-choose',
        cellType: 'col',
      },
      {
        text: 'Freeze Col',
        target: '.e-headercontent',
        id: 'col-freeze',
        cellType: 'col',
      },
      {
        text: 'Filter Col',
        target: '.e-headercontent',
        id: 'col-filter',
        cellType: 'col',
      },
      {
        text: 'Multi Sort',
        target: '.e-headercontent',
        id: 'col-multisort',
        cellType: 'col',
      },
      /* #endregion */
    ];
  }
  ngOnDestroy(): void {
    this.tableSubscription.unsubscribe();
  }

  /* #endregion */

  /* #region --------------------------CONTEXT MENU FUNCTIONS---------------- */
  public isRow: boolean = false;
  public isCol: boolean = false;
  public clickedMenuHeading = 'Dialog';
  public clickedMenuID;
  public clickedCol;
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
      }
      for (let i: number = 0; i < rowMenu.length; i++) {
        rowMenu[i].setAttribute('style', 'display: none;');
      }
    } else if (this.isRow) {
      for (let i: number = 0; i < rowMenu.length; i++) {
        rowMenu[i].setAttribute('style', 'display: block;');
      }
      for (let i: number = 0; i < colMenu.length; i++) {
        colMenu[i].setAttribute('style', 'display: none;');
      }
    }

    // if (elem.closest('.e-row')) {
    //   if (
    //     isNullOrUndefined(uid) ||
    //     isNullOrUndefined(
    //       getValue(
    //         'hasChildRecords',
    //         this.treegrid.grid.getRowObjectFromUID(uid).data
    //       )
    //     )
    //   ) {
    //     arg.cancel = true;
    //   }
    // }
  }
  contextMenuClick(args?: MenuEventArgs): void {
    console.log(args);
    this.clickedMenuHeading = args['item']['text'];
    this.clickedMenuID = args['item']['id'];
    this.clickedCol = args['column']['headerText'];
    this.clickedColField = args['column']['field'];
    if (this.isCol) {
      if (
        this.clickedMenuID.includes('new') ||
        this.clickedMenuID.includes('edit')
      ) {
        this.showAddEditCol();
      } else if (this.clickedMenuID.includes('del')) {
        this.delteCol();
        console.log(this.clickedCol);
      } else if (this.clickedMenuID.includes('choose')) {
        this.showColumnChooser = !this.showColumnChooser;
        this.allowPaging = !this.allowPaging;
        if (this.showColumnChooser) {
          this.toolbar = ['ColumnChooser'];
        } else {
          this.toolbar = '';
        }
      } else if (this.clickedMenuID.includes('filter')) {
        this.allowFilter = !this.allowFilter;
      } else if (this.clickedMenuID.includes('freeze')) {
        this.columns.forEach((x) => {
          if (x.headerText === this.clickedCol) {
            console.log(x.isFrozen);
            x.isFrozen = !x.isFrozen;
            console.log(x.isFrozen);
          }
        });
      } else if (this.clickedMenuID.includes('sort')) {
        this.sortDialog = true;
      }
    }
    if (this.isRow) {
      if (this.clickedMenuID.includes('add')) {
        this.row.clickedRowTaskID = this.clickedRowDetail.TaskID;
        this.rowHeader = this.clickedMenuHeading;
        this.rowDialog = true;
      }
    }
  }
  /* #endregion */

  /* #region  -----------------------COLS--------------------- */

  /* #region  -----------------------ADD EDIT Col------------------- */
  public Col = {
    field: '',
    headerText: '',
    dataType: null,
    width: 50,
    defaultValue: 1,
    isFrozen: false,
  };
  /* #region  Submit */
  colSubmit() {
    if (this.isCol && this.clickedMenuID.includes('new'.toLowerCase())) {
      this.http.postRequest('menu1/newCol', this.Col).subscribe(
        (data) => {
          // this.store.loadAccountData();
          this.displayResponsive = false;
          this.columns.push(this.Col);
          this.resetCol();
          // this.http.showTost('info', 'Success', data.status.message);
        },
        (err: HttpErrorResponse) => {
          // this.http.showTost('error', 'Request Failed', 'Something went wrong!');
        }
      );
    } else if (
      this.isCol &&
      this.clickedMenuID.includes('edit'.toLowerCase())
    ) {
      this.http.postRequest('col/update', this.Col).subscribe(
        (data) => {
          // this.store.loadAccountData();
          this.displayResponsive = false;
          this.columns.push(this.Col);
          this.resetCol();
          // this.http.showTost('info', 'Success', data.status.message);
        },
        (err: HttpErrorResponse) => {
          // this.http.showTost('error', 'Request Failed', 'Something went wrong!');
        }
      );
    }
  }
  /* #endregion */

  resetCol() {
    this.Col = {
      field: '',
      headerText: '',
      dataType: null,
      width: 50,
      defaultValue: 12,
      isFrozen: false,
    };
  }
  /* #endregion */

  /* #region  ---------------------SHOW DIALOG */
  colHeader = 'Col';
  displayResponsive = false;
  showAddEditCol() {
    this.colHeader = this.clickedMenuHeading;
    this.displayResponsive = true;
    if (this.isCol) {
      if (this.clickedMenuID.includes('edit'.toLowerCase())) {
        const clickedColDetail = this.columns.filter(
          (x) => x.headerText === this.clickedCol
        )[0];
        this.Col = clickedColDetail;
        console.log(clickedColDetail);
      } else if (this.clickedMenuID.includes('new'.toLowerCase())) {
        this.resetCol();
      }
    }
  }

  /* #endregion */

  /* #region  Submit Call */
  SubmitBox(api, data, dialog) {
    this.http.postRequest(api, data).subscribe(
      (data) => {
        // this.store.loadAccountData();
        dialog = false;
        this.columns.push(this.Col);
        this.resetCol();
        // this.http.showTost('info', 'Success', data.status.message);
      },
      (err: HttpErrorResponse) => {
        // this.http.showTost('error', 'Request Failed', 'Something went wrong!');
      }
    );
  }
  /* #endregion */

  /* #region  -----------CHOOSE COLUMN-------------- */
  showColumnChooser = false;
  allowPaging = false;
  public pageSettings: PageSettingsModel;
  public toolbar: any;

  /* #endregion */

  /* #region  ----------------FILTER------------------- */
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

  delteCol() {
    this.http.putRequest('menu1/delCol/' + this.clickedColField).subscribe(
      (data) => {
        this.store.loadTableData();
      },
      (err: HttpErrorResponse) => {
        // this.http.showTost('error', 'Request Failed', 'Something went wrong!');
      }
    );
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

  /* #region  ---------------ROWS------------------- */
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
  };
  rowSubmit() {}
  /* #endregion */
  /* #endregion */
}
