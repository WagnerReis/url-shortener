import { EnvService } from '@env/env';
import { Request } from 'express';

export function buildShortUrl(
  shortCode: string,
  req: Request,
  envService: EnvService,
): string {
  let baseUrl = envService.get('BASE_URL') as string | undefined;
  if (!baseUrl) {
    const protocol = req.protocol;
    const host = req.get('host');
    baseUrl = `${protocol}://${host}`;
  }
  return `${baseUrl}/${shortCode}`;
}
