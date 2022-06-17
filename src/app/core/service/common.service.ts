import { Injectable } from '@angular/core';
import Swal from "sweetalert2";
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  formatIntoNumericvalues(value) {
    if (isNaN(value)) {
      return 0
    }
    return value;
  }
  dateFormatter(params: any) {
    if (params.value) {
      var dateVal = new Date(params.value);
      if (dateVal)
        return `${dateVal.getDate().toString().padStart(2, '0')}-${(dateVal.getMonth() + 1).toString().padStart(2, '0')}-${dateVal.getFullYear()}`;
      else
        return '';
    }
    else
      return '';
  }
  showMessage(type,message) {  
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
    Toast.fire({
      icon: type,
      title: message
    });
  }
}
