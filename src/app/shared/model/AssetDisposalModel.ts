import { DisposalItemLines } from "./DisposalItemLines";

export class AssetDisposalModel {
    disposalId!: number;
    disposalDate!: Date;
    disposedBy!: string;
    disposalMethod!: string;
    disposalItemLines!: DisposalItemLines[];
}