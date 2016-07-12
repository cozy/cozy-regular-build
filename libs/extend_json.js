var fs = require('fs');

function extend(a, b) {
    Object.keys(b).foreach(function (key) {
        if (typeof(b[key]) === 'object') {
            if (!a[key]) a[key] = {};
            extend(a[key], b[key]);
        } else {
            a[key] = b[key];
        }
    });
}

module.exports = function (infile, changes, outfile) {
    var json = fs.readFileSync(infile, 'utf8');
    var obj = JSON.parse(json);
    extend(obj, changes);
    json = JSON.stringify(obj, null, 2);
    fs.writeFileSync(outfile, json, 'utf8');
    return obj;
};
