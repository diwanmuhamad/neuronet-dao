import Image from "next/image";
import ToolsThumb from "@/public/images/tools-thumb.png";

const Tools = () => {
  return (
    <section className="section tools pb-0">
      <div className="container">
        <div className="row gaper align-items-center">
          {/* Left Side - Image */}
          <div className="col-12 col-lg-7">
            <div className="tools__thumb dir-rtl">
              <div className="reveal-img parallax-img">
                <Image src={ToolsThumb} alt="Tools Illustration" className="unset" />
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="col-12 col-lg-5 col-xxl-4 offset-xxl-1 order-first order-lg-last">
            <div className="section__content">
              <span className="sub-title">NeuroNet DAO</span>
              <h2 className="title title-animation">
                Building the Future of On-Chain AI Collaboration
              </h2>
              <p>
                Our marketplace empowers creators, developers, and collectors with 
                <strong> fair royalties, reduced fees through staking, and decentralized licensing</strong>.  
                Every transaction is powered by the Internet Computer (ICP), ensuring 
                <strong> transparency, speed, and true ownership</strong>.
              </p>
              <p>
                By participating in <strong>staking and governance</strong>, the community directly 
                shapes the evolution of AI tools, datasets, and model distribution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tools;

