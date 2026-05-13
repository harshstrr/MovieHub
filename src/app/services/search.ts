import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../api/apiEndpoints';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Service {
  constructor(private http: HttpClient) {}

  search(query: string): Observable<any> {
    return this.http.get(API_ENDPOINTS.search(query));
  }
  getDetail(type: string, id: string | number) {
  return this.http.get(
    API_ENDPOINTS.itemById(type, id)
  );
}
getStream(type: string, id: string | number) {
  return this.http.get(
    API_ENDPOINTS.Stream(type, id)
  );
}
getTrending( type: string , limit: number) {
  return this.http.get(
    API_ENDPOINTS.trending(type , limit)
  );
}

getRecent( contentType: string , limit:number) {
  return this.http.get(
    API_ENDPOINTS.recent(contentType,limit)
  );
}

gotoCollection(collection: string , limit: number) {
  return this.http.get(
    API_ENDPOINTS.collection(collection , limit)
  );
}

getGenres(genres: string , limit: number) {
  return this.http.get(
    API_ENDPOINTS.Plateform(genres , limit)
  );
}


}