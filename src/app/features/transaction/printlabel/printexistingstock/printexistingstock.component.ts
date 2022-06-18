import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PrintLabelService } from 'src/app/core/service/printlabel.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'org-rms-printexistingstock',
  templateUrl: './printexistingstock.component.html',
  styleUrls: ['./printexistingstock.component.css']
})
export class PrintexistingstockComponent implements OnInit {
  @Input() name: string = 'printexistingstock';
  @ViewChild('ViewButton') ViewButton!: ElementRef;
  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes: any;
  printLabelDesignCodes!: string[];
  rowcountform!: FormGroup;
  submitted: boolean = false;
  startprinting: boolean = false;
  totalGridCount: number = 0;
  constructor(
    private printLabelService: PrintLabelService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.rowcountform = this.formBuilder.group({
      ProductCode: [null],
      ProductDescription: [null],
      Category: [null],
      PrintTemplateSelCode: [null, Validators.required],
      NoofQuantity: [null, Validators.required],
      UOMQuantity: [null, Validators.required],
      UOMCode: [null]
    });
    this.subscription = this.printLabelService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
      this.submitted = false;
      this.rowcountform.reset()
      this.triggerClick();
    });
    this.getLabelDesign();
  }
  private async getLabelDesign() {
    this.printLabelDesignCodes = await this.printLabelService.getPrintLabelDesign();
  }
  
  get formcontrols() { return this.rowcountform.controls; }

  async PrintLabel() {
    this.submitted = true;
    if (this.rowcountform.invalid) {
      return;
    }
    this.startprinting = true;
    var printZPL = '';
    var finalZPL = '';
    var designContent = await this.printLabelService.getPrintLabelDesignData(this.formcontrols.PrintTemplateSelCode.value);
    designContent = designContent.replace(/\r?\n|\r/g, "</br>");
    let noofquantitytoprint = this.formcontrols.NoofQuantity.value
    let UOMquantity = this.formcontrols.UOMQuantity.value
    var ProductId = this.selectedNodes.productId;
    var UomCode = this.formcontrols.UOMCode.value;
    for (let j = 0; j < noofquantitytoprint; j++) {
      printZPL = designContent;
      var sPrintArr: string[] = [];
      sPrintArr.push(ProductId, '', '', UomCode, UOMquantity)
      var encodedrfiddata = await this.printLabelService.getGeneratedSerailNo(sPrintArr);
      var x: any;
      x = encodedrfiddata.split('|');
      printZPL = printZPL.replace('[LOCCODE]', x[0]);
      printZPL = printZPL.replace('[PRODUCTID]', x[1]);
      printZPL = printZPL.replace('[DDMMYY]', x[2]);
      printZPL = printZPL.replace('[SEQNO]', x[3]);
      printZPL = printZPL.replace('[RFID]', encodedrfiddata.replace(/[|]/g, ''));
      printZPL = printZPL.replace('[BARCODE]', encodedrfiddata.replace(/[|]/g, ''));
      printZPL = printZPL.replace('[BARCODE1]', this.selectedNodes.productCode);
      printZPL = printZPL.replace('[PRODUCTCODE]', this.selectedNodes.productCode);
      printZPL = printZPL.replace('[PRODUCTDESCRIPTION]', this.selectedNodes.productDescription);
      printZPL = printZPL.replace('[PRICE]', this.selectedNodes.price);
      printZPL = printZPL.replace('[INVENTORYUOM]', this.selectedNodes.inventoryUOM);
      printZPL = printZPL.replace('[CATEGORY]', this.selectedNodes.category);
      printZPL = printZPL.replace('[ASSETSTATUS]', this.selectedNodes.assetStatus);
      printZPL = printZPL.replace('[ITEMSGROUPCODE]', this.selectedNodes.itemsGroupCode);
      printZPL = printZPL.replace('[PURCHASEITEMPERUNIT]', this.selectedNodes.purchaseItemsPerUnit);
      printZPL = printZPL.replace('[MATERIALRECEIVEDDATE]', this.datePipe.transform(new Date(), "ddMMyy") + this.selectedNodes.itemsGroupCode);
      finalZPL += printZPL;
      printZPL = '';
      if (j == noofquantitytoprint - 1) {
        await this.PrintOut(finalZPL);
        this.startprinting = false;
      }
    }
  }
  async PrintOut(params: any) {
    let popupWin;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin?.document.open();
    popupWin?.document.write(`
     <html>
       <head>
         <style>
         @page { size: auto;  margin: 0mm; }
         </style>
       </head>
   <body onload="window.print();setTimeout(function(){window.close();}, 10000);">${params}</body>
     </html>`
    );
    popupWin?.document.close();
    this.startprinting = false;
  }
  triggerClick() {
    this.formcontrols.ProductCode.setValue(this.selectedNodes.productCode);
    this.formcontrols.ProductDescription.setValue(this.selectedNodes.productDescription);
    this.formcontrols.Category.setValue(this.selectedNodes.category);
    this.formcontrols.UOMCode.setValue(this.selectedNodes.inventoryUOM);
    this.formcontrols.NoofQuantity.setValue(1);
    this.formcontrols.UOMQuantity.setValue(1);
    if (this.printLabelDesignCodes.length == 1) {
      this.formcontrols.PrintTemplateSelCode.setValue(this.printLabelDesignCodes[0]);
    }
    let el: HTMLElement = this.ViewButton.nativeElement as HTMLElement;
    el.click();
  }
  totalGridItems($event: number) {
    this.totalGridCount = $event;
  }
}
