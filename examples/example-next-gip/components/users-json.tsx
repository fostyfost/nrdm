import type { FC } from 'react'
import { useSelector } from 'react-redux'

import { errorSelector, isUsersLoading, usersSelector } from '@/eggs/users/selectors'

const UsersJson: FC = () => {
  const isLoading = useSelector(isUsersLoading)
  const users = useSelector(usersSelector)
  const error = useSelector(errorSelector)

  if (isLoading) {
    return <div>Load users ...</div>
  }

  return (
    <div>
      <pre>
        <code>{JSON.stringify(users, null, 2)}</code>
      </pre>
      {!users && error ? <p style={{ color: 'red' }}>Error: {error}</p> : null}
    </div>
  )
}

export { UsersJson }
