import { createClient } from 'redis';
import { Request, Response, NextFunction } from 'express';

interface IRedisConfig {
  username?: string;
  password?: string;
  url: string;
}

interface IShedderConfig {
  RedisConfig?: IRedisConfig;
  limit: number;
  RedisKey: string;
}

export const shedder = async (config: IShedderConfig) => {
  const redisKey = config.RedisKey || '/counter';
  return async (req: Request, res: Response, next: NextFunction) => {
    const client = createClient({ ...config.RedisConfig });
    await client.connect();
    let current = await client.get(redisKey);

    if (!current) {
      // Seems like redis isn't initialized with the key
      await client.set(redisKey, 0);
      current = '0';
    }
    if (config.limit <= parseInt(current as string)) {
      return res.status(429).send('Load was limited, please retry.');
    }

    // JS magic
    res.on('finish', async () => {
      await client.decr(redisKey);
    });

    await client.incr(redisKey);
    next();
  };
};
