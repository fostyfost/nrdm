import { all, call, delay, put, retry } from 'typed-redux-saga'

import { getTicketsWithApi } from '@/eggs/aviasales/api/get-tickets-with-api'
import { DELAY_LENGTH, MAX_TRIES } from '@/eggs/aviasales/constants'
import { AviasalesLoadingState } from '@/eggs/aviasales/contracts/loading-state'
import { getSearchId } from '@/eggs/aviasales/saga/get-search-id'
import { AviasalesReducerAction } from '@/eggs/aviasales/slice'
import { normalizeTicketsResponse } from '@/eggs/aviasales/utils/normalize-tickets-response'

const isServer = typeof window === 'undefined'

export function* getTickets() {
  let stop = false

  yield* put(AviasalesReducerAction.setLoadingState(AviasalesLoadingState.LOADING))

  const searchId = yield* call(getSearchId)

  while (!stop) {
    // It's long-polling api.
    // We receive data until the response contains a stop field with true as a value.
    // TODO: Add cancellation
    const res = yield* retry(MAX_TRIES, DELAY_LENGTH, getTicketsWithApi, searchId)

    const { ticketsSegmentsMap, ticketsMap } = yield* call(normalizeTicketsResponse, res.tickets)

    yield* all([
      put(AviasalesReducerAction.addTicketsSegments(ticketsSegmentsMap)),
      put(AviasalesReducerAction.addTickets(ticketsMap)),
    ])

    stop = res.stop || isServer

    if (res.stop) {
      yield* put(AviasalesReducerAction.setLoadingState(AviasalesLoadingState.LOADED))
    } else if (!isServer) {
      yield* delay(DELAY_LENGTH)
    }
  }
}
