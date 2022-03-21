import { withEggs } from '@redux-eggs/react'
import NextLink from 'next/link'
import type { FC } from 'react'
import { useInView } from 'react-intersection-observer'
import { useSelector } from 'react-redux'

import { getPostsEgg } from '@/eggs/posts'
import { isPostsLoading, postsSelector } from '@/eggs/posts/selectors'
import { PostsPublicAction } from '@/eggs/posts/slice'

interface Props {
  rootUrl: string
}

const LoadedPosts: FC<Props> = ({ rootUrl }) => {
  const posts = useSelector(postsSelector)

  return (
    <div>
      {posts.map(post => (
        <NextLink key={post.id} href={`${rootUrl}/${post.id}`} scroll={false}>
          <a style={{ display: 'block', padding: '10px' }}>{post.title}</a>
        </NextLink>
      ))}
    </div>
  )
}

const postEgg = getPostsEgg({ afterAdd: store => store.dispatch(PostsPublicAction.loadPosts()) })

export const Posts: FC<Props> = withEggs<Props>([postEgg])(function Posts({ rootUrl }) {
  const isLoading = useSelector(isPostsLoading)

  return isLoading ? <div>Posts are loading ...</div> : <LoadedPosts rootUrl={rootUrl} />
})

export const DynamicPosts: FC<Props> = ({ rootUrl }) => {
  const [ref, inView] = useInView()

  return <div ref={ref}>{inView ? <Posts rootUrl={rootUrl} /> : null}</div>
}
