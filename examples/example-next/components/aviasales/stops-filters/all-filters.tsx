import type { FC } from 'react'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import { Checkbox } from '@/components/aviasales/stops-filters/checkbox'
import { AviasalesPublicAction, ChangeStopsMassive } from '@/eggs/aviasales/events'
import { isAllStopsSelectedSelector } from '@/eggs/aviasales/selectors'

const AllFilters: FC = memo(() => {
  const isAllStopsSelected = useSelector(isAllStopsSelectedSelector)

  const isAllStopsSelectedRef = useRef(isAllStopsSelected)

  const [checked, setChecked] = useState(false)

  const changeHandler = useCallback(() => {
    if (checked) {
      AviasalesPublicAction.changeStops(ChangeStopsMassive.UNCHECK_ALL)
      setChecked(false)
    } else {
      AviasalesPublicAction.changeStops(ChangeStopsMassive.CHECK_ALL)
      setChecked(true)
    }
  }, [checked])

  useEffect(() => {
    if (isAllStopsSelectedRef.current !== isAllStopsSelected) {
      isAllStopsSelectedRef.current = isAllStopsSelected
      setChecked(isAllStopsSelected)
    }
  }, [isAllStopsSelected])

  return <Checkbox id='stops-all' label='All' onChange={changeHandler} checked={checked} />
})

export { AllFilters }
