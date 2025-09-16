import Image from "next/image";
import Link from "next/link";
import Thumb from "@/public/images/easy-two-thumb.png";

const EasyTwo = () => {
  return (
    <section className="section easy-two position-relative">
      <div className="container">
        <div className="row gaper align-items-center">
          
          <div className="col-12 col-lg-6 col-xl-6">
            <div className="easy__thumb reveal-img parallax-img">
              <Image src={Thumb} alt="Neuronet DAO Illustration" priority />
            </div>
          </div>

          <div className="col-12 col-lg-6 col-xl-5 offset-xl-1">
            <div className="section__content">
              <span className="sub-title-two">Neuronet DAO</span>
              <h2 className="title title-animation">
                Build Smarter Communities with Decentralized AI
              </h2>
              <p>
                Neuronet DAO combines AI agents with blockchain governance. 
                Members can stake tokens, propose upgrades, and earn rewards 
                as the network evolves. Transparent, autonomous, and community-driven.
              </p>
              <div className="section__content-cta">
                <Link href="/sign-in" className="btn btn--primary">
                  Join Neuronet DAO
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EasyTwo;
