// ============================================================
// FILE: src/app/features/auth/login/login.component.ts
// ============================================================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username: string    = '';
  password: string    = '';
  showPassword        = false;
  isLoading           = false;
  errorMessage        = '';

  // ── SLIDER DATA
  slides = [
    {
      website: 'saneforce',
      domain: '.com',
      websiteClass: 'saneforce-text',
      buttonColor: '#ff4d4f',
      image: '/Assets/NewLoginPage/img/slider-san-pharma.png',
      title: 'SAN Pharma SFA',
      desc: 'Automate your Pharma business sales with SAN SFA!'
    },
    {
      website: 'saneforce',
      domain: '.com',
      websiteClass: 'saneforce-text',
      buttonColor: '#ff4d4f',
      image: '/Assets/NewLoginPage/img/slider-san-zen.png',
      title: 'SAN ZEN',
      desc: 'Enhance your interaction rate with HCPs digitally'
    },
    {
      website: 'salesjump',
      domain: '.in',
      websiteClass: 'salesjump-text',
      buttonColor: '#1997CE',
      image: '/Assets/NewLoginPage/img/slider-salesjump.png',
      title: 'SalesJump',
      desc: 'Manage your FMCG sales effectively with SalesJump'
    },
    {
      website: '2growhr',
      domain: '.com',
      websiteClass: 'growhr-text',
      buttonColor: 'linear-gradient(100deg, #0ab39c 0%, #405189 50%)',
      image: '/Assets/NewLoginPage/img/slider-2growhr.png',
      title: '2GrowHR',
      desc: 'Effortlessly manage your HR and Payroll with 2GrowHR'
    },
    {
      website: 'twozo',
      domain: '.io',
      websiteClass: 'twozo-text',
      buttonColor: 'linear-gradient(100deg, #00cc61 0%, #004050 50%)',
      image: '/Assets/NewLoginPage/img/slider-twozo.png',
      title: 'Twozo CRM',
      desc: 'Simplify sales, track customers and streamline operations with Twozo'
    }
  ];

  previousIndex    = 0;
  currentIndex     = 0;
  oldImageAnimation = '';
  newImageAnimation = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // ──────────────────────────────────────────────────────────
  // SLIDER — NEXT
  // ──────────────────────────────────────────────────────────
  nextSlide() {
    this.previousIndex    = this.currentIndex;
    this.oldImageAnimation = 'slide-out-left';
    this.currentIndex     = (this.currentIndex + 1) % this.slides.length;
    this.newImageAnimation = 'slide-in-right';
    setTimeout(() => {
      this.oldImageAnimation = '';
      this.newImageAnimation = '';
    }, 700);
  }

  // ──────────────────────────────────────────────────────────
  // SLIDER — PREV
  // ──────────────────────────────────────────────────────────
  prevSlide() {
    this.previousIndex    = this.currentIndex;
    this.oldImageAnimation = 'slide-out-right';
    this.currentIndex     = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.newImageAnimation = 'slide-in-left';
    setTimeout(() => {
      this.oldImageAnimation = '';
      this.newImageAnimation = '';
    }, 700);
  }

  // ──────────────────────────────────────────────────────────
  // LOGIN — calls AuthService → API → stores token → navigate
  // ──────────────────────────────────────────────────────────
  login() {

    // Validation
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Please enter username and password.';
      return;
    }

    this.isLoading    = true;
    this.errorMessage = '';
console.log("checking1 ${this.username} ${this.password}");
    this.authService.login(this.username, this.password).subscribe({

      next: (response) => {
console.log("checking2 ${this.username} password ${this.password}");
        this.isLoading = false;

         console.log('API RESPONSE:', response); // ← add this

        if (response.success && response.Data?.length > 0) {
          // ✅ Login success → navigate to dashboard
          this.router.navigate(['/dashboard']);
        } else {
          // ❌ API returned success: false
          this.errorMessage = response.BlockMsg || 'Invalid username or password.';
        }

      },

      error: (err) => {
        console.log("checking3 ${err}");
        this.isLoading    = false;
        this.errorMessage = err?.message || 'Something went wrong. Please try again.';
      }

    });

  }

}