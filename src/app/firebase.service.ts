import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getFirestore,
  Firestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  increment,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import {
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';

export interface Invitation {
  id?: string;
  email: string;
  driveLink: string;
  downloadCount: number;
  createdAt: Timestamp;
}

const firebaseConfig = {
  apiKey: 'AIzaSyCoau2uv_WJkL5NWnklG_t89nPlGpNkLY0',
  authDomain: 'ideea-2026.firebaseapp.com',
  projectId: 'ideea-2026',
  storageBucket: 'ideea-2026.firebasestorage.app',
  messagingSenderId: '994040544307',
  appId: '1:994040544307:web:f44b5c433afbc3e7313746',
  measurementId: 'G-6BXZM40D8T',
};

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private app: FirebaseApp;
  private db: Firestore;
  private auth: Auth;

  user$ = new BehaviorSubject<User | null>(null);

  constructor() {
    this.app = initializeApp(firebaseConfig);
    getAnalytics(this.app);
    this.db = getFirestore(this.app);
    this.auth = getAuth(this.app);

    onAuthStateChanged(this.auth, (user) => {
      this.user$.next(user);
    });
  }

  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  isLoggedIn(): boolean {
    return this.user$.value !== null;
  }

  async searchInvitation(email: string): Promise<Invitation | null> {
    const q = query(
      collection(this.db, 'invitations'),
      where('email', '==', email.toLowerCase().trim())
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const docSnap = snapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() } as Invitation;
  }

  async incrementDownloadCount(invitationId: string): Promise<void> {
    const ref = doc(this.db, 'invitations', invitationId);
    await updateDoc(ref, { downloadCount: increment(1) });
  }

  async getAllInvitations(): Promise<Invitation[]> {
    const q = query(collection(this.db, 'invitations'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Invitation);
  }

  async addInvitation(email: string, driveLink: string): Promise<void> {
    await addDoc(collection(this.db, 'invitations'), {
      email: email.toLowerCase().trim(),
      driveLink,
      downloadCount: 0,
      createdAt: Timestamp.now(),
    });
  }

  async deleteInvitation(id: string): Promise<void> {
    await deleteDoc(doc(this.db, 'invitations', id));
  }
}
