import React, { useState } from "react";
import cn from "classnames";
import styles from "./Hero.module.sass";
import Dropdown from "../../../components/Dropdown";
import Icon from "../../../components/Icon";
import Item from "./Item";

const items = [
  {
    title: "General",
    icon: "home",
    items: [
      {
        title: "What is NSFT?",
        content:
          "NSFT is a platform for creators to distribute limited exclusive content to fans & followers. When you upload a photo or video, it is permanently attached to a unique token (an NFT) that – once sold – will be transferred directly from the creator to the auction winner. Upon this transaction, the auction winner will be able to view the content and assumes full ownership of the token",
      },
      {
        title: "What is an NFT?",
        content:
          "Non Fungible Token (NFT). An NFT is a unique token that lives forever on the blockchain. NFTs allow for ownership of digital goods which is not subject to the whims of a centralized corporation or government.",
      },
      {
        title: "What is minting?",
        content: "Minting is the process of creating an NFT and having its existence confirmed on the blockchain."
      },
      {
        title: "How do I fund my account?",
        content: "After completing the KYC process you can fund your account using Credit/Debit Cards or a Wire Transfer"
      },
      {
        title: "I want to withdraw funds from my account, how do I do this?",
        content: ""
      },
    ],
  },
  {
    title: "Creators",
    icon: "circle-and-square",
    items: [
      {
        title: "What type of content should I upload and sell on NSFT?",
        content: "We encourage anyone with an active & passionate base of followers to explore the platform. While many creators use NSFT to distribute content that is differentiated from their standard material, others prefer to upload and auction their regular content at a limited volume to achieve premium pricing, Because ownership of each token can always be verified, some creators will also choose to attach external value or incentives to a sale; as an example, a video game streamer could offer to play a Fortnite match with the winner of specific auctioned content. Content creators typically see the most success and bidding activity when sharing their current auctions on additional social media platforms for maximum visibility."
      },
      {
        title: "Will I receive a percentage if one of my pieces is resold in the future?",
        content: "Yes, you will receive 80% of the initial auction price of your item, and then when we introduce our own NSFT marketplace you'll receive a portion of any sale on that secondary market"
      },
    ],
  },
  {
    title: "Buyers",
    icon: "circle-and-square",
    items: [
      {
        title: "How is my ownership of an NFT protected on the blockchain?",
        content: "Decentralization is the defining trait of any blockchain. What this means is that many computers around the world must agree on each transaction. Because of the decentralized nature of blockchains attacks are near impossible, and they are considered the gold standard for database security"
      },
      {
        title: "How does the auction timer work?",
        content: "As of right now each auction lasts for 7 full days (168 hours). If a bid is place within the last 10 minutes, the auction timer will reset to 10 minutes."
      },
      {
        title: "How do I bid on a piece?",
        content: ""
      },
      {
        title: "What can I do with my piece after I’ve received it in my account?",
        content: ""
      },
    ],
  },
  {
    title: "Technical",
    icon: "lightning",
    items: [
      {
        title: "What is a blockchain?",
        content: "A blockchain is decentralized database. You can think of it as a chain of blocks containing transactions that everyone agrees on."
      },
      {
        title: "What blockchain does NSFT run on?",
        content: "NSFT runs on the Flow blockchain"
      },
    ],
  },
  {
    title: "Privacy",
    icon: "pen",
    items: [
      {
        title: "Is my personal information protected?",
        content: ""
      },
      {
        title: "How do I verify my account?",
        content: ""
      },
    ],
  },
];

const Hero = () => {
  const options = [];
  items.map((x) => options.push(x.title));

  const [direction, setDirection] = useState(options[0]);

  return (
    <div className={cn("section", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.top}>
          <div className={styles.stage}>learn how to get started</div>
          <h1 className={cn("h2", styles.title)}>Frequently asked questions</h1>
          <div className={styles.info}>
            Common community questions are below, you can also{" "}
            <a href="mailto:aidan@nsftonight.com" rel="noopener noreferrer">
              Contact Support
            </a>
          </div>
          <Dropdown
            className={cn("mobile-show", styles.dropdown)}
            value={direction}
            setValue={setDirection}
            options={options}
          />
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <div className={styles.nav}>
              {items.map((x, index) => (
                <div
                  className={cn(styles.link, {
                    [styles.active]: x.title === direction,
                  })}
                  onClick={() => setDirection(x.title)}
                  key={index}
                >
                  <Icon name={x.icon} size="16" />
                  <span>{x.title}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.col}>
            {items
              .find((x) => x.title === direction)
              .items.map((x, index) => (
                <Item className={styles.item} item={x} key={index} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
