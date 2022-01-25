import { config } from '@onflow/fcl';

config({
    "grpc.metadata": {"api_key": process.env.REACT_APP_ALCHEMY_API_KEY},
    "accessNode.api": process.env.REACT_APP_ACCESS_NODE,
    "discovery.wallet": process.env.REACT_APP_WALLET_DISCOVERY,
    "app.detail.title": "NFluence",
    "0xNFLUENCE": process.env.REACT_APP_NFLUENCE_CONTRACT,
    "0xAUCTION": process.env.REACT_APP_AUCTION_CONTRACT,
    "OxFUNG": "0xf233dcee88fe0abe",
    "0xFUSD": "0x3c5959b568896393",
    "0xNONF": "0x1d7e57aa55817448"
})
