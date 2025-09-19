import Image from "next/image";
import Link from "next/link";
import CraftThumb from "@/public/images/craft-thumb.png";
import Shape from "@/public/images/footer/shape-one.png";

const AboutCraft = () => {
  return (
    <section className="section pb-0 craft">
      <div className="container">
        <div className="row align-items-center gaper">
          <div className="col-12 col-lg-6 col-xxl-5">
            <div className="section__content">
            <span className="sub-title">AI Collaboration</span>
            <h2 className="title title-animation">
              Crafting Tomorrow’s Intelligence with <span className="text-primary">NeuroNet DAO</span>
            </h2>
            <p>
              NeuroNet DAO empowers creators, developers, and communities to shape the
              future of AI. By combining decentralized governance with cutting-edge
              generative models, we enable collective ownership of innovation —
              transforming the way intelligence is built, shared, and monetized.
            </p>
            {/* <div className="section__content-cta">
              <Link href="shop" className="btn btn--primary">
                Join the Network
              </Link>
            </div> */}
            </div>
          </div>
          <div className="col-12 col-lg-6 col-xxl-7">
            <div className="craft__thumb text-start text-lg-end">
              <div className="reveal-img parallax-img">
                <Image src={CraftThumb} alt="Image" priority />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="anime-one">
        <Image src={Shape} alt="Image" priority />
      </div>
    </section>
  );
};

export default AboutCraft;
