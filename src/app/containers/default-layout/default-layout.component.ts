import { Component, OnInit, AfterViewChecked  } from '@angular/core';
//import { navItems } from './../../_nav';
import {AuthService} from '../../servicios/auth.service';
import {ListaService} from '../../servicios/lista.service'
import { Cursos } from '../../interface/cursos';
import { navItems } from '../../_nav';



@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit, AfterViewChecked  {
  navItem= navItems
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;
  public navCursos=[];
  cur: Cursos[];
  v:Object;
  
  constructor(public auth:AuthService,private curso:ListaService) {
    
    this.actualizarcursos();

    
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });
    
  }
  ngAfterViewChecked(){

  }
  ngOnInit(){

  }

  actualizarcursos(){
    this.curso.getCursos().forEach(element => {
      this.v={name: 'Materias', url: 'cursos', icon: 'icon-puzzle', children: [], badge: {
        variant: 'info',
        text: 'NEW'
      }}
      this.navItem.splice(1);
   
      element.forEach(dato => {        
       this.v['children'].push({name: dato.nombremateria,url:'clase/'+dato.cursada, icon: 'fa '+dato.imgenurl});
      });     
      
      this.navItem.push(<any>this.v) 
      
    });
   
    this.curso.getCursos().subscribe(cursos => {
      this.cur = cursos;
    });
  }
  Linkfacebook(){
    this.auth.linkface();
  }
  Linkgoogle(){
    this.auth.linkgoogle();
  }
  unLinkfacebook(){
    this.auth.unLinkfacebook();
  }

  unLinkgoogle() {
   this.auth.unLinkgoogle();
  }
  signOut(){
    this.auth.signOut();
  }


}
