import { IPFSAbstract } from '../../IPFSAbstract';
import config from './config';

export class Web3StorageService extends IPFSAbstract {
  async put(data: string): Promise<string> {
    const blob = new Blob([data], { type: 'application/json' });
    const files = new File([blob], 'data.txt');
    const formData = new FormData();
    formData.append('file', files);
    const response = await fetch(`${config.url}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.token}`,
        'Content-Type': 'Content-Type: multipart/form-data',
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error('failed to upload');
    }
    return await response.json();
  }

  async get(hash: string): Promise<string> {
    const response = await fetch(`${config.url}/car/${hash}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${config.token}`,
      },
    });
    if (!response.ok) {
      throw new Error('failed to get');
    }
    const file = await response.blob();
    if (!file) {
      throw new Error('file not found');
    }
    const data = await file.text();
    return data;
  }
}
