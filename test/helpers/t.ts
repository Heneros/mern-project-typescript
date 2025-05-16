import { faker } from '@faker-js/faker';

// const cleaned = n.replace(/[.\-_,]/g, '');

const n = faker.internet.username();
console.log(n.replace(/[.\-_,]/g, ''));
