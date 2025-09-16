import Image from "next/image";
import GenThumb from "@/public/images/gen-thumb.png";

const Generation = () => {
  return (
    <section className="section gen pb-0">
      <div className="container">
        <div className="row align-items-center gaper">
          <div className="col-12 col-lg-5 col-xxl-4">
            <div className="section__content">
              <span className="sub-title">NeuroNet DAO Tools</span>
              <h2 className="title title-animation">
                A Fully On-Chain AI Marketplace
              </h2>
              <p>
                NeuroNet DAO — it is a{" "}
                <strong>decentralized marketplace</strong> where users can{" "}
                create, verify, and license{" "}
                <strong>AI outputs, prompts, and datasets</strong>.
              </p>
              <p>
                Powered by blockchain and governed by a DAO, we ensure{" "}
                <strong>verifiable ownership, transparent licensing, and fair
                rewards</strong> for every creator and contributor in the 
                ecosystem.
              </p>
            </div>
          </div>
          <div className="col-12 col-lg-7 col-xxl-7 offset-xxl-1">
            <div className="gen__thumb">
              <div className="reveal-img parallax-img">
                <Image src={GenThumb} alt="NeuroNet DAO Marketplace" className="unset" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Generation;

