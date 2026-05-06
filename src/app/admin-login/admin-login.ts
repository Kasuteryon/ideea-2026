import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.scss',
})
export class AdminLogin {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private firebase: FirebaseService,
    private router: Router
  ) {}

  async login(): Promise<void> {
    if (!this.email || !this.password) return;
    this.loading = true;
    this.error = '';

    try {
      await this.firebase.login(this.email, this.password);
      this.router.navigate(['/admin/dashboard']);
    } catch {
      this.error = 'Invalid credentials. Please try again.';
    } finally {
      this.loading = false;
    }
  }
}
