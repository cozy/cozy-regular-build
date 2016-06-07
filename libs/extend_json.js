fs = require('fs')

function extend(a, b){
    for(var key in b) if(b.hasOwnProperty(key)){
        if('object' === typeof b[key]){
            if(!a[key]) a[key] = {}
            extend(a[key], b[key])
        }else {
            a[key] = b[key]
        }
    }
};

module.exports = function(infile, changes, outfile){
    var json = fs.readFileSync(infile, 'utf8')
    var obj = JSON.parse(json)
    extend(obj, changes)
    json = JSON.stringify(obj, null, 2);
    fs.writeFileSync(outfile, json, 'utf8');
    return obj;
}
