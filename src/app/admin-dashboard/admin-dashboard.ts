import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FirebaseService, Invitation } from '../firebase.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard implements OnInit {
  invitations: Invitation[] = [];
  loading = true;

  showAddForm = false;
  newEmail = '';
  newDriveLink = '';
  addLoading = false;
  addError = '';

  constructor(
    private firebase: FirebaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.firebase.isLoggedIn()) {
      this.router.navigate(['/admin']);
      return;
    }
    this.loadInvitations();
  }

  async loadInvitations(): Promise<void> {
    this.loading = true;
    try {
      this.invitations = await this.firebase.getAllInvitations();
    } finally {
      this.loading = false;
    }
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    this.newEmail = '';
    this.newDriveLink = '';
    this.addError = '';
  }

  async addInvitation(): Promise<void> {
    if (!this.newEmail.trim() || !this.newDriveLink.trim()) {
      this.addError = 'Both fields are required.';
      return;
    }
    this.addLoading = true;
    this.addError = '';

    try {
      await this.firebase.addInvitation(this.newEmail, this.newDriveLink);
      this.showAddForm = false;
      this.newEmail = '';
      this.newDriveLink = '';
      await this.loadInvitations();
    } catch {
      this.addError = 'Failed to add invitation. Please try again.';
    } finally {
      this.addLoading = false;
    }
  }

  async deleteInvitation(inv: Invitation): Promise<void> {
    if (!inv.id) return;
    try {
      await this.firebase.deleteInvitation(inv.id);
      this.invitations = this.invitations.filter((i) => i.id !== inv.id);
    } catch {
      // silently fail
    }
  }

  async logout(): Promise<void> {
    await this.firebase.logout();
    this.router.navigate(['/']);
  }
}
