import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { defineSecret } from 'firebase-functions/params';

export const verifyCaptcha = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const recaptchaSecret = defineSecret('RECAPTCHA_SECRET_KEY');
  const { captchaToken } = req.body;

  if (process.env.NODE_ENV !== 'production') {
    console.warn('Skipping CAPTCHA verification in non-production environment');
    return next();
  }

  if (!captchaToken) {
    return res.status(400).json({ message: 'Missing CAPTCHA token' });
  }

  try {
    const secretKey = recaptchaSecret.value(); //process.env.RECAPTCHA_DEVELOPMENT_SECRET_KEY;
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      new URLSearchParams({
        secret: secretKey!,
        response: captchaToken,
      })
    );

    const { success, score } = response.data;

    if (!success || (score !== undefined && score < 0.5)) {
      return res.status(403).json({ message: 'CAPTCHA verification failed' });
    }

    next();
  } catch (error) {
    console.error('Error verifying CAPTCHA:', error);
    return res.status(500).json({ message: 'CAPTCHA verification error' });
  }
};
