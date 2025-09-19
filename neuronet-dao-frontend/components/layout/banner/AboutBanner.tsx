import Image from "next/image";
import Link from "next/link";
import Frame from "@/public/images/frame-one.png";

const AboutBanner = () => {
  return (
    <section className="about-banner">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="about-banner__content section__content">
              <span className="sub-title">Who We Are</span>
              <h2 className="light-title title-animation fw-7 text-white">
                NeuroNet DAO is <span className="text-primary">redefining</span> the future of Artificial Intelligence by creating the world’s first <span className="text-primary">decentralized AI economy</span></h2>
              <p className="text-white mt-3">
                In today’s AI landscape, creators struggle with lost ownership, unfair compensation, and lack of transparency. NeuroNet DAO was built to change this reality.  
                Our platform ensures that every AI asset is <strong>verified on-chain</strong>, every creator is <strong>fairly rewarded</strong> through automated royalties, and every participant operates in a <strong>transparent and community-driven marketplace</strong>.
              </p>
              <p className="text-white mt-3">
                With NeuroNet DAO, innovators gain <strong>authenticity</strong> for their work, <strong>secure licensing</strong> for their assets, and a sustainable channel to <strong>monetize ideas globally</strong>.  
                Enterprises access a trusted pool of AI-native solutions, while developers and creators thrive in an ecosystem that protects originality and encourages collaboration.
              </p>
              <p className="text-white mt-3">
                The vision behind NeuroNet DAO was brought to life by three bold minds — <strong>[Dewantara - The CEO]</strong>, <strong>[Ilham Dirgantara - The COO]</strong>, and <strong>[Diwan M - The CTO]</strong>. Together, these visionaries combined expertise in <em>AI innovation, blockchain technology, and product strategy</em> to craft a solution that not only solves today’s challenges but also paves the way for a more open and fair digital economy.
              </p>
              <p className="text-white fw-6 mt-3">
                Our mission is ambitious yet clear: to unlock a borderless AI marketplace where <strong>ideas thrive</strong>, <strong>creators prosper</strong>, and the world benefits from a future that is more <span className="text-primary">intelligent, fair, and inclusive</span>.
              </p>
              <p>
                NeuroNet DAO is more than a platform — it is a{" "}
                <strong>fully on-chain AI marketplace</strong> that empowers
                creators, innovators, and communities. Our mission is to make
                AI development and usage{" "}
                <strong>transparent, fair, and community-governed</strong>.
              </p>
              <p>
                By leveraging blockchain and DAO governance, we ensure{" "}
                <strong>creators receive fair royalties, users gain trust and
                verifiable ownership, and AI becomes accessible for all</strong>.  
                Together, we are building a sustainable ecosystem where innovation
                thrives without the control of centralized platforms.
              </p>
              </div>
          </div>
        </div>
      </div>
      <Link className="scroll-position-btn" href="#scrollPosition">
        <Image src={Frame} alt="Image" priority />
        <i className="bi bi-arrow-down"></i>
      </Link>
    </section>
  );
};

export default AboutBanner;
            
