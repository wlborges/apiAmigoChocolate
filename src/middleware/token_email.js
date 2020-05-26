var uuid = require('uuid-random');

function token(){
    return uuid();
}
module.exports= {token}