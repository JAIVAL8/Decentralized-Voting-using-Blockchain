const express = require('express');
const app = express();

const Blockchain = require('./Mainchain');
const votechain = new Blockchain();
const port = process.argv[2];
const reqPromise = require('request-promise');


app.get('/blockchain', function (req, res) {
    res.send(bitcoin);
});

app.post('/register-bulk-nodes', function (req, res) {
    const networkNodes = req.body.networkNodes;

    networkNodes.forEach(nodeUrl => {
        if ((bitcoin.networkNodes.indexOf(nodeUrl) == -1)
            && (bitcoin.nodeUrl !== nodeUrl)) {
            bitcoin.networkNodes.push(nodeUrl);
        }
    });

    res.json(
        {
            message: 'Registering bulk successfully!'
        }
    );
});


app.listen(port, function () {
    console.log(`> listening on port ${port}...`);
});

