import cradle from 'cradle';

const db = new cradle.Connection('http://localhost', 5984).database();
