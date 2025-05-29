/*
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import axios from 'axios';
import { config } from '../config/config';

export class ImageBucketService {
  private static instance: ImageBucketService;

  static getInstance(): ImageBucketService {
    if (!ImageBucketService.instance) {
      ImageBucketService.instance = new ImageBucketService();
    }
    return ImageBucketService.instance;
  }

  async uploadBase64Image(base64Image: string): Promise<string> {
    const base64 = base64Image.split(',')[1];
    const form = new URLSearchParams();
    form.append('image', base64);

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${config.imageApiKey}`,
      form.toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    return response?.data?.data?.image?.url;
  }

  isValidBase64Image(base64: string): boolean {
    const regex = /^data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=]+={0,2}$/;
    return regex.test(base64);
  }
}
