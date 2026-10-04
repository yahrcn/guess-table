import type { NextFunction, Request, Response } from 'express';

/**
 * Basic Auth gate for the admin page/API. Checked against ADMIN_PASSWORD on every
 * request rather than a session — simplest thing that works for a single shared password.
 */
export function adminAuth(req: Request, res: Response, next: NextFunction): void {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    res.status(503).send('ADMIN_PASSWORD не задан на сервере — админка отключена.');
    return;
  }

  const header = req.headers.authorization;
  if (header?.startsWith('Basic ')) {
    const decoded = Buffer.from(header.slice('Basic '.length), 'base64').toString('utf8');
    const separatorIndex = decoded.indexOf(':');
    const suppliedPassword = separatorIndex === -1 ? decoded : decoded.slice(separatorIndex + 1);
    if (suppliedPassword === password) {
      next();
      return;
    }
  }

  res.set('WWW-Authenticate', 'Basic realm="admin"');
  res.status(401).send('Требуется авторизация.');
}
