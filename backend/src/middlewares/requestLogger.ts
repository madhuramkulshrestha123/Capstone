import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  const { method, url, ip } = req;
  const userAgent = req.get('User-Agent') || 'Unknown';

  console.log(`🔵 ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`);

  // Log response time and status code after response is sent
  const originalSend = res.send;
  res.send = function(body: any) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    
    const statusEmoji = statusCode >= 400 ? '🔴' : statusCode >= 300 ? '🟡' : '🟢';
    console.log(`${statusEmoji} ${method} ${url} - ${statusCode} - ${duration}ms`);
    
    return originalSend.call(this, body);
  };

  next();
};