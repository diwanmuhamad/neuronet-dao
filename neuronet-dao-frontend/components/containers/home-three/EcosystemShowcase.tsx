import Image from "next/image";
import Link from "next/link";
import one from "@/public/images/gaming/one.png";
import two from "@/public/images/gaming/two.png";
import three from "@/public/images/gaming/three.png";

const EcosystemShowcase = () => {
  return (
    <section className="section pb-0 ecosystem">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section__header--secondary">
              <div className="row align-items-center justify-content-center gaper">
                <div className="col-12 col-md-8 col-lg-6 col-xl-6">
                  <div className="section__header mb-0 text-center text-lg-start">
                    <span className="sub-title-two text-primary">
                      NeuroNet Ecosystem
                    </span>
                    <h2 className="title title-animation">
                      Explore Decentralized AI Tools & dApps
                    </h2>
                  </div>
                </div>
                <div className="col-12 col-md-8 col-lg-6 col-xl-5 offset-xl-1">
                  <div className="text-center text-lg-start">
                    <p>
                      The NeuroNet DAO ecosystem is home to groundbreaking AI
                      applications, community-driven tools, and blockchain-based
                      governance models. Discover projects built to empower
                      developers, creators, and researchers worldwide.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row gaper fade-wrapper">
          <div className="col-12 col-xl-6">
            <div className="ecosystem__single-alt fade-top">
              <div className="thumb">
                <Link href="project-single">
                  <Image src={one} alt="AI Project" priority />
                </Link>
              </div>
              <div className="content">
                <Link href="ecosystem" className="tag">
                  AI Marketplace
                </Link>
                <h4>
                  <Link href="project-single">ModelHub Exchange</Link>
                </h4>
                <div className="info">
                  <p className="tertiary-text">Launch Date</p>
                  <p className="text-white">Q4 2025</p>
                </div>
                <hr />
                <div className="cta">
                  <Link href="project-single">View Details</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="ecosystem__single fade-top">
              <div className="thumb">
                <Link href="project-single">
                  <Image src={two} alt="Governance Tool" priority />
                </Link>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="ecosystem__single fade-top">
              <div className="thumb">
                <Link href="project-single">
                  <Image src={three} alt="AI dApp" priority />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="section__cta text-center">
              <Link href="ecosystem" className="btn btn--primary">
                Explore All
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcosystemShowcase;

