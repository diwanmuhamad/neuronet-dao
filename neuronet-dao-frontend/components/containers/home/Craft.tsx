import Image from "next/image";
import Link from "next/link";
import CraftThumb from "@/public/images/craft-thumb.png";
import Shape from "@/public/images/footer/shape-one.png";

const Craft = () => {
  return (
    <section className="section craft" id="scrollPosition">
      <div className="container">
        <div className="row align-items-center gaper">
          <div className="col-12 col-lg-6 col-xxl-5">
            <div className="section__content">
              <span className="sub-title">NeuroNet DAO</span>
              <h2 className="title title-animation">
                A Fully On-Chain <span style={{textTransform: "uppercase"}}>AI</span> Marketplace
              </h2>
              <p>
                NeuroNet DAO is the world’s first{" "}
                <strong>fully on-chain, decentralized marketplace</strong>{" "}
                where anyone can buy, sell, and license{" "}
                <strong>AI outputs, prompts, and datasets</strong>.  
                Every transaction is transparent, verifiable, and secured by blockchain technology.
              </p>
              {/* <p>
                What makes us different?  
                <ul>
                  <li><strong>On-chain verification</strong> ensures trust and authenticity.</li>
                  <li><strong>Automated royalties</strong> reward creators instantly and fairly.</li>
                  <li><strong>DAO governance</strong> puts control in the hands of the community, 
                  not corporations.</li>
                </ul>
              </p> */}
              <div className="section__content-cta">
                <Link href="marketplace/prompt" className="btn btn--primary">
                  Explore the Marketplace
                </Link>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-6 col-xxl-7">
            <div className="craft__thumb text-start text-lg-end">
              <div className="reveal-img parallax-img">
                <Image src={CraftThumb} alt="NeuroNet DAO Future" priority />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="anime-one">
        <Image src={Shape} alt="Decorative Shape" priority />
      </div>
    </section>
  );
};

export default Craft;

