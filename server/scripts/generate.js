const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const fs = require("fs");
const path = require("path");

// Function to generate a new account
const generateAccount = () => {
  // Generate a new private key and convert to hexadecimals
  const privateKey = secp.utils.randomPrivateKey();
  const privateKeyHex = toHex(privateKey);
  // Derive the corresponding public key from the private key and convert to hexadecimals
  const publicKey = secp.getPublicKey(privateKey);
  const publicKeyHex = toHex(publicKey);
  // Take the hash of the public key using the Keccak-256 hash function
  const firstByte = publicKey.slice(1);
  const hash = keccak256(firstByte);
  // Take the last 20 bytes of the hash to obtain the address and convert to hexadecimals
  const address = hash.slice(-20);
  const addressHex = `0x${toHex(address)}`;
  // Set the initial balance for the account to 20 ether
  const balance = 20;

  // Log the generated private key, public key, and address to the console
  console.log(`Private Key ${privateKeyHex}`);
  console.log(`Public Key ${publicKeyHex}`);
  console.log(`Address: ${addressHex}`);

  // Save the account details to a JSON file
  saveAccounts(addressHex, privateKeyHex, publicKeyHex, balance);
};

// Function to save the account details to a JSON file
const saveAccounts = (address, privateKey, publicKey, balance) => {
  try {
    // Construct the file path for the accounts JSON file
    const accountsFilePath = path.join(__dirname, "../accounts.json");
    let accounts = {};
    // If the accounts JSON file already exists, read its content and parse it as JSON
    if (fs.existsSync(accountsFilePath)) {
      const content = fs.readFileSync(accountsFilePath, "utf-8");
      accounts = JSON.parse(content);
    }
    // Add the new account data to the accounts object
    accounts[address] = {
      privateKey: privateKey,
      publicKey: publicKey,
      balance: balance,
    };
    // Write the updated accounts data to the accounts JSON file
    fs.writeFileSync(accountsFilePath, JSON.stringify(accounts));
    console.log("Saved Successfully");
  } catch (error) {
    // If an error occurs during the file read/write operations, log an error message to the console
    console.error(`Failed to save accounts: ${error.message}`);
  }
};
// Call the generateAccount function to generate a new account
generateAccount();
