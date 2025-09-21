import Image from "next/image";
import one from "@/public/images/o-one.png";
import two from "@/public/images/o-two.png";
import three from "@/public/images/o-three.png";

const AboutOverview = () => {
  return (
    <section className="section overview-two fade-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-7">
            <div className="section__header section__content text-center">
              <span className="sub-title">AI & Web3</span>
              <h2 className="title title-animation">
                Powering the Future of Intelligence with{" "}
                <span className="text-primary">NeuroNet DAO</span>
              </h2>
              <p>
                NeuroNet DAO combines decentralized governance to unlock new possibilities in AI
                digital economies. Our tools enable communities to co-create,
                own, and scale intelligence like never before.
              </p>
            </div>
          </div>
        </div>
        <div className="row align-items-center justify-content-center gaper">
          <div className="col-12 col-sm-9 col-md-6 col-xl-4">
            <div className="overview-two__single text-center fade-top">
              <div className="thumb">
                <Image src={one} alt="Analytics" priority />
              </div>
              <div className="content">
                <h4 className="text-white">Decentralized Insights</h4>
                <p className="tertiary-text">
                  Harness collective intelligence with transparent,
                  community-driven analytics and AI-powered predictions.
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-9 col-md-6 col-xl-4">
            <div className="overview-two__single text-center fade-top">
              <div className="thumb">
                <Image src={two} alt="Programming" priority />
              </div>
              <div className="content">
                <h4 className="text-white">Collaborative AI Building</h4>
                <p className="tertiary-text">
                  Empower developers and creators to co-build advanced
                  algorithms, smart contracts, and generative models.
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-9 col-md-6 col-xl-4">
            <div className="overview-two__single text-center fade-top">
              <div className="thumb">
                <Image src={three} alt="Cloud AI" priority />
              </div>
              <div className="content">
                <h4 className="text-white">On-Chain AI Integration</h4>
                <p className="tertiary-text">
                  Seamlessly integrate AI with decentralized infrastructure,
                  enabling trustless, scalable, and borderless intelligence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutOverview;

