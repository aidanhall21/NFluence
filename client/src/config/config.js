import { config } from '@onflow/fcl';

config({
    "accessNode.api": process.env.REACT_APP_ACCESS_NODE,
    "discovery.wallet": process.env.REACT_APP_WALLET_DISCOVERY,
    "app.detail.title": "NFluence",
    "0xNFLUENCE": process.env.REACT_APP_NFLUENCE_CONTRACT,
    "0xAUCTION": process.env.REACT_APP_AUCTION_CONTRACT
})

// "grpc.metadata": {"api_key": process.env.REACT_APP_ALCHEMY_API_KEY},