import CryptoJS from "crypto-js";

const decrypt = (data) => {
  return CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
};

export function makeGatewayURL(ipfsURI) {
    return ipfsURI.replace(/^ipfs:\/\//, "https://dweb.link/ipfs/");
  }
  
export async function fetchIPFSJSON(ipfsURI) {
    const url = makeGatewayURL(ipfsURI);
    const resp = await fetch(url);
    return resp.json();
  }

export const createTokenLink = async (item) => {
    if (!item.cid) return {}
    if (item.cid === "") return {};
    let decodedHash;
    try {
      decodedHash = decrypt(item.cid)
    } catch {
      decodedHash = item.cid
    }
    const renderedFile = await fetchIPFSJSON(decodedHash);
    if (item.fileType === 0 && renderedFile.image) {
      renderedFile.image = makeGatewayURL(renderedFile.image);
    }
    if (item.fileType === 1 && renderedFile.properties.file) {
      renderedFile.properties.file = makeGatewayURL(renderedFile.properties.file)
    }
    return renderedFile;
  };

export const formatAmountInput = (x) => {
  return x.toString() + ".0";
}

