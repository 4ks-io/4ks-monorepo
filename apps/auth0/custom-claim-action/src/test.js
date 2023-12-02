const namespace = 'https://4ks.io';
let t1,
  t2,
  t3 = '';
const e1 = 'delorme.nic@gmail.com';
const e2 = 'hbdelorme@gmail.com';
const e3 = 'm.claire.delorme@gmail.com';

const s1 = `${namespace}/${e1}`;
const s2 = `${namespace}/${e2}`;
const s3 = `${namespace}/${e3}`;

// sha.js
console.log('### sha.js');
var shajs = require('sha.js');

t1 = shajs('sha256').update(s1).digest('hex');
t2 = shajs('sha256').update(s2).digest('hex');
t3 = shajs('sha256').update(s3).digest('hex');

console.log(t1);
console.log(t2);
console.log(t3);

// if (t1 === t2) {
//   console.log('t1 === t2');
//   throw new Error('ids match');
// }
