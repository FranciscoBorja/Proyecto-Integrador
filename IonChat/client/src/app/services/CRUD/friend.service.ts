import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { environment } from './../../../environments/environment';
import { Friend } from './../../models/Friend';

@Injectable({
   providedIn: 'root'
})
export class FriendService {

   url = environment.api + 'friend/';
   options = new RequestOptions();

   constructor(private http: Http) {
      this.options.headers = new Headers();
      this.options.headers.append('api_token', sessionStorage.getItem('api-token'));
   }

   get(id?: number): Promise<any> {
      if (typeof id === 'undefined') {
         return this.http.get(this.url, this.options).toPromise()
         .then( r => {
            return r.json();
         }).catch( error => { return error.json(); });
      }
      return this.http.get(this.url + '?id=' + id.toString(), this.options).toPromise()
      .then( r => {
         return r.json();
      }).catch( error => { return error.json(); });
   }

   get_paginate(size: number, page: number): Promise<any> {
      return this.http.get(this.url + 'paginate?size=' + size.toString() + '&page=' + page.toString(), this.options).toPromise()
      .then( r => {
         return r.json();
      }).catch( error => { return error.json(); });
   }

   delete(id: number): Promise<any> {
      return this.http.delete(this.url + '?id=' + id.toString(), this.options).toPromise()
      .then( r => {
         return r.json();
      }).catch( error => { return error.json(); });
   }

   post(friend: Friend): Promise<any> {
      return this.http.post(this.url,friend, this.options).toPromise()
      .then( r => {
         return r.json();
      }).catch( error => { return error.json(); });
   }

   put(friend: Friend): Promise<any> {
      return this.http.put(this.url, JSON.stringify(friend), this.options).toPromise()
      .then( r => {
         return r.json();
      }).catch( error => { return error.json(); });
   }

}