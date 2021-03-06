import { db, IPost } from '../db';

interface IPostConnector {
  findPostsByUserId: (id: string) => IPost[];
}

const PostConnector: IPostConnector = {
  findPostsByUserId: (id: string): IPost[] => {
    const posts: IPost[] = [];
    db.posts.forEach(
      (post: IPost): void => {
        if (post.authorId === id) {
          posts.push(post);
        }
      }
    );
    return posts;
  }
};

export { PostConnector, IPostConnector };
