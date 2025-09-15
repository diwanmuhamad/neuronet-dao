import Image from "next/image";
import Link from "next/link";
import thumb from "@/public/images/contact/thumb.png";
import mail from "@/public/images/contact/mail.png";
import phone from "@/public/images/contact/phone.png";
import location from "@/public/images/contact/location.png";

const ContactSection = () => {
  return (
    <section className="section m-contact fade-wrapper">
      <div className="container">
        <div className="row gaper section pt-0">
          {/* Email */}
          <div className="col-12 col-sm-6 col-lg-4">
            <div className="m-contact__single fade-top">
              <div className="thumb">
                <Image src={mail} alt="Email Icon" priority />
              </div>
              <div className="content">
                <h3>Email</h3>
                <p>
                  <Link href="mailto:idirga37@gmail.com">
                    idirga37@gmail.com
                  </Link>
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-4">
            <div className="m-contact__single fade-top">
              <div className="thumb">
                <Image src={phone} alt="Phone Icon" priority />
              </div>
              <div className="content">
                <h3>Phone</h3>
                <p>
                  <Link href="tel:+6281339137304">+62 813-3913-7304</Link>
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-4">
            <div className="m-contact__single fade-top">
              <div className="thumb">
                <Image src={location} alt="Location Icon" priority />
              </div>
              <div className="content">
                <h3>Location</h3>
                <p>
                  <Link
                    href="https://maps.google.com/?q=Denpasar,Bali,Indonesia"
                    target="_blank"
                  >
                    Denpasar, Bali, Indonesia
                  </Link>
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-4">
            <div className="m-contact__single fade-top">
              <div className="thumb">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2H21.5l-7.59 8.69L22 22h-6.845l-5.364-6.67L4.5 22H1.243l8.088-9.26L2 2h6.927l4.846 5.91L18.244 2z" />
                </svg>
              </div>
              <div className="content">
                <h3>X (Twitter)</h3>
                <p>
                  <Link href="https://x.com/NeuronetD62150" target="_blank">
                    @NeuronetD62150
                  </Link>
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-6 col-xl-6">
            <div className="m-contact__form">
              <h3 className="title-animation fw-7 text-white text-uppercase mt-12">
                PLEASE MESSAGE US, IF YOU HAVE ANY QUERIES
              </h3>
              <form action="#" method="post">
                <div className="input-single">
                  <input
                    type="text"
                    name="c-name"
                    id="cName"
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div className="input-single">
                  <input
                    type="email"
                    name="c-Email"
                    id="cEmail"
                    placeholder="Your Email"
                    required
                  />
                </div>
                <div className="input-single">
                  <input
                    type="text"
                    name="c-number"
                    id="cnumber"
                    placeholder="Phone Number"
                    required
                  />
                </div>
                <div className="input-single">
                  <textarea
                    name="c-message"
                    id="cMessage"
                    cols={30}
                    rows={10}
                    placeholder="Type A Message"
                  ></textarea>
                </div>
                <div className="section__content-cta text-center">
                  <button type="submit" className="btn btn--primary">
                    Submit Now
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="col-12 col-lg-6 col-xl-5 offset-xl-1">
            <div className="m-contact__thumb reveal-img parallax-img">
              <Image src={thumb} alt="Contact Illustration" priority />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
