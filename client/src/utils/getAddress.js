import { toHex } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

const getAddress = (publicKey) => {
  const firstByte = publicKey.slice(1);
  const hash = keccak256(firstByte);
  const address = hash.slice(-20);
  const addressHex = `0x${toHex(address)}`;
  return addressHex;
};

export default getAddress;
