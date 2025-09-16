import Image from "next/image";
import Link from "next/link";
import One from "@/public/images/o-one.png";
import Two from "@/public/images/o-two.png";
import Three from "@/public/images/o-three.png";

const OverviewTwo = () => {
  return (
    <section className="section overview-two fade-wrapper pb-0">
      <div className="container">
        <div className="row align-items-center justify-content-center gaper">

          <div className="col-12 col-sm-9 col-md-6 col-xl-4">
            <div className="overview-two__single text-center fade-top">
              <div className="thumb">
                <Image src={One} alt="Decentralized Analytics" priority />
              </div>
              <div className="content">
                <h4>
                  <Link href="/service-single">On-Chain Analytics</Link>
                </h4>
                <p className="tertiary-text">
                  Gain transparent insights into DAO activity, licensing flows, and contributor rewards — all powered by blockchain data.
                </p>
                <div className="section__content-cta">
                  <Link href="/service-single">
                    <span className="arrow"></span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-9 col-md-6 col-xl-4">
            <div className="overview-two__single text-center fade-top">
              <div className="thumb">
                <Image src={Two} alt="AI Governance" priority />
              </div>
              <div className="content">
                <h4>
                  <Link href="/service-single">AI Governance</Link>
                </h4>
                <p className="tertiary-text">
                  Participate in DAO voting to shape model licensing, royalty distribution, and ecosystem growth.
                </p>
                <div className="section__content-cta">
                  <Link href="/service-single">
                    <span className="arrow"></span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-9 col-md-6 col-xl-4">
            <div className="overview-two__single text-center fade-top">
              <div className="thumb">
                <Image src={Three} alt="Web3 AI Integration" priority />
              </div>
              <div className="content">
                <h4>
                  <Link href="/service-single">Web3 + AI Integration</Link>
                </h4>
                <p className="tertiary-text">
                  Connect AI models, datasets, and dApps seamlessly with decentralized infrastructure for global accessibility.
                </p>
                <div className="section__content-cta">
                  <Link href="/service-single">
                    <span className="arrow"></span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default OverviewTwo;

