import Image from "next/image";
import Bot from "@/public/images/bot-three.png";
import One from "@/public/images/r-d.png";
import Two from "@/public/images/wave.png";
import Three from "@/public/images/r-d-t.png";

const EasyThree = () => {
  return (
    <section className="section easy easy--secondary position-relative">
      <div className="container">
        <div className="row gaper align-items-center">
          
          <div className="col-12 col-lg-6 col-xl-5">
            <div className="easy__thumb dir-rtl reveal-img d-block parallax-img">
              <Image src={Bot} alt="Neuronet DAO Agents" className="unset" />
            </div>
          </div>

          <div className="col-12 col-lg-6 col-xl-6 offset-xl-1">
            <div className="section__content">
              <span className="sub-title-two text-primary">Neuronet DAO</span>
              <h2 className="title title-animation">
                Empowering Your Digital Life with Decentralized AI Agents
              </h2>
              <p>
                Neuronet AI Agents help you automate governance, streamline 
                decision-making, and collaborate across decentralized networks. 
                From personalized automation to transparent DAO operations, 
                our agents adapt and grow with the community.
              </p>

              <div className="section__content-cta">
                <div className="easy__cta">
                  
                  <div className="easy__cta-single">
                    <div className="content">
                      <h4>Governance</h4>
                      <p>On-chain Proposals & Voting</p>
                    </div>
                    <div className="thumb">
                      <Image src={One} alt="DAO Governance" priority />
                    </div>
                  </div>

                  <div className="easy__cta-single easy__cta-single-alt">
                    <div className="thumber">
                      <Image src={Two} alt="AI Network" priority />
                    </div>
                    <div className="content">
                      <h4>Collaboration</h4>
                      <p>Multi-Agent Coordination</p>
                    </div>
                    <div className="thumb">
                      <Image src={Three} alt="Agent Collaboration" priority />
                    </div>
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

export default EasyThree;
