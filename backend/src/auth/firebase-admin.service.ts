import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  private app: admin.app.App;

  onModuleInit() {
    // Initialize Firebase Admin with Application Default Credentials
    // In production, this will use the service account from environment
    if (!admin.apps.length) {
      this.app = admin.initializeApp({
        projectId: 'valuebell-production',
      });
    } else {
      this.app = admin.apps[0]!;
    }
  }

  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    return admin.auth().verifyIdToken(idToken);
  }

  async getUser(uid: string): Promise<admin.auth.UserRecord> {
    return admin.auth().getUser(uid);
  }
}
