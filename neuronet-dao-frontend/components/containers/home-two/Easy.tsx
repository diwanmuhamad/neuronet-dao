import Image from "next/image";
import Link from "next/link";
import Thumb from "@/public/images/easy-thumb.png";

const Easy = () => {
  return (
    <section className="section easy pb-0 position-relative">
      <div className="container">
        <div className="row gaper align-items-center">
          
          <div className="col-12 col-lg-6 col-xl-5">
            <div className="easy__thumb dir-rtl reveal-img d-block parallax-img">
              <Image src={Thumb} alt="Neuronet AI Agents" className="unset" />
            </div>
          </div>

          <div className="col-12 col-lg-6 col-xl-5 offset-xl-2">
            <div className="section__content">
              <span className="sub-title-two text-primary">Neuronet Agents</span>
              <h2 className="title title-animation">
                Decentralized AI Agents for Everyday Use
              </h2>
              <p>
                Neuronet DAO empowers you with autonomous AI agents that work 
                seamlessly across your digital life. From governance assistance 
                to data analysis and automated decision-making, our agents are 
                designed to evolve with every interaction—transparent, trustless, 
                and community-owned.
              </p>
              <div className="section__content-cta">
                <Link href="sign-in" className="btn btn--primary">
                  Chat Agent
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Easy;

