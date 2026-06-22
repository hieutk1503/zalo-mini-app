import { authorize, getAccessToken, getUserInfo } from 'zmp-sdk/apis';
import { ZALO_DEV_MODE } from './config';

export type ZaloSession = {
  id: string;
  name: string;
  phone: string;
  accessToken: string;
  avatarUrl?: string;
};

export async function initZaloSession(): Promise<ZaloSession | null> {
  try {
    await authorize({ scopes: ['scope.userInfo'] });
    const accessToken = await getAccessToken();
    const userInfoResult = await getUserInfo({});
    const userInfo =
      'userInfo' in userInfoResult ? userInfoResult.userInfo : userInfoResult;

    if (!accessToken || !userInfo?.id) return null;

    return {
      id: userInfo.id,
      name: userInfo.name?.trim() || 'Công dân Zalo',
      phone: '',
      accessToken,
      avatarUrl: userInfo.avatar,
    };
  } catch (error) {
    console.warn('Zalo SDK session unavailable', error);
    return null;
  }
}

export function isZaloDevMode() {
  return ZALO_DEV_MODE || import.meta.env.DEV;
}
