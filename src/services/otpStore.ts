export interface OtpEntry {
  otp: string;
  expiresAt: number;
}

export interface IOtpStore {
  set(email: string, otp: string, ttlSeconds: number): void;
  get(email: string): string | null;
  delete(email: string): void | null;
  has(email: string): boolean | null;
}

class OtpStore implements IOtpStore {
  private static instance: OtpStore;
  private store: Map<string, OtpEntry>;

  private constructor() {
    this.store = new Map<string, OtpEntry>();
  }

  public static getInstance(): OtpStore {
    if (!OtpStore.instance) {
      OtpStore.instance = new OtpStore();
    }
    return OtpStore.instance;
  }

  public set(email: string, otp: string, ttlSeconds = 900): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.store.set(email, { otp, expiresAt });
  }

  public get(email: string): string | null {
    const entry = this.store.get(email);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(email);
      return null;
    }

    return entry.otp;
  }

  public delete(email: string): void {
    this.store.delete(email);
  }

  public has(email: string): boolean {
    return this.get(email) !== null;
  }
}

export default OtpStore;
