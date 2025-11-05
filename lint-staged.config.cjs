const path = require('path');
const formatCommand = 'prettier . --write';

module.exports = {
  '*': formatCommand,
};
