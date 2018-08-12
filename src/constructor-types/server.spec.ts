import { expect } from 'chai';
import { Done } from 'mocha';
import http from 'http';

import { start } from './server';
import { rp, logger } from '../util';
import { IUser, IPost } from './db';
import { PostConnector, UserConnector } from './connectors';

let server: http.Server;
before('start server', (done: Done) => {
  server = start(done);
});

after('stop server', (done: Done) => {
  server.close(done);
});

describe('constructor types test suites', () => {
  const USER_ID1 = 'a';

  it('should return correct result for user query', async () => {
    const body = {
      query: `
        query user($id: ID!) {
          user(id: $id) {
            id
            name
            posts {
              id
              content
            }
          }
        }
      `,
      variables: {
        id: USER_ID1
      }
    };

    const user: IUser | undefined = UserConnector.findUserById(USER_ID1);

    if (user) {
      const posts: IPost[] = PostConnector.findPostsByUserId(user.id);
      const userResult: IUser & { posts: IPost[] } = {
        ...user,
        posts
      };
      const actualValue = await rp(body);
      const expectValue = {
        data: {
          user: userResult
        }
      };

      expect(actualValue).to.eql(expectValue);
    }
  });

  it('should return users for users query', async () => {
    const body = {
      query: `
        query users {
          users{
            id
            name
          }
        }
      `
    };

    const actualValue = await rp(body);
    const expectValue = {
      data: {
        users: UserConnector.findAllUsers()
      }
    };

    expect(actualValue).to.eql(expectValue);
  });
});
