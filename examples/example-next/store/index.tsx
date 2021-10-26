import type { EggExt } from '@redux-eggs/core'
import { createWrapperInitializer } from '@redux-eggs/next'
import { createStore } from '@redux-eggs/redux'
import type { SagaExt } from '@redux-eggs/saga-extension'
import { getSagaExtension } from '@redux-eggs/saga-extension'
import { batch } from 'react-redux'
import type { AnyAction, ReducersMapObject, Store } from 'redux'
import { combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import type { EffectMiddleware } from 'redux-saga'
import type { Effect } from 'redux-saga/effects'
import { effectTypes } from 'redux-saga/effects'

import { StoreActionType } from '@/store/action-types'
import { getLoggerExtension } from '@/store/logger-extension'

export type AppStore = Store & EggExt & SagaExt

const combiner = (reducersMap: ReducersMapObject) => {
  const combinedReducer = combineReducers(reducersMap)

  return (state: any = {}, action: AnyAction) => {
    if (action.type === StoreActionType.HYDRATE && action.payload) {
      return combinedReducer({ ...state, ...action.payload }, action)
    }

    return combinedReducer(state, action)
  }
}

const batchAllPuts: EffectMiddleware = next => effect => {
  if (
    effect &&
    effect.type === effectTypes.ALL &&
    Array.isArray(effect.payload) &&
    // To apply batching, there must be only put effects inside `payload`
    !(effect.payload as Effect[]).some(subEffect => subEffect.type !== effectTypes.PUT)
  ) {
    batch(() => next(effect))
    return
  }

  next(effect)
}

const createAppStore = (): AppStore => {
  return createStore<AppStore>({
    extensions: [getSagaExtension({ effectMiddlewares: [batchAllPuts] }), getLoggerExtension()],
    combiner,
    composer: composeWithDevTools({ maxAge: 200 }),
  })
}

export const wrapperInitializer = createWrapperInitializer(createAppStore, {
  hydrationActionType: StoreActionType.HYDRATE,
})
