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
                    <Image src={one} alt="AI Model Hub" priority />
                  </div>
                  <div className="overview__content">
                    <h4>AI Model Hub</h4>
                    <p className="tertiary-text">
                      Access and deploy community-driven AI models directly
                      from the blockchain.
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
                    <h4>Collaborative AI</h4>
                    <p className="tertiary-text">
                      Build, share, and monetize AI models in an open
                      marketplace governed by the community.
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
                    <h4>On-Chain Editing</h4>
                    <p className="tertiary-text">
                      Refine AI outputs with transparent version history and
                      decentralized validation.
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
                    <h4>Universal Access</h4>
                    <p className="tertiary-text">
                      Seamless AI tools available across platforms, powered by
                      decentralized infrastructure.
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
