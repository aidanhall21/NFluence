// Need to updat the event types when going live on testnet

import * as fcl from "@onflow/fcl";

export async function getBidPlacedEvents() {
  const eventType = "A.a3c018ee20b2cb65.NSFAuction.BidPlaced";

  let end = (await fcl.send([fcl.getBlock(true)]).then(fcl.decode)).height;

  const events = await fcl
    .send([fcl.getEventsAtBlockHeightRange(eventType, end - 249, end)])
    .then(fcl.decode);
  return events;
}

export async function getMintEvents() {
  const eventType = "A.a3c018ee20b2cb65.NSFT.Created";

  let end = (await fcl.send([fcl.getBlock(true)]).then(fcl.decode)).height;

  const events = await fcl
    .send([fcl.getEventsAtBlockHeightRange(eventType, end - 249, end)])
    .then(fcl.decode);
  return events;
}

export async function getAuctionStartedEvents() {
  const eventType = "A.a3c018ee20b2cb65.NSFAuction.AuctionCreated";

  let end = (await fcl.send([fcl.getBlock(true)]).then(fcl.decode)).height;

  const events = await fcl
    .send([fcl.getEventsAtBlockHeightRange(eventType, end - 249, end)])
    .then(fcl.decode);
  return events;
}

export async function getBidReceivedEvents() {
  const eventType = "A.ff2f131df004d80d.NSFAuction.BidReceived";

  let end = (await fcl.send([fcl.getBlock(true)]).then(fcl.decode)).height;

  const events = await fcl
    .send([fcl.getEventsAtBlockHeightRange(eventType, end - 249, end)])
    .then(fcl.decode);
  return events;
}

export async function getAuctionSettledEvents() {
  const eventType = "A.ff2f131df004d80d.NSFAuction.Settled";

  let end = (await fcl.send([fcl.getBlock(true)]).then(fcl.decode)).height;

  const events = await fcl
    .send([fcl.getEventsAtBlockHeightRange(eventType, end - 249, end)])
    .then(fcl.decode);
  return events;
}

export async function getBuyerTokenRewardEvent() {
  const eventType = "A.ff2f131df004d80d.NSFAuction.BuyerTokenReward";

  let end = (await fcl.send([fcl.getBlock(true)]).then(fcl.decode)).height;

  const events = await fcl
    .send([fcl.getEventsAtBlockHeightRange(eventType, end - 249, end)])
    .then(fcl.decode);
  return events;
}

export async function getSellerTokenRewardEvent() {
  const eventType = "A.ff2f131df004d80d.NSFAuction.SellerTokenReward";

  let end = (await fcl.send([fcl.getBlock(true)]).then(fcl.decode)).height;

  const events = await fcl
      .send([fcl.getEventsAtBlockHeightRange(eventType, end - 249, end)])
      .then(fcl.decode);
  return events;
}

export async function getUtilityCoinDepositEvent() {
  const eventType = "A.ff2f131df004d80d.UtilityCoin.TokensDeposited";

  let end = (await fcl.send([fcl.getBlock(true)]).then(fcl.decode)).height;

  const events = await fcl
      .send([fcl.getEventsAtBlockHeightRange(eventType, end - 249, end)])
      .then(fcl.decode);
  const eventsMod = { events }
  const eventsArray = eventsMod['events']
  //console.log(eventsMod['events']);

  eventsArray.map(event => {
    event['data']['user'] = event['data']['to'];
    delete event['data']['to']
    return event
  })

  return eventsArray;
}

export async function getAllEvents() {
  const bidsPlaced = await getBidPlacedEvents();
  const auctionStarted = await getAuctionStartedEvents();
  //const mints = await getMintEvents();
  //const bidsReceived = await getBidReceivedEvents();
  const auctionSettled = await getAuctionSettledEvents();

  const allEvents = [
    ...bidsPlaced,
    ...auctionStarted,
    ...auctionSettled,
  ];

  return allEvents;
}

export async function getAllNotifications() {
  const bidsReceived = await getBidReceivedEvents();
  const auctionSettled = await getAuctionSettledEvents();
  const buyerTokenReward = await getBuyerTokenRewardEvent();
  const sellerTokenReward = await getSellerTokenRewardEvent();
  //const coinDeposit = await getUtilityCoinDepositEvent();

  const allNotifications = [
    ...buyerTokenReward,
    ...sellerTokenReward,
    ...bidsReceived,
    ...auctionSettled,
  ];

  return allNotifications;
}
