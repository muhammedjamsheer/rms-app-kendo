import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RoomMasterModel } from '../../shared/model//RoomMasterModel';

@Injectable({
    providedIn: 'root'
})
export class RoommasterService {
    roommasterDataCache: RoomMasterModel[] = [];
    token = localStorage.getItem('access_token');
    roomMasterDataByKey!: RoomMasterModel;
    selectedrowevent = new Subject<any>();
    refreshClickevent = new Subject<any>();
    headers = new HttpHeaders()
        .set('Authorization', "Bearer " + this.token)
        .set('Content-Type', 'application/json');;
    httpOptions = {
        headers: this.headers
    };

    constructor(private http: HttpClient,
        private router: Router) { }

    private roomMasterUrl = `${environment.apiUrl}/Room`;

    async getRoomMaster() {
        if (!(this.roommasterDataCache.length > 0)) {
            const data = await this.http.get<RoomMasterModel[]>(this.roomMasterUrl, this.httpOptions)
                .toPromise();
            this.roommasterDataCache = data;
            return data;
        }
        else {
            return this.roommasterDataCache;
        }
    }

    async onRefreshRoommaster() {
        const data = await this.http.get<RoomMasterModel[]>(this.roomMasterUrl, this.httpOptions)
            .toPromise();
        this.roommasterDataCache = data;
        return data;
    }

    addRoommaster(roommastermodel: RoomMasterModel) {
        return this.http.post<any>(`${environment.apiUrl}/Room`,
            roommastermodel
            , this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    editRoommaster(roommastermodel: RoomMasterModel) {
        return this.http.put<any>(`${environment.apiUrl}/Room/` + roommastermodel.roomID,
            roommastermodel, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }
    getRoomMasterByKey(roomID: number) {
        return this.roommasterDataCache.find(item => item.roomID == roomID);
    }

    AddOrEditRecordToCache(roommastermodel: RoomMasterModel, editMode: boolean) {
        if (editMode) {
            const objIndex = this.roommasterDataCache.findIndex(item => item.roomID == roommastermodel.roomID);
            this.roommasterDataCache[objIndex] = roommastermodel;
        }
        else {
            this.roommasterDataCache.push(roommastermodel);
            this.roommasterDataCache.sort((a, b) => (a.roomCode > b.roomCode) ? 1 : -1);
        }
    }

    DeleteRoomMaster(roomID: number) {
        return this.http.delete<any>(`${environment.apiUrl}/Room/` + roomID, this.httpOptions)
            .pipe(tap((res: any) => {
                return res;
            }));
    }

    DeleteFromCache(roomID: number) {
        const objIndex = this.roommasterDataCache.findIndex(item => item.roomID == roomID);
        this.roommasterDataCache.splice(objIndex, 1);

    }
}