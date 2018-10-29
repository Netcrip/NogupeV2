import { Component, Input } from '@angular/core';
import { navItems } from './../../_nav';
import {AuthService} from '../../servicios/auth.service';
import {ListaService} from '../../servicios/lista.service'


@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;
  public navCursos=[];
  
  constructor(public auth:AuthService,private cursos:ListaService) {

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });
    
    let v:Object={name: 'Materias', url: 'cursos', icon: 'icon-puzzle', children: [], badge: {
      variant: 'info',
      text: 'NEW'
    }}
    this.cursos.getCursos().forEach(element => {
      element.forEach(dato => {        
        v['children'].push({name: dato.nombremateria,url:'clase/'+dato.cursada, icon: 'fa '+dato.imgenurl});
      });     
      navItems.push(<any>v) 
    });
    
  }
  
  signOut(){
    this.auth.signOut();
  }


}
