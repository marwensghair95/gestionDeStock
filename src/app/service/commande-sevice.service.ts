import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommandeSeviceService {
  baseUrl="/api";

  constructor(private  httpClient: HttpClient) { }

  addCommande(cl){
    this.httpClient.post<any>(this.baseUrl+'commandes/addCommande',cl).subscribe(
      (msg) => {
        console.log(msg),
        location.reload()
      },
      (error) => console.log(error)
    );
  }
  getCommande() {
    const produit = this.httpClient.get(this.baseUrl + 'commandes/allcommande');
    return produit;
  }

  deleteCommande(id) {
    this.httpClient.delete(this.baseUrl + 'commandes/deletCommande/' + id).subscribe(
      (msg) => {
        console.log(msg),
          location.reload()
      },
      (error) => console.log(error)

    );
  }
  getCommandebyid(id) {
    const user = this.httpClient.get(this.baseUrl + 'commandes/getCommandeById/' + id);
    return user;
  }
  updateProduit(id, client) {
    this.httpClient.put(this.baseUrl + 'produits/updateUser/' + id, client).subscribe(
      (msg) => {
        console.log(msg),
          location.reload()
      },
      (error) => console.log(error)
    );
  }
  validation(id){
    this.httpClient.put(this.baseUrl+'commandes/valideCommabde/'+id,"").subscribe(
      (msg) => {
        console.log(msg),
        location.reload()
      },
      (error) => console.log(error)
    );
  }
}
