import { build, Builder, fabriek } from '@fabriek/core';
import faker from '@faker-js/faker';

type User = {
  id: string;
  name: string;
  email: string;
};

const user: Builder<User> = () => {
  return {
    id: faker.datatype.uuid(),
    name: faker.name.findName(),
    email: faker.internet.email(),
  };
};

type Post = {
  id: string;
  title: string;
  content: string;
  author: User;
};

const post: Builder<Post> = () => {
  return {
    id: faker.datatype.uuid(),
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph(),
    author: build(user),
  };
};

const mock = fabriek({ user, post });
console.group('Basic usage');
console.log(mock.post());
console.groupEnd();

console.group('Default value');
console.log(mock.post({ title: 'This is a mock', author: { name: 'This is a mock' } }));
console.groupEnd();
