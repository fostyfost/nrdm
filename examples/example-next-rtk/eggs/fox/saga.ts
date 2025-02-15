import { call, put, select, takeLatest } from 'redux-saga/effects'

import type { FoxResponse } from '@/eggs/fox/contracts/api-response'
import { FoxLoadingState } from '@/eggs/fox/contracts/state'
import { errorSelector } from '@/eggs/fox/selectors'
import { FoxPublicAction, FoxReducerAction } from '@/eggs/fox/slice'
import { fetchAsJson } from '@/utils/fetch-as-json'

function* loadFoxWorker() {
  yield put(FoxReducerAction.setLoadingState(FoxLoadingState.LOADING))

  const error: ReturnType<typeof errorSelector> = yield select(errorSelector)

  if (error) {
    yield put(FoxReducerAction.setError(undefined))
  }

  try {
    const res: FoxResponse = yield call(fetchAsJson, 'https://randomfox.ca/floof/')

    yield put(FoxReducerAction.setFox(res.image))
  } catch (error: any) {
    console.error('[Error in `loadFoxWorker`]', error)
    yield put(FoxReducerAction.setError(error.message))
  } finally {
    yield put(FoxReducerAction.setLoadingState(FoxLoadingState.LOADED))
  }
}

export function* loadFoxWatcher() {
  yield takeLatest(FoxPublicAction.loadFox, loadFoxWorker)
}
