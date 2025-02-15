import { call, put, select, takeLatest } from 'redux-saga/effects'

import { UsersLoadingState } from '@/eggs/users/contracts/state'
import type { User } from '@/eggs/users/contracts/user'
import { errorSelector } from '@/eggs/users/selectors'
import { UsersPublicAction, UsersReducerAction } from '@/eggs/users/slice'
import { fetchAsJson } from '@/utils/fetch-as-json'

function* loadUsersWorker() {
  yield put(UsersReducerAction.setLoadingState(UsersLoadingState.LOADING))

  const error: ReturnType<typeof errorSelector> = yield select(errorSelector)

  if (error) {
    yield put(UsersReducerAction.setError(undefined))
  }

  try {
    const users: User[] = yield call(fetchAsJson, 'https://jsonplaceholder.typicode.com/users')

    yield put(UsersReducerAction.setUsers(users))
  } catch (error: any) {
    console.error('[Error in `loadUsersWorker`]', error)
    yield put(UsersReducerAction.setError(error.message))
  } finally {
    yield put(UsersReducerAction.setLoadingState(UsersLoadingState.LOADED))
  }
}

export function* loadUsersWatcher() {
  yield takeLatest(UsersPublicAction.loadUsers, loadUsersWorker)
}
