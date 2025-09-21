"use client";
import { useState } from "react";
import Image from "next/image";
import one from "@/public/images/overview/one.png";
import two from "@/public/images/overview/two.png";
import three from "@/public/images/overview/three.png";
import four from "@/public/images/overview/four.png";

const Overview = () => {
  const [isOverviewOpen, setOverviewOpen] = useState(0);

  return (
    <section className="section overview pb-0">
      <div className="container">
        <div className="row gaper fade-wrapper">

          <div className="col-12 col-md-6 col-xl-3 fade-top">
            <div
              className={
                "overview__single " +
                (isOverviewOpen === 0 ? " overview__single-active" : " ")
              }
              onMouseEnter={() => setOverviewOpen(0)}
            >
              <div className="overview__thumb">
                <Image src={one} alt="On-Chain Marketplace" priority />
              </div>
              <div className="overview__content">
                <h4>On-Chain Marketplace</h4>
                <p className="tertiary-text">
                  Trade AI outputs, prompts, and datasets in a fully transparent, 
                  decentralized environment powered by ICP.
                </p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-xl-3 fade-top">
            <div
              className={
                "overview__single " +
                (isOverviewOpen === 1 ? " overview__single-active" : " ")
              }
              onMouseEnter={() => setOverviewOpen(1)}
            >
              <div className="overview__thumb">
                <Image src={two} alt="DAO Governance" priority />
              </div>
              <div className="overview__content">
                <h4>DAO Governance</h4>
                <p className="tertiary-text">
                  Every decision is made collectively by the community, ensuring 
                  fairness, transparency, and decentralized control.
                </p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-xl-3 fade-top">
            <div
              className={
                "overview__single " +
                (isOverviewOpen === 2 ? " overview__single-active" : " ")
              }
              onMouseEnter={() => setOverviewOpen(2)}
            >
              <div className="overview__thumb">
                <Image src={three} alt="Verified Ownership" priority />
              </div>
              <div className="overview__content">
                <h4>Verified Ownership</h4>
                <p className="tertiary-text">
                  Blockchain-backed verification ensures creators always retain 
                  true ownership of their AI work.
                </p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-xl-3 fade-top">
            <div
              className={
                "overview__single " +
                (isOverviewOpen === 3 ? " overview__single-active" : " ")
              }
              onMouseEnter={() => setOverviewOpen(3)}
            >
              <div className="overview__thumb">
                <Image src={four} alt="Global Access" priority />
              </div>
              <div className="overview__content">
                <h4>Global Access</h4>
                <p className="tertiary-text">
                  Connect with innovators worldwide and unlock new opportunities 
                  in the decentralized AI ecosystem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Overview;

