import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {CursosService} from '../../servicios/cursos.service';
import {Cursos} from '../../interface/cursos';


@Component({
  templateUrl: 'cursos.component.html',
  styleUrls: ['./cursos.component.scss']
})
export class CursosComponent implements OnInit {
    
    cursos: Cursos[];
    editState: boolean = false;
    cursoToEdit: Cursos;
    constructor(private cursoService: CursosService, private router: Router) { }

   
    ngOnInit() {
      this.cursoService.getCursos().subscribe(cursos => {
        this.cursos = cursos;
      });
    }
    /*editCurso(event, curso: CursosInterface) {
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
     this.router.navigate(['clase/',s])
    }
}