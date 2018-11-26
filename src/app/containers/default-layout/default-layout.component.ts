import { Component, OnInit, AfterViewChecked, OnChanges  } from '@angular/core';
//import { navItems } from './../../_nav';
import {AuthService} from '../../servicios/auth.service';
import {ListaService} from '../../servicios/lista.service'
import { Cursos } from '../../interface/cursos';
import { navItems } from '../../_nav';
import swal from 'sweetalert2';
import { Inscripciones } from '../../interface/inscripciones';
import { Router } from '@angular/router';



@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit  {
  navItem= navItems
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;
  public navCursos=[];
  cur: Inscripciones[];
  v:Object;
  
  constructor(public auth:AuthService,private curso:ListaService, private router:Router) {
    
    this.actualizarcursos();

    
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });
    
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
      if(dato.estado=="activa"){
        this.v['children'].push({name: dato.materia,url:'clase/'+dato.cursadaid, icon: 'fa '+dato.img});
      }      
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
  async cambiarcontra(){
     this.auth.user.subscribe(e=>{
      swal(
        'Se ha enviado un correo para cambiar contraseña a:',
        e.email,
        'info'
      )
      this.auth.resetPassword(e.email);
     })
    
  }


}
