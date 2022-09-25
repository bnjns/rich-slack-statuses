export type ConfigType = 'env'
export type ConfigFn = (name: string, defaultValue?: string) => Promise<string>
export type ConfigTypeMap = Record<ConfigType, ConfigFn>
