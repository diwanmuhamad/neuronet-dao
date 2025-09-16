import Image from "next/image";
import Counter from "../Counter";
import Star from "@/public/images/star-two.png";

const CounterOne = () => {
  return (
    <section className="counter section pb-0 fade-wrapper">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="counter__inner">
              
              <div className="counter__single">
                <h2 className="light-title">
                  <span className="odometer">
                    <Counter value={25} />
                  </span>
                  <span className="prefix"> K+</span>
                </h2>
                <p className="primary-text">Active DAO Members</p>
              </div>

              <div className="counter__single d-none d-xxl-block">
                <Image src={Star} alt="Divider Star" priority />
              </div>

              <div className="counter__single">
                <h2 className="light-title">
                  <span className="odometer">
                    <Counter value={120} />
                  </span>
                  <span className="prefix"> K+</span>
                </h2>
                <p className="primary-text">Governance Votes Cast</p>
              </div>

              <div className="counter__single d-none d-xxl-block">
                <Image src={Star} alt="Divider Star" priority />
              </div>

              <div className="counter__single">
                <h2 className="light-title">
                  <span className="odometer">
                    <Counter value={500} />
                  </span>
                  <span className="prefix"> +</span>
                </h2>
                <p className="primary-text">AI Models Deployed</p>
              </div>

              <div className="counter__single d-none d-xxl-block">
                <Image src={Star} alt="Divider Star" priority />
              </div>

              <div className="counter__single">
                <h2 className="light-title">
                  <span className="odometer">
                    <Counter value={2} />
                  </span>
                  <span className="prefix"> M+</span>
                </h2>
                <p className="primary-text">Data Transactions Secured</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CounterOne;

