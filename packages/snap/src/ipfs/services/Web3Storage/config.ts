import dotenv from 'dotenv';

dotenv.config();

const config = {
  url: process.env.WEB3STORAGE_URL ?? 'https://api.web3.storage',
  token:
    process.env.WEB3STORAGE_TOKEN ??
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDA0ZkNlODE4ZTJmMzlmODkwNUUwMWRFMzU5QWFBMDg0Njk3NDVlOUEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODc4ODk5NTI1OTYsIm5hbWUiOiJJUEZTIFNuYXAgRGV2In0.tBgfBSWRjKb2fYHVUtGzw0zIeqwqwFzWjT5InTIgZ8E',
};

export default config;
