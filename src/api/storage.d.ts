export declare function loadStorageValues(): Promise<Response>;

/**
 * 指定されたキーと値をサーバーの /storage/save エンドポイントへ POST します。
 *
 * @param key   保存対象のキー
 * @param value 保存対象の値
 * @returns     fetch が返す Promise<Response>
 */
export declare function saveToStorage(key: string, value: any): Promise<Response>;
