"use client";
import { useState } from "react";
import Link from "next/link";

const PricingPlan = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="section pricing pb-0 fade-wrapper pr-i">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 col-xxl-7">
            <div className="section__header text-center">
              <h2 className="title mt-12 title-animation">
                Sustainable Business Model
              </h2>
              <p>
                NeuroNet DAO runs on a transparent, on-chain model. 
                Platform fees, staking utility, and royalties ensure fairness, 
                sustainability, and community-driven growth.
              </p>
            </div>
          </div>
        </div>

        <div className="row align-items-start gaper">
 
          <div className="col-12 col-md-6 col-xl-4">
            <div className="pricing__single topy-tilt fade-top">
              <div className="pricing__intro">
                <span className="primary-text">Explorer</span>
                <h2 className="light-title">Free</h2>
              </div>
              <hr />
              <div className="pricing__content">
                <ul>
                  <li><i className="material-symbols-outlined">check_circle</i> Browse public AI models & datasets</li>
                  <li><i className="material-symbols-outlined">check_circle</i> Verify outputs on-chain</li>
                  <li><i className="material-symbols-outlined">check_circle</i> Access open data & prompts</li>
                </ul>
              </div>
              <div className="pricing__cta section__cta">
                <Link href="explore" className="btn btn--secondary">Start Exploring</Link>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-xl-4">
            <div className="pricing__single pricing__single-active topy-tilt fade-top">
              <div className="pricing__intro">
                <span className="primary-text">Contributor</span>
                <h2 className="light-title">5% Fee</h2>
                <p className="tertiary-text">Per transaction</p>
              </div>
              <hr />
              <div className="pricing__content">
                <ul>
                  <li><i className="material-symbols-outlined">check_circle</i> Sell AI outputs, prompts & datasets</li>
                  <li><i className="material-symbols-outlined">check_circle</i> On-chain escrow & trustless licensing</li>
                  <li><i className="material-symbols-outlined">check_circle</i> Example: List item at 10 ICP → You receive 9.5 ICP</li>
                  <li><i className="material-symbols-outlined">check_circle</i> Platform takes 5% (sustainable growth)</li>
                </ul>
              </div>
              <div className="pricing__cta section__cta">
                <Link href="contribute" className="btn btn--primary">Start Selling</Link>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-xl-4">
            <div className="pricing__single topy-tilt fade-top">
              <div className="pricing__intro">
                <span className="primary-text premium">DAO Member</span>
                <h2 className="light-title">2% Fee</h2>
                <p className="tertiary-text">With 1,000 $NND Staked</p>
              </div>
              <hr />
              <div className="pricing__content">
                <ul>
                  <li><i className="material-symbols-outlined">check_circle</i> Reduced seller fees (2%)</li>
                  <li><i className="material-symbols-outlined">check_circle</i> Participate in DAO governance & proposals</li>
                  <li><i className="material-symbols-outlined">check_circle</i> Access staking rewards</li>
                  <li><i className="material-symbols-outlined">check_circle</i> Shape marketplace rules & treasury</li>
                </ul>
              </div>
              <div className="pricing__cta section__cta">
                <Link href="dao" className="btn btn--secondary">Join the DAO</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center mt-8">
          <div className="col-12 col-lg-10">
            <div className="royalty-box p-6 text-center rounded-xl shadow-md">
              <h3 className="title">Royalty Rewards</h3>
              <p>
                Every resale triggers automatic royalty distribution:
              </p>
              <ul className="text-left mt-4">
                <li><strong>Example:</strong> Alice mints & sells art for 10 ICP → Bob resells for 20 ICP</li>
                <li><i className="material-symbols-outlined">arrow_forward</i> 18 ICP → Bob (reseller)</li>
                <li><i className="material-symbols-outlined">arrow_forward</i> 1.5 ICP → Alice (creator royalty, 7.5%)</li>
                <li><i className="material-symbols-outlined">arrow_forward</i> 0.5 ICP → DAO Treasury (2.5%)</li>
              </ul>
              <p className="mt-4">Royalties ensure creators earn <strong>forever</strong> as their work circulates.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPlan;

