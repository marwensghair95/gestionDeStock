import { ChangeDetectorRef, Component, OnInit, Pipe } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientServiceService } from 'app/service/client-service.service';
import { CommandeSeviceService } from 'app/service/commande-sevice.service';
import { ProduitServiceService } from 'app/service/produit-service.service';
import { umask } from 'process';

@Pipe({
  name: 'stringFilterBy'
})

@Component({
  selector: 'app-add-commande',
  templateUrl: './add-commande.component.html',
  styleUrls: ['./add-commande.component.css']
})
export class AddCommandeComponent implements OnInit {
  produits: Array<any>;
  clients: Array<any>;
  commandeForm: FormGroup;
  commande;

  total:number=0;
  constructor(private _fb: FormBuilder,private produitServices: ProduitServiceService ,
    private ref: ChangeDetectorRef,  private ClientServices: ClientServiceService,
    private CommandeServices: CommandeSeviceService) {
    this.createForm();
  }

  ngOnInit(){
    // this.commande= new FormGroup({
     
    // });
    this.commandeForm = this._fb.group({
      produitRows: this._fb.array([this.initItemRows()]) ,
      refCommande : new FormControl('', [Validators.required]),
      idClient: new FormControl(),
      montant_total:new FormControl(),
      date_commande:new FormControl(Date.now()),
      valide:new FormControl(false)
    });
    this.produitServices.getProduit().subscribe((response:any) => {
      this.produits= response.produit ;
   })  

   this.ClientServices.getClient().subscribe((response: any) => {
    this.clients = response.user;
  })
   this.ref.detectChanges();
 
  
  }
  save(){
   this.commandeForm.patchValue({'montant_total':this.total})
   
    console.log(this.commandeForm.value);

    // this.submited = true;
    if (this.commandeForm.invalid) {
      return;
    }
    this.CommandeServices.addCommande(this.commandeForm.value);
  }
  

 
  createForm(){
    this.commandeForm = this._fb.group({
      produitRows: this._fb.array([])
    });
    this.commandeForm.setControl('produitRows', this._fb.array([]));
  
    
  }

  get produitRows(): FormArray {
    return this.commandeForm.get('produitRows') as FormArray;
  }

  addNewRow(){
   const control = <FormArray>this.commandeForm.controls['produitRows'];
   control.push(this.initItemRows());
  }
  deleteRow(index: number) {
    const control = <FormArray>this.commandeForm.controls['produitRows'];
    control.removeAt(index);
}

  onSelectionChange(e,i) {
    const prix=this.produits.find(element => element._id=== e.source.value);
    this.produitRows.at(i).patchValue({prixVente:prix.prixVente});
    this.produitRows.at(i).patchValue({qty:0});
    this.produitRows.at(i).patchValue({nameProduit:prix.nameProduit});
  }

  saverange(e,i){
   const prix= this.commandeForm.value.produitRows[i].prixVente
    this.produitRows.at(i).patchValue({montant:e*prix});

   this.total+=e*prix
   
  //   this.produitRows.controls.forEach((control) => {
  //     control.valueChanges.subscribe(() =>{
  //     const   sum=parseInt(control.value['montant']);
  //        this.total+=sum;   
  //     })
   
  // })
  }

  initItemRows() {
    return this._fb.group({
        //list all your form controls here, which belongs to your form array
        nameProduit: [''],
        id_produit:[''],
        qty:[''],
        prixVente:[''],
        montant:['']

    });
}
transform(arr: any[], searchText: string,fieldName?:string): any[] {
  if (!arr) return [];
  if (!searchText) return arr;
  searchText = searchText.toLowerCase();
  return arr.filter((it:any) => {
    if(typeof it == 'string'){
      return it.toLowerCase().includes(searchText);
    }else if(typeof it == 'number'){
      return it.toString().toLowerCase().includes(searchText);
    }else{
      return it[fieldName].toLowerCase().includes(searchText);
    }
    
  });
}


}