const { hexToBytes } = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");
const express = require("express");
const fs = require("fs");
const app = express();
const cors = require("cors");
const port = 3042;

// Initialize app and set port
app.use(cors());
app.use(express.json());

// Load accounts from file
const accountsString = fs.readFileSync("accounts.json", "utf8", "r");
const accounts = JSON.parse(accountsString);

/**
 * @dev You can find the accounts with
 * address, privateKey, publicKey and balance
 * in account.json
 */

// Endpoint to retrieve account balance
app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = accounts[address].balance || 0;
  res.send({ balance });
});

// Endpoint to send funds
app.post("/send", (req, res) => {
  const {
    sender,
    recipient,
    amount, // number
    txData, //hex
    signature, //hex
    recoveryBit, // number
    publicKey, // hex
  } = req.body;

  // convert hexToBytes signature, txData
  const txDataBytes = hexToBytes(txData);
  const signatureBytes = hexToBytes(signature);

  // recover publicKey from signature
  const recoveredPublicKey = secp.recoverPublicKey(
    txDataBytes,
    signatureBytes,
    recoveryBit
  );

  // Verify signature
  const verify = secp.verify(
    signatureBytes,
    txDataBytes,
    hexToBytes(publicKey)
  );

  // Ensure sender and recipient have an initial balance
  setInitialBalance(sender);
  setInitialBalance(recipient);

  // Check if signature is valid and sender has sufficient funds
  if (!verify) {
    res.status(400).send({ message: "Not verified" });
  } else {
    if (
      accounts[sender].balance < amount &&
      recoveredPublicKey === hexToBytes(publicKey)
    ) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      accounts[sender].balance -= amount;
      accounts[recipient].balance += amount;
      res.send({ balance: accounts[sender].balance });
    }
  }
});

// Start listening on port
app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

// Function to set initial balance for an account
function setInitialBalance(address) {
  if (!accounts[address]) {
    accounts[address].balance = 0;
  }
}
