import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FirebaseService, Invitation } from '../firebase.service';

@Component({
  selector: 'app-invitation-search',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './invitation-search.html',
  styleUrl: './invitation-search.scss',
})
export class InvitationSearch {
  email = '';
  loading = false;
  searched = false;
  invitation: Invitation | null = null;
  showModal = false;
  error = '';

  constructor(private firebase: FirebaseService) {}

  async search(): Promise<void> {
    if (!this.email.trim()) return;
    this.loading = true;
    this.searched = false;
    this.error = '';
    this.invitation = null;

    try {
      this.invitation = await this.firebase.searchInvitation(this.email);
      this.searched = true;
    } catch {
      this.error = 'An error occurred. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  openDownloadModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  async download(): Promise<void> {
    if (!this.invitation?.id) return;
    await this.firebase.incrementDownloadCount(this.invitation.id);
    this.invitation.downloadCount++;
    window.open(this.invitation.driveLink, '_blank');
    this.showModal = false;
  }
}
