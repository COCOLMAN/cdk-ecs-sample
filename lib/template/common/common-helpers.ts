export interface ICommonHelper {
    findEnumType<T>(enumType: T, target: string): T[keyof T];
    exportOutput(key: string, value: string, prefixEnable?: boolean, prefixCustomName?: string): void;
}