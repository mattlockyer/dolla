const fs = require('fs');
const path = './utils/config.js'
 
fs.readFile(path, 'utf-8', function(err, data) {
    if (err) throw err;
 
    data = data.replace(/.*const contractName.*/gim, `const contractName = 'ld.dolla.near';`);
 
    fs.writeFile(path, data, 'utf-8', function(err) {
        if (err) throw err;
        console.log('Done!');
    })
})
