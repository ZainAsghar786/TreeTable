import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { hmData } from './datasource';
import { virtualData, dataSource } from './datasource2';
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
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  /* #region  -------------------------INITIALIZATION-------------------- */
  public data: Object[] = [];
  public columns: any[];
  @ViewChild('treegrid')
  public treegrid: TreeGridComponent;
  public contextMenuItems: Object;

  constructor(private http: HttpRequestService) {}
  /* #endregion */

  /* #region  --------------------------LIFE CYCLE------------------- */
  ngOnInit(): void {
    this.data = hmData;
    this.pageSettings = { pageSize: 10 };

    // dataSource();
    // console.log(virtualData);
    this.columns = [
      {
        field: 'TaskID',
        headerText: 'Player Jersey',
        width: '180',
        textAlign: 'center',
        isFrozen: true,
      },
      {
        field: 'FIELD1',
        headerText: 'Player Name',
        width: '200',
        textAlign: 'left',
        isFrozen: false,
      },
      {
        field: 'FIELD2',
        headerText: 'Year',
        width: '100',
        format: 'yMd',
        textAlign: 'Right',
        isFrozen: false,
      },
      {
        field: 'FIELD3',
        headerText: 'Stint',
        width: '80',
        textAlign: 'Right',
        isFrozen: false,
      },
      {
        field: 'FIELD4',
        headerText: 'TIMID',
        width: '80',
        textAlign: 'Right',
        isFrozen: false,
      },
    ];
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

  /* #endregion */

  /* #region --------------------------CONTEXT MENU FUNCTIONS---------------- */
  public isRow: boolean = false;
  public isCol: boolean = false;
  public clickedMenuHeading = 'Dialog';
  public clickedMenuID;
  public clickedCol;
  contextMenuOpen(arg?: BeforeOpenCloseEventArgs): void {
    let selectedRow;
    if (arg) {
      /* #region  -------------------GETTING CELL TYPE ON CLICK ROW OR COL-------------- */
      console.log(arg);
      const cellTypeSource = arg['rowInfo'];
      if (cellTypeSource && cellTypeSource['row']) {
        this.isRow = true;
        this.isCol = false;
        selectedRow = arg['rowInfo']['rowData'];
        console.log(selectedRow);
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
    if (this.isCol) {
      if (
        this.clickedMenuID.includes('new') ||
        this.clickedMenuID.includes('edit')
      ) {
        this.showAddEditCol();
      } else if (this.clickedMenuID.includes('del')) {
        this.columns.forEach((x, i) => {
          if (x.headerText === this.clickedCol) {
            this.columns.splice(i, 1);
            // -
            // -
            // -
            // -
            // -
            // -
            // -
            // -
            // -
            // -
          }
        });
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
        // this.columns.forEach((x) => {
        //   if (x.headerText === this.clickedCol) {
        //     x.isFrozen = true;
        //   }
        // });
      }
    }
  }
  /* #endregion */

  /* #region  -----------------------ADD EDIT Col------------------- */
  public Col = {
    field: '',
    headerText: '',
    dataType: null,
    width: 50,
  };
  /* #region  Submit */
  confirmSubmit() {
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
}
