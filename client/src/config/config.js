import { config } from '@onflow/fcl';

config({
    "accessNode.api": process.env.REACT_APP_ACCESS_NODE,
    "discovery.wallet": process.env.REACT_APP_WALLET_DISCOVERY,
    "app.detail.title": "NSFT",
    "0xNSFT": process.env.REACT_APP_NSFT_CONTRACT,
    "0xUTILITYCOIN": process.env.REACT_APP_UTILITY_COIN_CONTRACT,
    "0xNSFAUCTION": process.env.REACT_APP_AUCTION_CONTRACT
})

// "grpc.metadata": {"api_key": process.env.REACT_APP_ALCHEMY_API_KEY},