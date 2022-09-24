import { WebAPICallResult } from '@slack/web-api'

export const errorText = 'An example error'
export const successPromise = (): Promise<WebAPICallResult> => Promise.resolve({ ok: true })
export const failedPromise = (): Promise<WebAPICallResult> => Promise.reject(new Error(errorText))
export const nonOkPromise = (): Promise<WebAPICallResult> => Promise.resolve({ ok: false })
