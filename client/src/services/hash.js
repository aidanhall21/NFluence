// File: ./hash.js
import { SHA3 } from "sha3";

export function hash(message) {
  const sha = new SHA3(256);
  sha.update(Buffer.from(message, "hex"));
  return sha.digest();
}