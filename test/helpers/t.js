"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var faker_1 = require("@faker-js/faker");
// const cleaned = n.replace(/[.\-_,]/g, '');
var n = faker_1.faker.internet.username();
console.log(n.replace(/[.\-_,]/g, ''));
