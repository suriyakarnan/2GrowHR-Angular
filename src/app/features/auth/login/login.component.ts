import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone:true,
  imports:[
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username: string = '';

  password: string = '';

  showPassword: boolean = false;

  // SLIDER DATA
  slides = [
  {
    website: 'saneforce',
    domain: '.com',
    websiteClass: 'saneforce-text',
    websiteColor: '#ff4d4f',
    buttonColor: '#ff4d4f',
    image: '/Assets/NewLoginPage/img/slider-san-pharma.png',
    title: 'SAN Pharma SFA',
    desc: 'Automate your Pharma business sales with SAN SFA!'
  },
  {
    website: 'saneforce',
    domain: '.com',
    websiteClass: 'saneforce-text',
    websiteColor: '#ff4d4f',
    buttonColor: '#ff4d4f',
    image: '/Assets/NewLoginPage/img/slider-san-zen.png',
    title: 'SAN ZEN',
    desc: 'Enhance your interaction rate with HCPs digitally'
  },
  {
    website: 'salesjump',
    domain: '.in',
    websiteClass: 'salesjump-text',
    websiteColor: '#1997CE ',
    buttonColor: '#1997CE ',
    image: '/Assets/NewLoginPage/img/slider-salesjump.png',
    title: 'SalesJump',
    desc: 'Manage your FMCG sales effectively with SalesJump'
  },
  {
    website: '2growhr',
    websiteClass: 'growhr-text',
    domain: '.com',
    websiteColor: 'linear-gradient(100deg, #0ab39c 0%, #405189 50%)',
    buttonColor: 'linear-gradient(100deg, #0ab39c 0%, #405189 50%)',
    image: '/Assets/NewLoginPage/img/slider-2growhr.png',
    title: '2GrowHR',
    desc: 'Effortlessly manage your HR and Payroll with 2GrowHR'
  },
  {
    website: 'twozo',
    websiteClass: 'twozo-text',
    domain: '.io',
    websiteColor: 'linear-gradient(100deg, #00cc61 0%, #004050 50%)',
    buttonColor: 'linear-gradient(100deg, #00cc61 0%, #004050 50%)',
    image: '/Assets/NewLoginPage/img/slider-twozo.png',
    title: 'Twozo CRM',
    desc: 'Simplify sales, track customers and streamline operations with Twozo'
  }
  
 
];

  previousIndex = 0;

  oldImageAnimation = '';
  newImageAnimation = '';

  currentIndex = 0;

  animationClass = '';

  imageAnimation = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  nextSlide() {

  this.previousIndex = this.currentIndex;

  this.oldImageAnimation = 'slide-out-left';

  this.currentIndex =
    (this.currentIndex + 1) % this.slides.length;

  this.newImageAnimation = 'slide-in-right';

  setTimeout(() => {

    this.oldImageAnimation = '';
    this.newImageAnimation = '';

  }, 700);

}

  prevSlide() {

  this.previousIndex = this.currentIndex;

  this.oldImageAnimation = 'slide-out-right';

  this.currentIndex =
    (this.currentIndex - 1 + this.slides.length)
    % this.slides.length;

  this.newImageAnimation = 'slide-in-left';

  setTimeout(() => {

    this.oldImageAnimation = '';
    this.newImageAnimation = '';

  }, 700);

}

  login() {

    const success =
      this.authService.login(
        this.username,
        this.password
      );

    if (success) {

      this.router.navigate(['/dashboard']);

    } else {

      alert('Invalid Username or Password');

    }

  }

}