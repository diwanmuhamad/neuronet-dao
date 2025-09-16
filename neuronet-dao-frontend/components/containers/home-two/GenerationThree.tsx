import Image from "next/image";
import Link from "next/link";
import Thumb from "@/public/images/tools-thumb-two.png";

const GenerationThree = () => {
  return (
    <section className="section gen pb-0" id="scrollPosition">
      <div className="container">
        <div className="row align-items-center gaper">
          
          <div className="col-12 col-lg-5 col-xxl-5">
            <div className="section__content">
              <span className="sub-title-two">Neuronet DAO</span>
              <h2 className="title title-animation">
                A Fully On-Chain AI Marketplace
              </h2>
              <p>
                Neuronet DAO is a decentralized hub where users can sell, verify,
                and license AI models, prompts, and datasets. Every transaction 
                is governed by smart contracts, ensuring transparency, security, 
                and fair royalties for creators and contributors.
              </p>
              <div className="section__content-cta">
                <Link href="/sign-in" className="btn btn--primary">
                  Join the Marketplace
                </Link>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-7 col-xxl-6 offset-xxl-1">
            <div className="gen__thumb">
              <div className="reveal-img parallax-img">
                <Image src={Thumb} alt="Neuronet Marketplace Illustration" className="unset" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default GenerationThree;

