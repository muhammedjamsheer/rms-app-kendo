import { formatDate } from "@angular/common";
import { HttpParams } from "@angular/common/http";
import * as XLSX from "xlsx";

export function prepareHttpParams(filter: any): HttpParams {
    let params = new HttpParams();
        for (const key in filter) {
            if (filter[key] && filter[key] != undefined)
                params = params.append(key, filter[key]);
        }
        return params;  
}

export function dateFormatter(params: any) {    
    if (params.value) {
      var dateVal = new Date(params.value);
      if (dateVal)
        return formatDate(params.value, 'dd-MM-yyyy hh:mm:ss aa', 'en-US');
      else
        return '';
    }
    else
      return '';
  }
  export function getTodayStartTime(){
    return formatDate(new Date(), 'yyyy-MM-ddT00:00', 'en-US');  
  }
  
  export function getTodayEndTime(){
    return formatDate(new Date(), 'yyyy-MM-ddT23:59', 'en-US');
  }
  export class TableUtil {
    static exportToExcel(tableId: string, name?: string) {
      let timeSpan = new Date().toISOString();
      let prefix = name || "ExportResult";
      let fileName = `${prefix}-${timeSpan}`;
      let targetTableElm = document.getElementById(tableId);
      let wb = XLSX.utils.table_to_book(targetTableElm, <XLSX.Table2SheetOpts>{ sheet: prefix });
      XLSX.writeFile(wb, `${fileName}.xlsx`);
    }

   
  }