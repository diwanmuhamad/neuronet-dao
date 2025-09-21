"use client";
import { useState } from "react";
import Image from "next/image";
import one from "@/public/images/overview/one.png";
import two from "@/public/images/overview/two.png";
import three from "@/public/images/overview/three.png";
import four from "@/public/images/overview/four.png";

const AboutTool = () => {
  const [isHover, setIsHover] = useState(0);
  return (
    <section className="section overview lilu-view">
      <div className="container">
        <div className="row gaper align-items-center">
          <div className="col-12 col-lg-5 col-xxl-5">
            <div className="section__content">
              <span className="sub-title">AI Tools</span>
              <h2 className="title title-animation">
                Powerful On-Chain AI Tools, Accessible Anywhere
              </h2>
              <p>
                NeuroNet DAO provides decentralized AI utilities built on ICP,
                enabling developers, creators, and businesses to access
                transparent, secure, and scalable AI directly on-chain.
              </p>
            </div>
          </div>
          <div className="col-12 col-lg-7 col-xxl-6 offset-xxl-1 fade-wrapper">
            <div className="row gaper">
              <div className="col-12 col-md-6 fade-top">
                <div
                  className={
                    "overview__single" +
                    (isHover === 0 ? " overview__single-active" : " ")
                  }
                  onMouseEnter={() => setIsHover(0)}
                >
                  <div className="overview__thumb">
                    <Image src={one} alt="AI Outputs Hub" priority />
                  </div>
                  <div className="overview__content">
                    <h4>On-Chain Marketplace</h4>
                    <p className="tertiary-text">
                      Trade prompts, datasets, and AI outputs in a fully transparent, 
                      decentralized environment powered by ICP.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 fade-top">
                <div
                  className={
                    "overview__single" +
                    (isHover === 1 ? " overview__single-active" : " ")
                  }
                  onMouseEnter={() => setIsHover(1)}
                >
                  <div className="overview__thumb">
                    <Image src={two} alt="Collaborative AI" priority />
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
              <div className="col-12 col-md-6 fade-top">
                <div
                  className={
                    "overview__single" +
                    (isHover === 2 ? " overview__single-active" : " ")
                  }
                  onMouseEnter={() => setIsHover(2)}
                >
                  <div className="overview__thumb">
                    <Image src={three} alt="On-Chain Editing" priority />
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
              <div className="col-12 col-md-6 fade-top">
                <div
                  className={
                    "overview__single" +
                    (isHover === 3 ? " overview__single-active" : " ")
                  }
                  onMouseEnter={() => setIsHover(3)}
                >
                  <div className="overview__thumb">
                    <Image src={four} alt="Universal Access" priority />
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
        </div>
      </div>
    </section>
  );
};

export default AboutTool;
