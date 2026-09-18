import redis from './redis';

export async function saveTempData(token: string, data: Record<string, unknown>, ttl: number = 600) {
  try {
    await redis.setex(`regist:${token}`, ttl, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save temp data:', error);
    return false;
  }
}

export async function getTempData(token: string) {
  try {
    const data = await redis.get(`regist:${token}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to get temp data:', error);
    return null;
  }
}

export async function deleteTempData(token: string) {
  try {
    await redis.del(`regist:${token}`);
    return true;
  } catch (error) {
    console.error('Failed to delete temp data:', error);
    return false;
  }
}
