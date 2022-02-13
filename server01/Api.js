const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const Blockchain = require("./Mainchain");
const votechain = new Blockchain();

const port = process.argv[2];

const reqPromise = require("request-promise");
const res = require("express/lib/response");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.get("/mine", function (req, res) {
  let newBlock = votechain.createBlock(false);
//   console.log(JSON.stringify(newBlock));
  newBlock = votechain.mineBlock(newBlock);
  res.send(newBlock);
});

app.get("/blockchain", function (req, res) {
  res.send(votechain);
});

app.get("/result", function (req, res) {
  res.send(votechain.Results());
});

app.post("/checkuid", function (req, res) {
  if (votechain.DoesVoteExist(req.body.uid)) {
    //Alert('Vote Already Exist') ;
    return res.status(422).json({ error: "Already Voted for this Election" });
  }
});

app.get("/Forcemine", function (req, res) {
  votechain.ForceTransactionBlock();
  res.json({
    message: `All Pending Transaction will be added to block Right away.`,
  });
});
app.get("/broadcast/Forcemine", function (req, res) {
  votechain.ForceTransactionBlock();
  const requests = [];
  votechain.networkNodes.forEach((networkNode) => {
    const requestOptions = {
      uri: networkNode + "/Forcemine",
      method: "GET",
      json: true,
    };

    requests.push(reqPromise(requestOptions));
  });

  Promise.all(requests).then((data) => {
    res.json({
      message: `Forced-Mining!`,
    });
  });
});

app.post("/Set-Parameters", function (req, res) {
  const diff = parseInt(req.body.diff);
  const max = parseInt(req.body.max);
  votechain.difficulty = diff;
  votechain.maxvotes = max;
  res.json({
    message: `Difficulty set for a block.`,
  });
  console.log("chain diff:" + votechain.difficulty);
  console.log("Max Transactions per Block:" + votechain.maxvotes);
});

app.post("/broadcast/Set-Parameters", function (req, res) {
  const diff = parseInt(req.body.diff);
  const max = parseInt(req.body.max);
  console.log(diff);
  console.log(max);

  votechain.difficulty = diff;
  votechain.maxvotes = max;
  console.log("chain diff:" + votechain.difficulty);
  console.log("Max Transactions per Block:" + votechain.maxvotes);
  const requests = [];
  votechain.networkNodes.forEach((networkNode) => {
    const requestOptions = {
      uri: networkNode + "/Set-Parameters",
      method: "POST",
      body: { diff: diff, max: max },
      json: true,
    };

    requests.push(reqPromise(requestOptions));
  });

  Promise.all(requests).then((data) => {
    res.json({
      message: `Broadcasting Limits successfully!`,
    });
  });
});
app.post("/Postblock", function (req, res) {
  const newBlock = req.body.newBlock;

  const extra = req.body.extra;
  votechain.addBlock(newBlock);
  votechain.pendingTransactions = [];
  votechain.pendingTransactions.push(extra);
});

app.post("/Pending-votes", function (req, res) {
  const Transactions = req.body;

  votechain.pendingTransactions.push(Transactions);

  res.json({
    message: `Votes will be added to Pending List.`,
  });
});

app.post("/broadcast/Pending-votes", function (req, res) {
  const transaction = votechain.addTransactions(
    req.body.uid,
    req.body.receiver,
    req.body.location,
    req.body.age,
    req.body.gender
  );

  console.log("checking if id exist");
  console.log(votechain.DoesVoteExist(transaction.uid));

  if (votechain.DoesVoteExist(transaction.uid)) {
    //Alert('Vote Already Exist')

    return res.status(422).json({ error: "Vote already Exist with this uid" });
  } else {
    let total = votechain.pendingTransactions.length;

    if (total < votechain.maxvotes) {
      votechain.pendingTransactions.push(transaction);

      const requests = [];
      votechain.networkNodes.forEach((networkNode) => {
        const requestOptions = {
          uri: networkNode + "/Pending-votes",
          method: "POST",
          body: transaction,
          json: true,
        };

        requests.push(reqPromise(requestOptions));
      });

      Promise.all(requests).then((data) => {
        res.json({
          message: `Broadcasting votes successfully!`,
        });
      });
    } else {
      console.log("Mining since pending list is full!!!");
      votechain.pendingTransactions.push(transaction);
      console.log(votechain.pendingTransactions);
      const extra = votechain.pendingTransactions[votechain.maxvotes];
      
      const start = Date.now();
      const requests = [];
      Nodes = [];
      Nodes = Nodes.concat(votechain.networkNodes);
      Nodes.push(votechain.nodeUrl);

      Nodes.forEach((Node) => {
        const requestOptions = {
          uri: Node + "/mine",
          method: "GET",
          json: true,
        };
       requests.push(reqPromise(requestOptions));
      });

      Promise.any(requests)
      .then((newBlock) => {
        res.json({
          message: `Mining Success!`
        });
        votechain.addBlock(newBlock);
        console.log(newBlock);
        console.log(extra);
        votechain.pendingTransactions = [];
        votechain.pendingTransactions.push(extra);
        console.log("Mining since pending list is full!!!");
        const requests = [];
        votechain.networkNodes.forEach((networkNode) => {
          const requestOptions = {
            uri: networkNode + "/Postblock",
            method: "POST",
            body: { newBlock: newBlock, extra: extra },
            json: true,
          };

          requests.push(reqPromise(requestOptions));
        });

        Promise.all(requests).then((data) => {
          res.json({
            message: `Creating and broadcasting block successfully!`,
          });
        });
      });

      
      const stop = Date.now();
      console.log(`Time Taken to execute = ${(stop - start) / 1000} seconds`);
    }
  }
});

app.post("/register-node", function (req, res) {
  console.log(req.body.nodeUrl);
  const nodeUrl = req.body.nodeUrl;

  if (
    votechain.networkNodes.indexOf(nodeUrl) == -1 &&
    votechain.nodeUrl !== nodeUrl
  ) {
    votechain.networkNodes.push(nodeUrl);

    res.json({
      message: "A node registers successfully!",
    });
  } else {
    res.json({
      message: "This node cannot register!",
    });
  }
});

app.post("/register-bulk-nodes", function (req, res) {
  const networkNodes = req.body.networkNodes;

  networkNodes.forEach((nodeUrl) => {
    if (
      votechain.networkNodes.indexOf(nodeUrl) == -1 &&
      votechain.nodeUrl !== nodeUrl
    ) {
      votechain.networkNodes.push(nodeUrl);
    }
  });

  res.json({
    message: "Registering bulk successfully!",
  });
});

app.get("/consensus", function (req, res) {
  const requests = [];
  votechain.networkNodes.forEach((nodeUrl) => {
    const requestOptions = {
      uri: nodeUrl + "/blockchain",
      method: "GET",
      json: true,
    };

    requests.push(reqPromise(requestOptions));
  });

  Promise.all(requests).then((blockchains) => {
    const currentChainLength = votechain.chain.length;
    let maxChainLength = currentChainLength;
    let longestChain = null;
    let pendingTransactions = null;
    let difficulty = null;
    let maxvotes = null;
    blockchains.forEach((blockchain) => {
      if (blockchain.chain.length > maxChainLength) {
        maxChainLength = blockchain.chain.length;
        longestChain = blockchain.chain;
        pendingTransactions = blockchain.pendingTransactions;
        difficulty = blockchain.difficulty;
        maxvotes = blockchain.maxvotes;
      }
    });

    if (!longestChain || (longestChain && !votechain.isChainValid())) {
      res.json({
        message: "Current chain cannot be replaced!",
        chain: votechain.chain,
      });
    } else if (longestChain && votechain.isChainValid()) {
      votechain.chain = longestChain;
      votechain.pendingTransactions = pendingTransactions;
      votechain.difficulty = difficulty;
      votechain.maxvotes = maxvotes;
      res.json({
        message: "Chain is updated!",
        chain: votechain.chain,
      });
    }
  });
});

app.listen(port, function () {
  console.log(`> listening on port ${port}...`);
});
