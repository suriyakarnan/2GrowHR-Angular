import { Injectable } from '@angular/core';

import { Router } from '@angular/router';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router:Router
  ) { }

  // LOGIN
  login(username:string,password:string){

    if(username === 'admin' && password === 'admin'){

      const user:User = {

        id:1,

        username:'admin',

        email:'admin@gmail.com',

        role:'HR Admin',

        token:'123456789',

        profile:'assets/images/avatar.png'

      };

      localStorage.setItem(
        'user',
        JSON.stringify(user)
      );

      return true;

    }

    return false;

  }

  // LOGOUT
  logout(){

    localStorage.removeItem('user');

    this.router.navigate(['']);

  }

  // CHECK LOGIN
  isLoggedIn():boolean{

    return !!localStorage.getItem('user');

  }

  // GET USER
  getUser():User{

    return JSON.parse(
      localStorage.getItem('user') || '{}'
    );

  }

}