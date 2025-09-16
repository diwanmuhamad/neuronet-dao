const VideoSection = () => {
  return (
    <section className="section video-s pb-0">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="video-s__inner">

              <div className="row justify-content-center">
                <div className="col-12 col-lg-9 col-xxl-7">
                  <div className="section__header text-center">
                    <h2 className="title mt-0 title-animation">
                      Building a Sustainable Creator Economy
                    </h2>
                    <p>
                      NeuroNet DAO is more than a marketplace. We’re building an ecosystem 
                      where <strong>creators earn fair royalties, sellers unlock reduced fees through staking, 
                      and the community governs the future</strong>.
                    </p>
                    <p>
                      This short video explains how our platform model works — 
                      from <strong>5% platform fees</strong> to <strong>2% with staking</strong>, 
                      and how royalties are <strong>auto-distributed on resale</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="video-s__content">
                    <video autoPlay loop muted controls>
                      <source src="/videos/intro.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
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

export default VideoSection;

