import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import getAddress from "./utils/getAddress";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
}) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const address = getAddress(secp.getPublicKey(privateKey));
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private key
        <input
          placeholder="Sign with private key"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>
      <div>{`Address: ${address}`}</div>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
