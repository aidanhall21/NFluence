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
    const renderedFile = await fetchIPFSJSON(item.cid);
    if (renderedFile.image) {
      renderedFile.image = makeGatewayURL(renderedFile.image);
    }
    return renderedFile;
  };

