import { Injectable } from '@angular/core';
import { Api } from 'src/app/_api/mock.api';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LinenotifyService {

  AuthorizedCode: string
  access_token:string

  constructor(private api: Api, private http: HttpClient) {}

  registerLineToken = (uuid: string): Promise<void> => {
    // let params_ = new HttpParams({
    //   fromObject: {
    //     grant_type: 'authorization_code',
    //     code: this.AuthorizedCode,
    //     redirect_uri:
    //       'https://tainan-public-witnessing.firebaseapp.com/callback',
    //     client_id: 'CumN52DojP7D7fMERzuV5o',
    //     client_secret: 'wdE44tZ3tSf7ywlWM8DOle6n8MHlic77OgZqQbNsuPy',
    //   },
    // });
    // this.http
    //   .post<{ access_token: string }>(
    //     'https://notify-bot.line.me/oauth/token',
    //     { params_, headers }
    //   )
    //   .subscribe((data) => (this.access_token = data.access_token));
    return this.api.registerLineToken(uuid,this.access_token);
  };
}
