import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {

  loggedIn = false;

  user$: Observable<any>;
  public uid: string;

  constructor(
    private afAuth: AngularFireAuth,
    public authService: AuthService) { }

  ngOnInit() {
  }

}
