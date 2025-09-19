import Image from "next/image";
import Link from "next/link";
import one from "@/public/images/revolution/one.png";
import two from "@/public/images/revolution/two.png";
import three from "@/public/images/revolution/three.png";

const AiRevolution = () => {
  return (
    <section className="section revolution pb-0">
      <div className="container">

        <div className="row justify-content-center">
          <div className="col-12 col-lg-7">
            <div className="section__header text-center">
              <span className="sub-title-two text-primary">NeuroNet DAO</span>
              <h2 className="title title-animation">
                Revolutionizing <span style={{textTransform: "uppercase"}}>AI</span> Collaboration and Ownership
              </h2>
            </div>
          </div>
        </div>

        <div className="row gaper fade-wrapper">
          <div className="col-12 col-md-6 col-lg-4">
            <div className="revolution__single fade-top">
              <div className="thumb">
                <Link href="service-single">
                  <Image src={one} alt="Decentralized Marketplace" priority />
                </Link>
                <span className="tag">Marketplace</span>
              </div>
              <div className="content">
                <Link href="service-single" className="primary-text">
                  Fully On-Chain Trading
                  <span className="arrow"></span>
                </Link>
                <p>
                  Buy, sell, and license AI models, datasets, and prompts directly 
                  on-chain with transparency and trust.
                </p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <div className="revolution__single fade-top">
              <div className="thumb">
                <Link href="service-single">
                  <Image src={two} alt="Staking Utility" priority />
                </Link>
                <span className="tag">Staking</span>
              </div>
              <div className="content">
                <Link href="service-single" className="primary-text">
                  Reduced Fees & Rewards
                  <span className="arrow"></span>
                </Link>
                <p>
                  Stake $NND tokens to lower platform fees and earn a share of 
                  treasury rewards as the ecosystem grows.
                </p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <div className="revolution__single fade-top">
              <div className="thumb">
                <Link href="service-single">
                  <Image src={three} alt="DAO Governance" priority />
                </Link>
                <span className="tag">Governance</span>
              </div>
              <div className="content">
                <Link href="service-single" className="primary-text">
                  Community-Led Decisions
                  <span className="arrow"></span>
                </Link>
                <p>
                  Shape the future of NeuroNet DAO through voting, proposals, 
                  and progressive decentralization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiRevolution;

