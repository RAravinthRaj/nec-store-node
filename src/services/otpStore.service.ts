/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import { OtpModel } from '../models/Otp.model';

export interface IOtpStore {
  set(email: string, otp: string, ttlSeconds?: number): Promise<void>;
  get(email: string): Promise<string | null>;
  delete(email: string): Promise<void>;
  has(email: string): Promise<boolean>;
}

export class OtpStore implements IOtpStore {
  private static instance: OtpStore;

  private constructor() {}

  public static getInstance(): OtpStore {
    if (!OtpStore.instance) {
      OtpStore.instance = new OtpStore();
    }
    return OtpStore.instance;
  }

  private getExpiryDate(ttlSeconds: number): Date {
    return new Date(Date.now() + ttlSeconds * 1000);
  }

  public async set(email: string, otp: string, ttlSeconds = 900): Promise<void> {
    await OtpModel.findOneAndUpdate(
      { email },
      {
        otp,
        expiresAt: this.getExpiryDate(ttlSeconds),
      },
      { upsert: true, new: true },
    );
  }

  public async get(email: string): Promise<string | null> {
    const record = await OtpModel.findOne({ email });

    if (!record) return null;

    if (record.expiresAt < new Date()) {
      await OtpModel.deleteOne({ email });
      return null;
    }

    return record.otp;
  }

  public async delete(email: string): Promise<void> {
    await OtpModel.deleteOne({ email });
  }

  public async has(email: string): Promise<boolean> {
    const record = await OtpModel.exists({
      email,
      expiresAt: { $gt: new Date() },
    });
    return Boolean(record);
  }
}
