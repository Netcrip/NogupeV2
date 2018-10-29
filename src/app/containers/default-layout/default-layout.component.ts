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
    
    
  
    this.cursos.getCursos().forEach(element => {
      element.forEach(dato => {
        
        navItems.push({name: dato.nombremateria ,url:'clase/'+dato.cursada , icon: 'icon-puzzle'},)
      });      
    });
   
    //console.log(v)
    
    //this.navItems= v;
    
    //navItems.push({""})
  }
  
  signOut(){
    this.auth.signOut();
  }


}
