import * as fcl from "@onflow/fcl";
//import { getConfig } from "../../config";
import { sign } from "./sign";

function getConfig() {
    const minterAddress = fcl.withPrefix(process.env.REACT_APP_NSFT_CONTRACT);
    const minterPrivateKeyHex = process.env.REACT_APP_NSFT_PRIVATE_KEY;
    const minterAccountKeyIndex =
      process.env.REACT_APP_NSFT_ACCOUNT_KEY_INDEX || 0;
  
    return {
      minterAddress,
      minterPrivateKeyHex,
      minterAccountKeyIndex,
    };
  }

const ADDRESS = getConfig().minterAddress;
const KEY_ID = getConfig().minterAccountKeyIndex;

export const authorizationFunction = async (account) => {
  // authorization function need to return an account
  return {
    ...account, // bunch of defaults in here, we want to overload some of them though
    tempId: `${ADDRESS}|${KEY_ID}`, // tempIds are more of an advanced topic, for 99% of the times where you know the address and keyId you will want it to be a unique string per that address and keyId
    addr: fcl.sansPrefix(ADDRESS), // the address of the signatory, currently it needs to be without a prefix right now
    keyId: Number(KEY_ID), // this is the keyId for the accounts registered key that will be used to sign, make extra sure this is a number and not a string
    signingFunction: async (signable) => {
      // Singing functions are passed a signable and need to return a composite signature
      // signable.message is a hex string of what needs to be signed.
      return {
        addr: fcl.withPrefix(ADDRESS), // needs to be the same as the account.addr but this time with a prefix, eventually they will both be with a prefix
        keyId: Number(KEY_ID), // needs to be the same as account.keyId, once again make sure its a number and not a string
        signature: sign(getConfig().minterPrivateKeyHex, signable.message), // this needs to be a hex string of the signature, where signable.message is the hex value that needs to be signed
      };
    },
  };
};