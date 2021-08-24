// File: ./sign.js
import { ec as EC } from "elliptic";
import { hash } from "./hash";

const ec = new EC("p256");

export function sign(privateKey, message) {
  const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"));
  const sig = key.sign(hash(message));
  const n = 32;
  const r = sig.r.toArrayLike(Buffer, "be", n);
  const s = sig.s.toArrayLike(Buffer, "be", n);
  return Buffer.concat([r, s]).toString("hex");
}