const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const Blockchain = require('./Mainchain');
const votechain = new Blockchain();
const port = process.argv[2];
const reqPromise = require('request-promise');
const { request } = require('express');

app.use((req,res, next)=>{
    res.setHeader('Access-Control-Allow-Origin',"http://localhost:3000");
    res.setHeader('Access-Control-Allow-Headers',"*");
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/blockchain', function (req, res) {
    res.send(votechain);
});

app.get('/result', function (req, res) {
    res.send(votechain.Results());
});
app.post('/transaction', function (req, res) {
    const transaction = req.body;
     votechain.PendingTransactions(transaction);

    res.json(
        {
            message: `Transaction will be added to block.`
        }
    );
});
app.get('/Forcesave', function (req, res) {
    votechain.ForceTransactionBlock();
    res.json(
        {
            message: `All Pending Transaction will be added to block Right away.`
        }
    );
});
app.post('/SetdifficultyandMininglimits', function (req, res) {
    const diff = parseInt(req.body.diff);
    const max = parseInt(req.body.max);
     votechain.difficulty=diff;
    votechain.maxTransperblock=max;
    res.json(
        {
            message: `Difficulty set for a block.`
        }
    );
    console.log("chain diff:"+votechain.difficulty);
    console.log("Max Transactions per Block:"+votechain.maxTransperblock);
});

app.post('/broadcast-node-mininglimit', function (req, res) {
    const diff = parseInt(req.body.diff);
    const max = parseInt(req.body.max);
    votechain.difficulty=diff;
    votechain.maxTransperblock=max;
    const requests = [];
    votechain.networkNodes.forEach(networkNode => {
        const requestOptions = {
            uri: networkNode + '/SetdifficultyandMininglimits',
            method: 'POST',
            body: { diff: diff,max:max },
            json: true
        };

        requests.push(reqPromise(requestOptions));
    });

    Promise.all(requests)
        .then(data =>  {
            res.json(
                {
                    message: `Broadcasting Limits successfully!`
                }
            );
        });
});

app.post('/transaction/broadcast', function (req, res) {
    
    const transaction= votechain.addTransactions(req.body.uId,
        req.body.receiver,
        req.body.city,
        req.body.age,
        req.body.gender
        );
        console.log(transaction);

        //console.log(votechain.DoesVoteExist(transaction.uid))
    if(votechain.DoesVoteExist(transaction.uid)){
       //Alert('Vote Already Exist') ;
      
       console.log('here11');
       res.json(
        {
            message: `vote already exist!`
        }
        );
    }
    else{
        votechain.PendingTransactions(transaction );
        const requests = [];
        votechain.networkNodes.forEach(networkNode => {
            const requestOptions = {
                uri: networkNode + '/transaction',
                method: 'POST',
                body: transaction,
                json: true
            };

            requests.push(reqPromise(requestOptions));
        });

        Promise.all(requests)
            .then(data => {
                res.json(
                    {
                        message: `Creating and broadcasting Transaction successfully!`
                    }
                );
            });
    }
});

app.post('/register-node', function (req, res) {
    console.log(req.body.nodeUrl);
    const nodeUrl = req.body.nodeUrl;

    if ((votechain.networkNodes.indexOf(nodeUrl) == -1)
        && (votechain.nodeUrl !== nodeUrl)) {
        votechain.networkNodes.push(nodeUrl);

        res.json(
            {
                message: 'A node registers successfully!'
            }
        );
    }
    else {
        res.json(
            {
                message: 'This node cannot register!'
            }
        );
    }
});



app.post('/register-and-broadcast-node', function (req, res) {
    const nodeUrl = req.body.nodeUrl;

    if (votechain.networkNodes.indexOf(nodeUrl) == -1) {
        votechain.networkNodes.push(nodeUrl);
    }

    const registerNodes = [];
    votechain.networkNodes.forEach(networkNode => {
        const requestOptions = {
            uri: networkNode + '/register-node',
            method: 'POST',
            body: { nodeUrl: nodeUrl },
            json: true
        };

        registerNodes.push(reqPromise(requestOptions));
    });

    Promise.all(registerNodes)
        .then(data => {
            const bulkRegisterOptions = {
                uri: nodeUrl + '/register-bulk-nodes',
                method: 'POST',
                body: { networkNodes: [...votechain.networkNodes, votechain.nodeUrl] },
                json: true
            };

            return reqPromise(bulkRegisterOptions);
        }).then(data => {
            res.json(
                {
                    message: 'A node registers with network successfully!'
                }
            );
        });
});

app.post('/register-bulk-nodes', function (req, res) {
    const networkNodes = req.body.networkNodes;

    networkNodes.forEach(nodeUrl => {
        if ((votechain.networkNodes.indexOf(nodeUrl) == -1)
            && (votechain.nodeUrl !== nodeUrl)) {
            votechain.networkNodes.push(nodeUrl);
        }
    });

    res.json(
        {
            message: 'Registering bulk successfully!'
        }
    );
});

app.get('/consensus', function (req, res) {
    const requests = [];
    votechain.networkNodes.forEach(nodeUrl => {
        const requestOptions = {
            uri: nodeUrl + '/blockchain',
            method: 'GET',
            json: true
        };

        requests.push(reqPromise(requestOptions));
    });
    
    Promise.all(requests)
        .then(blockchains => {
            const currentChainLength = votechain.chain.length;
            let maxChainLength = currentChainLength;
            let longestChain = null;
            let pendingTransactions = null;
            let difficulty=null;
            let maxTransperblock=null;
            blockchains.forEach(blockchain => {
                if (blockchain.chain.length > maxChainLength) {
                    maxChainLength = blockchain.chain.length;
                    longestChain = blockchain.chain;
                    pendingTransactions = blockchain.pendingTransactions;
                    difficulty=blockchain.difficulty;
                   maxTransperblock= blockchain.maxTransperblock;
                }
            });

            if (!longestChain ||
                (longestChain && !votechain.isChainValid())) {
                    
                res.json({
                    message: 'Current chain cannot be replaced!',
                    chain: votechain.chain
                });
            } else if (longestChain && votechain.isChainValid()) {
                votechain.chain = longestChain;
                votechain.pendingTransactions = pendingTransactions;
                votechain.difficulty=difficulty;
                votechain.maxTransperblock= maxTransperblock;
                res.json({
                    message: 'Chain is updated!',
                    chain: votechain.chain
                });
            }
        });
});


app.listen(port, function () {
    console.log(`> listening on port ${port}...`);
});

