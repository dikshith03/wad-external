const http = require('http');
const os = require('os');
const path = require('path');
const EventEmitter = require('events');

const myEmitter = new EventEmitter();

myEmitter.on('userRequested', (urlPath) => {
    console.log(`[Event Emitted] A user made a request to: ${urlPath}`);
});

myEmitter.on('customEventTriggered', (msg) => {
    console.log(`[Custom Event] ${msg}`);
});

const server = http.createServer((req, res) => {
    myEmitter.emit('userRequested', req.url);

    res.setHeader('Content-Type', 'application/json');

    if (req.url === '/') {
        res.writeHead(200);
        res.end(JSON.stringify({ 
            message: "Welcome to the Node.js Core Modules Explorer!", 
            endpoints: ['/os', '/path', '/event'] 
        }));
    } 
    else if (req.url === '/os') {
        const osInfo = {
            platform: os.platform(),
            architecture: os.arch(),
            cpuCores: os.cpus().length,
            totalMemory: `${(os.totalmem() / (1024 ** 3)).toFixed(2)} GB`,
            freeMemory: `${(os.freemem() / (1024 ** 3)).toFixed(2)} GB`,
            systemUptime: `${os.uptime()} seconds`,
            currentUser: os.userInfo().username
        };
        res.writeHead(200);
        res.end(JSON.stringify({ module: "OS", data: osInfo }));
    } 
    else if (req.url === '/path') {
        const sampleFilePath = '/users/kolla/documents/web_project/index.html';
        const pathInfo = {
            samplePath: sampleFilePath,
            basename: path.basename(sampleFilePath), 
            dirname: path.dirname(sampleFilePath),   
            extension: path.extname(sampleFilePath), 
            parsedPath: path.parse(sampleFilePath),
            joinedPath: path.join('/users', 'kolla', 'downloads', 'file.txt'), 
            normalizedPath: path.normalize('/users/kolla/../test/./app.js') 
        };
        res.writeHead(200);
        res.end(JSON.stringify({ module: "Path", data: pathInfo }));
    }
    else if (req.url === '/event') {
        myEmitter.emit('customEventTriggered', 'User accessed the /event endpoint');
        
        res.writeHead(200);
        res.end(JSON.stringify({ 
            module: "Events", 
            message: "Check your server console! An event was just emitted and handled by the EventEmitter." 
        }));
    }
    else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Route not found. Try /, /os, /path, or /event" }));
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is safely running on http://localhost:${PORT}`);
    console.log(`Explore the different modules via these endpoints:`);
    console.log(`  - OS Module:    http://localhost:${PORT}/os`);
    console.log(`  - Path Module:  http://localhost:${PORT}/path`);
    console.log(`  - Event Module: http://localhost:${PORT}/event`);
});
