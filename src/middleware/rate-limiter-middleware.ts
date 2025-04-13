// src/middleware/rate-limiter.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  private ipMap = new Map<string, { count: number; firstRequestTime: number }>();

  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;

    // Ensure ip is a valid string
    if (!ip) {
      return res.status(400).json({
        message: 'IP address could not be determined.',
      });
    }

    const currentTime = Date.now();
    const minute = 60 * 1000; // 1 minute in milliseconds
    const allowedRequests = 3;

    // Get the user data from the Map for the given IP
    let userData = this.ipMap.get(ip);

    if (userData) {
      // If the first request was within the last minute, count the request
      if (currentTime - userData.firstRequestTime < minute) {
        if (userData.count >= allowedRequests) {
          return res.status(429).json({
            message: 'Too many requests. Please try again later.',
          });
        } else {
          userData.count++;
        }
      } else {
        // If the request is from a different minute, reset the count and timestamp
        this.ipMap.set(ip, { count: 1, firstRequestTime: currentTime });
      }
    } else {
      // If the IP is not in the map, add it with initial data
      this.ipMap.set(ip, { count: 1, firstRequestTime: currentTime });
    }

    next();
  }
}
