import { withEggs } from '@redux-eggs/react'
import { useSelector } from 'react-redux'

import { ChuckNorrisLoading } from '@/components/chuck-norris-content/loading'
import { getChuckNorrisEgg } from '@/eggs/chuck-norris'
import { errorSelector, isJokeLoading, jokeSelector } from '@/eggs/chuck-norris/selectors'
import { getPostsEgg } from '@/eggs/posts'
import { PostsPublicAction } from '@/eggs/posts/action-creators'
import { isPostsLoaded } from '@/eggs/posts/selectors'
import { getUsersEgg } from '@/eggs/users'
import { UsersPublicAction } from '@/eggs/users/action-creators'
import { isUsersLoaded } from '@/eggs/users/selectors'

const usersEgg = getUsersEgg()
usersEgg.afterAdd = store => store.dispatch(UsersPublicAction.loadUsers())
usersEgg.afterRemove = () => console.log('Users Egg has been removed')

const postsEgg = getPostsEgg()
postsEgg.afterAdd = store => store.dispatch(PostsPublicAction.loadPosts())
postsEgg.afterRemove = () => console.log('Posts Egg has been removed')

export const Users = withEggs([usersEgg])(function Users() {
  const isLoaded = useSelector(isUsersLoaded)

  return <div>Users loading state: {isLoaded ? 'loaded' : 'loading ...'}</div>
})

export const Posts = withEggs([postsEgg])(function Posts() {
  const isLoaded = useSelector(isPostsLoaded)

  return <div>Posts loading state: {isLoaded ? 'loaded' : 'loading ...'}</div>
})

export const Joke = withEggs([getChuckNorrisEgg()])(function JokeContent() {
  const isLoading = useSelector(isJokeLoading)
  const joke = useSelector(jokeSelector)
  const error = useSelector(errorSelector)

  if (isLoading) {
    return <ChuckNorrisLoading isJoke />
  }

  if (error) {
    return <p>{error}</p>
  }

  if (!joke) {
    return null
  }

  return <p>{joke}</p>
})
