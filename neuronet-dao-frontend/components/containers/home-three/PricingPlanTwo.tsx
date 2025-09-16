"use client";
import { useState } from "react";
import Link from "next/link";

const PricingPlanTwo = () => {
  return (
    <section className="section pricing pricing--secondary pb-0 fade-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-7 col-xxl-6">
            <div className="section__header text-center">
              <span className="sub-title-two text-primary">Business Model</span>
              <h2 className="title title-animation">Sustainable Pricing</h2>
              <p>
                NeuroNET DAO is built on fair and transparent economics. 
                Transaction fees are optimized for both creators and traders, 
                with extra benefits for stakers of $NND.
              </p>
            </div>
          </div>
        </div>

        <div className="row align-items-start gaper">

          <div className="col-12 col-md-6">
            <div className="pricing__single topy-tilt fade-top">
              <div className="pricing__intro">
                <span className="primary-text fw-5 stand">Standard</span>
                <p className="tertiary-text">
                  Default platform fee for every transaction.
                </p>
                <h2>
                  5%
                  <span> per transaction</span>
                </h2>
              </div>
              <div className="pricing__content">
                <h5 className="fw-5 text-white">Includes</h5>
                <ul>
                  <li>
                    <i className="material-symbols-outlined">check_circle</i>
                    Creator-friendly 5% fee split (buyer + seller)
                  </li>
                  <li>
                    <i className="material-symbols-outlined">check_circle</i>
                    Automatic royalty distribution on resale
                  </li>
                  <li>
                    <i className="material-symbols-outlined">check_circle</i>
                    Supports DAO treasury (2.5% allocation)
                  </li>
                </ul>
                <div className="pricing__cta">
                  <Link href="sign-in" className="btn btn--primary">
                    Start Trading
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="pricing__single topy-tilt fade-top">
              <div className="pricing__intro">
                <span className="primary-text fw-5 premium">Staker</span>
                <p className="tertiary-text">
                  Reduced fees when staking $NND tokens.
                </p>
                <h2>
                  2%
                  <span> per transaction</span>
                </h2>
              </div>
              <div className="pricing__content">
                <h5 className="fw-5 text-white">Includes</h5>
                <ul>
                  <li>
                    <i className="material-symbols-outlined">check_circle</i>
                    Reduced seller fee (stake 1,000 $NND)
                  </li>
                  <li>
                    <i className="material-symbols-outlined">check_circle</i>
                    Earn staking rewards & governance rights
                  </li>
                  <li>
                    <i className="material-symbols-outlined">check_circle</i>
                    Enhanced royalty distribution for creators
                  </li>
                </ul>
                <div className="pricing__cta">
                  <Link href="sign-in" className="btn btn--primary">
                    Start Staking
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center mt-5">
          <div className="col-12 col-lg-8 text-center">
            <p className="tertiary-text">
              Example: Alice mints & sells art for 10 ICP → Bob resells for 20 ICP.  
              Smart contract auto-splits: 18 ICP (Seller) • 1.5 ICP (Alice royalty) • 0.5 ICP (Treasury).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPlanTwo;
