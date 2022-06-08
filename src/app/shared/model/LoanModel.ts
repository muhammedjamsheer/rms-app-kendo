import { LoanLine } from "./LoanLine";

export class LoanModel {
    releaseNo!: string;
    transactionTypeName!: string;
    releaseTypeText!: string;
    issueToTypeName!: string;
    issueToName!: string;
    loanStatusText!: string;
    loanStatus!: number;
    releaseDate!: Date; 
    releaseTypeId!: number;
    toBeReturnedDate!: Date;
    issueToTypeId!: number;
    issueToId!: number;
    remarks!: string;
    documents!: string;
    serialNos!: string;
    loanLines: LoanLine[] = [];
}