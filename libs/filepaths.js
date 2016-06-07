var corbu = require('../index')
var join = require('path').join
var resolve = require('path').resolve

paths = exports

paths.ROOT               = process.cwd(),

paths.TESTSFOLDER        = join(paths.ROOT, 'test'),

paths.SERVER             = join(paths.ROOT, 'server'),
paths.SERVERVIEWS        = join(paths.SERVER, 'views'),
paths.SERVERASSETS       = join(paths.SERVER, 'assets'),
paths.SERVERLOCALES      = join(paths.SERVER, 'locales'),
paths.SERVERFILE         = join(paths.ROOT, 'server.coffee'),
paths.SERVERPACKAGE      = join(paths.ROOT, 'package.json'),

paths.CLIENT             = join(paths.ROOT, 'client'),
paths.CLIENTPUBLIC       = join(paths.CLIENT, 'public'),
paths.CLIENTAPP          = join(paths.CLIENT, 'app'),
paths.CLIENTLOCALES      = join(paths.CLIENTAPP, 'locales'),
paths.CLIENTPACKAGE      = join(paths.CLIENT, 'package.json'),

paths.BUILD              = join(paths.ROOT, 'build'),
paths.BUILDCLIENT        = join(paths.BUILD, 'client'),
paths.BUILDCLIENTPUBLIC  = join(paths.BUILDCLIENT, 'public'),
paths.BUILDSERVER        = join(paths.BUILD, 'server'),
paths.BUILDSERVERASSETS  = join(paths.BUILDSERVER, 'assets'),
paths.BUILDSERVERLOCALES = join(paths.BUILDSERVER, 'locales'),
paths.BUILDSERVERVIEWS   = join(paths.BUILDSERVER, 'views')

paths.CONFIGFILES        = resolve(__dirname, '..', 'configs')
