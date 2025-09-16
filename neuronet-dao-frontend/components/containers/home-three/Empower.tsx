import Image from "next/image";
import Link from "next/link";
import Thumb from "@/public/images/empower-thumb.png";

const Empower = () => {
  return (
    <section className="section empower fade-wrapper">
      <div className="container">
        <div className="row align-items-center gaper">

          <div className="col-12 col-lg-6 col-xl-5">
            <div className="section__content">
              <span className="sub-title-two text-primary">Decentralized AI</span>
              <h2 className="title title-animation">
                Empowering Creators with NeuroNet DAO
              </h2>
              <p>
                NeuroNet DAO is building an ecosystem where developers, researchers, 
                and communities gain true ownership over AI. Through tokenized 
                royalties, transparent governance, and staking rewards, we are 
                empowering the next generation of AI innovators.
              </p>
              <div className="section__content-cta">
                <Link href="sign-in" className="btn btn--primary">
                  Join the DAO
                </Link>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6 col-xl-6 offset-xl-1">
            <div className="empower__thumb fade-top">
              <Image src={Thumb} alt="Empower Creators" priority />
              <div className="content-wrapper">
                <div className="content text-center text-xl-end">
                  <span className="light-title">DAO</span>
                  <h2>AI Power</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Empower;

