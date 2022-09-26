export type SecretType = 'env' | 'aws-ssm' | 'aws-secrets'
export type SecretFn = (name: string, defaultValue?: string) => Promise<string>
export type SecretTypeMap = Record<SecretType, SecretFn>
