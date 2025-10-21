/*
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import { Store } from 'express-rate-limit';

declare module 'rate-limit-mongo' {
  interface RateLimitMongoOptions {
    uri: string;
    collectionName: string;
    expireTimeMs?: number;
    errorHandler?: (err: any) => void;
  }

  class RateLimitMongo implements Store {
    constructor(options: RateLimitMongoOptions);
    incr(key: string, cb: (err?: any, hits?: number, resetTime?: Date) => void): void;
    decrement(key: string): void;
    resetKey(key: string): void;
    resetAll(): void;
  }

  export default RateLimitMongo;
}
