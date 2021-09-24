import type { Immutable } from 'immer'

import type { AVIASALES_MODULE_NAME } from '@/eggs/aviasales'
import type { AviasalesLoadingState } from '@/eggs/aviasales/contracts/loading-state'
import type { Sort } from '@/eggs/aviasales/contracts/sort'
import type { Ticket } from '@/eggs/aviasales/contracts/ticket'
import type { TicketSegment } from '@/eggs/aviasales/contracts/ticket-sement'

export interface AviasalesAwareState {
  [AVIASALES_MODULE_NAME]: AviasalesState
}

export type AviasalesState = Immutable<{
  searchId?: string
  tickets: TicketsMap
  ticketsSegments: TicketsSegmentsMap
  loadingState: AviasalesLoadingState
  currentSort: Sort
  stops: number[]
}>

export interface TicketsMap {
  [id: string]: Ticket
}

export interface TicketsSegmentsMap {
  [id: string]: TicketSegment
}
