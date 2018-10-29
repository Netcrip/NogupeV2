import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router,NavigationEnd } from '@angular/router';
import {CursosService} from '../../servicios/cursos.service';
import {Cursos} from '../../interface/cursos';


@Component({
  templateUrl: 'cursos.component.html',
  styleUrls: ['./cursos.component.scss']
})
export class CursosComponent implements OnInit, AfterViewChecked {
    
    cursos: Cursos[];
    editState: boolean = false;
    cursoToEdit: Cursos;
    constructor(private cursoService: CursosService, private router: Router) {
      this.router.routeReuseStrategy.shouldReuseRoute = function(){
        return false;
     }

     this.router.events.subscribe((evt) => {
        if (evt instanceof NavigationEnd) {
           // trick the Router into believing it's last link wasn't previously loaded
           this.router.navigated = false;
           // if you need to scroll back to top, here is the right place
           window.scrollTo(0, 0);
        }
    });
     }

   
    ngOnInit() {
      this.cursoService.getCursos().subscribe(cursos => {
        this.cursos = cursos;
      });
    }
    ngAfterViewChecked() {
      // ...
      this.cursoService.start();
    }
    
    /*
    editCurso(event, curso: CursosInterface) {
      this.editState = true;
      this.cursoToEdit = curso;
    }
    onUdpdateCurso(curso: CursosInterface) {
      this.cursoService.updateCurso(curso);
      this.clearState();
    }
    deleteCurso(event, curso: CursosInterface) {
      this.cursoService.deleteCurso(curso);
      this.clearState();
    }
    clearState() {
      this.editState = false;
      this.cursoToEdit = null;
    }*/
    irclase(s){
     console.log(s)
     this.router.navigate(['nogupe/clase/',s])
    }
}