const namespace = 'https://4ks.io';
let t1,
  t2 = '';
const e1 = 'delorme.nic@gmail.com';
const e2 = 'hbdelorme@gmail.com';

const s1 = `${namespace}/${e1}`;
const s2 = `${namespace}/${e2}`;

// sha256
console.log('### sha256');
const sha256 = require('sha256');

t1 = sha256(s1);
t2 = sha256(s2);

console.log(t1);
console.log(t2);

if (t1 === t2) {
  console.log('t1 === t2');
  throw new Error('ids match');
}

// sha.js
console.log('### sha.js');
var shajs = require('sha.js');

t1 = shajs('sha256').update(s1).digest('hex');
t2 = shajs('sha256').update(s2).digest('hex');

console.log(t1);
console.log(t2);

if (t1 === t2) {
  console.log('t1 === t2');
  throw new Error('ids match');
}
