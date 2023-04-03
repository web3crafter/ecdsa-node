import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { hexToBytes, utf8ToBytes, toHex } from "ethereum-cryptography/utils";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const txData = "";
    const txDataBytes = utf8ToBytes(txData);
    const txDataHash = keccak256(txDataBytes);
    const [signature, recoveryBit] = await secp.sign(txDataHash, privateKey, {
      recovered: true,
    });

    const publicKey = secp.getPublicKey(privateKey);
    const verify = secp.verify(signature, txDataHash, publicKey);

    if (!verify) {
      window.alert("Not verified");
    } else {
      try {
        const {
          data: { balance },
        } = await server.post(`send`, {
          sender: address,
          amount: parseInt(sendAmount),
          recipient: recipient.length === 40 ? `0x${recipient}` : recipient,
          txData: toHex(txDataHash),
          signature: toHex(signature),
          recoveryBit: recoveryBit,
          publicKey: toHex(publicKey),
        });
        setBalance(balance);
      } catch (ex) {
        alert(ex.response.data.message);
      }
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address:"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
