import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompositeFilterDescriptor, filterBy, process } from '@progress/kendo-data-query';
import { SelectableSettings, SelectableMode, SelectionEvent } from "@progress/kendo-angular-grid";
@Component({
  selector: 'org-rms-reprint-label',
  templateUrl: './reprint-label.component.html',
  styleUrls: ['./reprint-label.component.css']
})
export class ReprintLabelComponent implements OnInit {
  reprintForm!: FormGroup;
  submitted: boolean = false;
  showepccode: boolean = false;
  showponumber: boolean = false;
  Reprinttypes: any[] = [{ value: 1, name: "EPC" }, { value: 2, name: "PO Number" }]
  detailsgrid:any[]=[
    {productId:1,productDescription:"Lenova Laptop"},
    {productId:2,productDescription:"Apple Laptop"},
    {productId:3,productDescription:"Hp Laptop"},
    {productId:4,productDescription:"Oppo Mobile"},
    {productId:5,productDescription:"Sony Tv"},
    {productId:6,productDescription:"Loyd"},
  ]
  selectedDetails:any[]=[]
  public filter!: CompositeFilterDescriptor;
  public selectableSettings: SelectableSettings = {
    mode: 'multiple',
    checkboxOnly: true,
  };
  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.reprintForm = this.formBuilder.group({
      Reprinttype: [null, Validators.required],
      epccode: [null, Validators.required],
      PoNumber: [null, Validators.required],
    });
  }
  onTypeChange(event) {
    this.showepccode = false;
    this.showponumber = false;
    this.formControls.PoNumber.setValidators([Validators.required]);
    this.formControls.epccode.setValidators([Validators.required]);
    if (event.value == 1) {
      this.showepccode = true;
      this.formControls.PoNumber.clearValidators();
    } else {
      this.showponumber = true;
      this.formControls.epccode.clearValidators();
    }
    this.formControls.PoNumber.updateValueAndValidity();
    this.formControls.epccode.updateValueAndValidity();
  }
  get formControls() { return this.reprintForm.controls; }
  SaveRequest() {
    this.submitted = true;
    debugger;
    if (this.reprintForm.invalid) {
      return;
    }
    alert(this.reprintForm.value)
  }
  keyChange(selectedrows: any) {
    this.selectedDetails = selectedrows.map((idx: any) => {
      return this.detailsgrid.find(item => item.productId === idx);
    });
    console.log(this.selectedDetails);
  }
  onPrintLabel(){
    
  }
}
