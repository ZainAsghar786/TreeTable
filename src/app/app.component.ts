import { Component, OnInit, ViewChild } from '@angular/core';
import { hmData } from './datasource';
import { virtualData, dataSource } from './datasource2';
import { TreeGridComponent } from '@syncfusion/ej2-angular-treegrid';
import { getValue, isNullOrUndefined } from '@syncfusion/ej2-base';
import { BeforeOpenCloseEventArgs } from '@syncfusion/ej2-inputs';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { MenuItemModel } from '@syncfusion/ej2-navigations';
import { stringify } from 'querystring';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public data: Object[] = [];
  public columns: any[];
  @ViewChild('treegrid')
  public treegrid: TreeGridComponent;
  public contextMenuItems: Object;
  ngOnInit(): void {
    this.data = hmData;
    // dataSource();
    // console.log(virtualData);
    this.columns = [
      {
        field: 'TaskID',
        headerText: 'Player Jersey',
        width: '80',
        textAlign: 'Right',
      },
      {
        field: 'FIELD1',
        headerText: 'Player Name',
        width: '100',
        textAlign: 'Right',
      },
      {
        field: 'FIELD2',
        headerText: 'Year',
        width: '100',
        format: 'yMd',
        textAlign: 'Right',
      },
      {
        field: 'FIELD3',
        headerText: 'Stint',
        width: '80',
        textAlign: 'Right',
      },
      {
        field: 'FIELD4',
        headerText: 'TIMID',
        width: '80',
        textAlign: 'Right',
      },
    ];
    this.contextMenuItems = [
      { text: 'Add Next', target: '.e-content', id: 'row-addnext' },
      { text: 'Add Child', target: '.e-content', id: 'row-addchild' },
      { text: 'Delete Row', target: '.e-content', id: 'row-del' },
      { text: 'Edit Row', target: '.e-content', id: 'row-edit' },
      { text: 'MultiSelect', target: '.e-content', id: 'row-multi-select' },
      { text: 'Copy Rows', target: '.e-content', id: 'row-copy' },
      { text: 'Cut Rows', target: '.e-content', id: 'row-cut' },
      { text: 'Paste Next', target: '.e-content', id: 'row-paste-next' },
      { text: 'Paste Child', target: '.e-content', id: 'row-paste-child' },
      { text: 'Edit Col', target: '.e-headercontent', id: 'col-edit' },
      { text: 'New Col', target: '.e-headercontent', id: 'col-new' },
      { text: 'Del Col', target: '.e-headercontent', id: 'col-del' },
      { text: 'Choose Col', target: '.e-headercontent', id: 'col-choose' },
      { text: 'Freeze Col', target: '.e-headercontent', id: 'col-freeze' },
      { text: 'Filter Col', target: '.e-headercontent', id: 'col-filter' },
      { text: 'Multi Sort', target: '.e-headercontent', id: 'col-multisort' },
    ];
  }

  /* #region  CONTEXT MENU FUNCTIONS */
  contextMenuOpen(arg?: BeforeOpenCloseEventArgs): void {
    let isRow = false;
    let isCol = false;
    let selectedRow;
    if (arg) {
      /* #region  -------------------GETTING CELL TYPE ON CLICK ROW OR COL-------------- */
      console.log(arg);
      const cellTypeSource = arg['rowInfo'];
      if (cellTypeSource && cellTypeSource['row']) {
        isRow = true;
        isCol = false;
        selectedRow = arg['rowInfo']['rowData'];
        console.log(selectedRow);
      } else if (cellTypeSource && !cellTypeSource['row']) {
        isCol = true;
        isRow = false;
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
    if (isCol) {
      for (let i: number = 0; i < colMenu.length; i++) {
        colMenu[i].setAttribute('style', 'display: block;');
      }
      for (let i: number = 0; i < rowMenu.length; i++) {
        rowMenu[i].setAttribute('style', 'display: none;');
      }
    } else if (isRow) {
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
    // if (args.item.id === 'collapserow') {
    //   this.treegrid.collapseRow(
    //     this.treegrid.getSelectedRows()[0] as HTMLTableRowElement,
    //     this.treegrid.getSelectedRecords()[0]
    //   );
    // } else if (args.item.id === 'expandrow') {
    //   this.treegrid.expandRow(
    //     this.treegrid.getSelectedRows()[0] as HTMLTableRowElement,
    //     this.treegrid.getSelectedRecords()[0]
    //   );
    // } else if (args.item.id === 'collapseall') {
    //   this.treegrid.collapseAll();
    // } else if (args.item.id === 'expandall') {
    //   this.treegrid.expandAll();
    // }
  }
  /* #endregion */
}
