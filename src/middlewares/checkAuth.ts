import axios from 'axios';

import { AUTH_URL } from '@server/config';
import { Request, Response, NextFunction } from 'express';

export const requireUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization;
    if (!token) throw Error('Not Authorized');
    const { data } = await axios.get(`${AUTH_URL}/auth/check-auth`, {
      headers: {
        authorization: token,
      },
    });
    if (!data.success) throw Error('Not Authorized');
    res.locals.user = data.user;
    next();
  } catch (error: unknown) {
    if (typeof error === 'string') {
      res.status(401).send({ success: false, error: error || 'Not Authorized' });
    }
    if (error instanceof Error) {
      res.status(401).send({ success: false, error: error.message || 'Not Authorized' });
    }
  }
};
