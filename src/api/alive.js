/**
 * @file Alive API
 * @description サーバー存活状態確認用API
 */

import { fetchStream } from '@/utils/fetch';

export async function checkAlive(onData) {
  return fetchStream({ action: '/common/alive', data: {}, onData, disableDance: true });
}
