import type { Immutable } from 'immer'

import type { XkcdInfo } from '@/eggs/xkcd/contracts/api-response'
import type { XKCD_REDUCER_KEY } from '@/eggs/xkcd/reducer'

export enum XkcdLoadingState {
  NEVER = 'NEVER',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface XkcdAwareState {
  [XKCD_REDUCER_KEY]: XkcdState
}

export type XkcdState = Immutable<{
  info?: XkcdInfo
  error?: string
  loadingState: XkcdLoadingState
}>
