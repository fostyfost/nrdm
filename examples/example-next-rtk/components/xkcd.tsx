import NextImage from 'next/image'
import type { FC } from 'react'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { errorSelector, isXkcdInfoLoading, xkcdInfoSelector } from '@/eggs/xkcd/selectors'
import { XkcdPublicAction } from '@/eggs/xkcd/slice'

const Xkcd: FC<{ small?: boolean }> = ({ small }) => {
  const isLoading = useSelector(isXkcdInfoLoading)
  const info = useSelector(xkcdInfoSelector)
  const error = useSelector(errorSelector)

  const dispatch = useDispatch()
  const update = useCallback(() => {
    dispatch(XkcdPublicAction.loadInfo())
  }, [dispatch])

  if (isLoading) {
    return <div>Load xkcd info ...</div>
  }

  if (small && info) {
    return (
      <div>
        <NextImage
          src={info.img}
          alt={info.alt}
          width={200}
          height={100}
          layout='fixed'
          objectFit='contain'
          unoptimized
        />
      </div>
    )
  }

  return (
    <div>
      {info ? (
        <>
          <NextImage
            src={info.img}
            alt={info.alt}
            width={700}
            height={475}
            layout='fixed'
            objectFit='contain'
            unoptimized
          />
          <pre>
            <code>{JSON.stringify(info, null, 2)}</code>
          </pre>
          <button onClick={update}>Update</button>
        </>
      ) : null}
      {!info && error ? <p style={{ color: 'red' }}>Error: {error}</p> : null}
    </div>
  )
}

export { Xkcd }
