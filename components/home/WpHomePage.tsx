import Link from "next/link";
import HeroSlider from "@/components/home/HeroSlider";

const IMG = "https://karyaninfratech.co.in/wp-content/uploads";

export default function WpHomePage() {
  return (
    <div
      data-elementor-type="wp-post"
      data-elementor-id="9961"
      className="elementor elementor-9961"
      data-elementor-post-type="page"
    >
      {/* Hero */}
      <section className="elementor-section elementor-top-section elementor-element elementor-element-1614d97d elementor-section-full_width elementor-section-height-default elementor-section-height-default">
        <div className="elementor-container elementor-column-gap-no">
          <div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-1796f446">
            <div className="elementor-widget-wrap elementor-element-populated">
              <div className="elementor-element elementor-element-3a703ad elementor-widget elementor-widget-hero_slider">
                <HeroSlider />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About intro */}
      <section className="elementor-section elementor-top-section elementor-element elementor-element-39f1c896 elementor-section-boxed elementor-section-height-default elementor-section-height-default">
        <div className="elementor-container elementor-column-gap-default">
          <div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-3cfedb3b">
            <div className="elementor-widget-wrap elementor-element-populated">
              <div className="elementor-element elementor-element-47d7e570 elementor-widget elementor-widget-heading">
                <div className="elementor-widget-container">
                  <h4 className="elementor-heading-title elementor-size-default">
                    About us
                  </h4>
                </div>
              </div>
              <div className="elementor-element elementor-element-74df3677 elementor-widget elementor-widget-heading">
                <div className="elementor-widget-container">
                  <h2 className="elementor-heading-title elementor-size-default">
                    Karyan Infratech LLP is a vision born of the Karyan Group,
                    aimed at conceptualizing, executing, and delivering premier
                    real estate developments across India.
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision + image */}
      <section className="elementor-section elementor-top-section elementor-element elementor-element-6de4d4c5 elementor-section-boxed elementor-section-height-default elementor-section-height-default">
        <div className="elementor-container elementor-column-gap-default">
          <div className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-53d88dbf">
            <div className="elementor-widget-wrap elementor-element-populated">
              <div className="elementor-element elementor-element-88ba6a7 elementor-widget elementor-widget-feature_box">
                <div className="elementor-widget-container">
                  <div className="card-item sty2">
                    <span className="card-item_num" />
                    <h4 className="service-title">Our Vision</h4>
                    <div className="card-desc">
                      <p>
                        We are dedicated to fulfilling all of our commitments and
                        building value for our stakeholders with integrity,
                        transparency, and pride.
                      </p>
                    </div>
                    <div className="clearfix" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-b73f99e">
            <div className="elementor-widget-wrap elementor-element-populated">
              <div className="elementor-element elementor-element-7391e7a elementor-widget__width-initial elementor-widget elementor-widget-image">
                <div className="elementor-widget-container">
                  <img
                    decoding="async"
                    width={889}
                    height={542}
                    src={`${IMG}/2026/04/our_vision.webp`}
                    className="attachment-full size-full"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission + image */}
      <section className="elementor-section elementor-top-section elementor-element elementor-element-9280fa2 elementor-section-boxed elementor-section-height-default elementor-section-height-default">
        <div className="elementor-container elementor-column-gap-default">
          <div className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-c5b6acb">
            <div className="elementor-widget-wrap elementor-element-populated">
              <div className="elementor-element elementor-element-b2de1b0 elementor-widget elementor-widget-image">
                <div className="elementor-widget-container">
                  <img
                    loading="lazy"
                    decoding="async"
                    width={760}
                    height={422}
                    src={`${IMG}/2023/03/buying-property-concept-man-uniform-giving-keys-black-man-1-1024x569.jpg`}
                    className="attachment-large size-large"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-27e61ae">
            <div className="elementor-widget-wrap elementor-element-populated">
              <div className="elementor-element elementor-element-e25540a elementor-widget elementor-widget-feature_box">
                <div className="elementor-widget-container">
                  <div className="card-item sty2">
                    <span className="card-item_num" />
                    <h4 className="service-title">Our Mission</h4>
                    <div className="card-desc">
                      <p>
                        Our goal is to become the most recognized and respected
                        brand in real estate by creating value that lasts for
                        generations.
                      </p>
                    </div>
                    <div className="clearfix" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="elementor-section elementor-top-section elementor-element elementor-element-cd8106d elementor-section-boxed elementor-section-height-default elementor-section-height-default">
        <div className="elementor-container elementor-column-gap-default">
          <div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-0353d22">
            <div className="elementor-widget-wrap elementor-element-populated">
              <section className="elementor-section elementor-inner-section elementor-element elementor-element-225093c elementor-section-boxed elementor-section-height-default elementor-section-height-default">
                <div className="elementor-container elementor-column-gap-default">
                  <div className="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-d9431b1">
                    <div className="elementor-widget-wrap elementor-element-populated">
                      <div className="elementor-element elementor-element-c9023e6 elementor-widget elementor-widget-heading">
                        <div className="elementor-widget-container">
                          <h4 className="elementor-heading-title elementor-size-default">
                            Our Projects
                          </h4>
                        </div>
                      </div>
                      <div className="elementor-element elementor-element-2a70b6d elementor-position-right elementor-vertical-align-top elementor-widget elementor-widget-image-box">
                        <div className="elementor-widget-container">
                          <div className="elementor-image-box-wrapper">
                            <figure className="elementor-image-box-img">
                              <img
                                loading="lazy"
                                decoding="async"
                                width={1536}
                                height={1024}
                                src={`${IMG}/2026/04/20260409_1252_Image-Generation_remix_01knrhxdp4exssq8ndhw9y4r45.png`}
                                className="attachment-full size-full"
                                alt=""
                              />
                            </figure>
                            <div className="elementor-image-box-content">
                              <h3 className="elementor-image-box-title">
                                Karyan Trevana
                              </h3>
                              <p className="elementor-image-box-description">
                                Karyan Trevana Residences, address is NH-24,
                                Ghaziabad opposite to Wave City.Offer premium 3 and
                                4 BHK residences. Spread across approximately 6
                                acres*, Karyan Trevana Residences will feature 3
                                striking high-rise towers* soaring up to Ground + 38
                                floors
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section className="elementor-section elementor-inner-section elementor-element elementor-element-abbda43 elementor-section-boxed elementor-section-height-default elementor-section-height-default">
                <div className="elementor-container elementor-column-gap-default">
                  <div className="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-ea44839">
                    <div className="elementor-widget-wrap elementor-element-populated">
                      <div className="elementor-element elementor-element-7b37407 elementor-position-left elementor-vertical-align-top elementor-widget elementor-widget-image-box">
                        <div className="elementor-widget-container">
                          <div className="elementor-image-box-wrapper">
                            <figure className="elementor-image-box-img">
                              <a
                                href="https://street.karyaninfratech.co.in/"
                                tabIndex={-1}
                              >
                                <img
                                  loading="lazy"
                                  decoding="async"
                                  width={450}
                                  height={258}
                                  src={`${IMG}/2023/03/KCW-1-1-450x258.jpg`}
                                  className="attachment-theroof-project-slider size-theroof-project-slider"
                                  alt=""
                                />
                              </a>
                            </figure>
                            <div className="elementor-image-box-content">
                              <h3 className="elementor-image-box-title">
                                <a href="https://street.karyaninfratech.co.in/">
                                  Karyan CityWalk
                                </a>
                              </h3>
                              <p className="elementor-image-box-description">
                                High Street Retail Project with modern amenities
                                <br /> & state of the art infrastructure
                                <br />
                                At Delhi-Meerut Expressway
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section className="elementor-section elementor-inner-section elementor-element elementor-element-5afd107 elementor-section-boxed elementor-section-height-default elementor-section-height-default">
                <div className="elementor-container elementor-column-gap-default">
                  <div className="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-eab88a1">
                    <div className="elementor-widget-wrap elementor-element-populated">
                      <div className="elementor-element elementor-element-e974b4b elementor-position-right elementor-vertical-align-top elementor-widget elementor-widget-image-box">
                        <div className="elementor-widget-container">
                          <div className="elementor-image-box-wrapper">
                            <figure className="elementor-image-box-img">
                              <a
                                href="http://avenue-iv.karyaninfratech.co.in/"
                                tabIndex={-1}
                              >
                                <img
                                  loading="lazy"
                                  decoding="async"
                                  width={450}
                                  height={225}
                                  src={`${IMG}/2025/04/1-450x225.webp`}
                                  className="attachment-theroof-project-slider size-theroof-project-slider"
                                  alt="Avenue IV"
                                />
                              </a>
                            </figure>
                            <div className="elementor-image-box-content">
                              <h3 className="elementor-image-box-title">
                                <a href="http://avenue-iv.karyaninfratech.co.in/">
                                  Karyan Avenue IV
                                </a>
                              </h3>
                              <p className="elementor-image-box-description">
                                Karyan Avenue IV Wave City NH-24 (Delhi-Meerut
                                Expressway) Ghaziabad
                                <br />
                                First Mall At Wave City, NH-24(Delhi - Meerut
                                Expressway) Ghaziabad
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="elementor-element elementor-element-6dc6b3c elementor-position-left elementor-vertical-align-top elementor-widget elementor-widget-image-box">
                        <div className="elementor-widget-container">
                          <div className="elementor-image-box-wrapper">
                            <figure className="elementor-image-box-img">
                              <a
                                href="https://square.karyaninfratech.co.in/"
                                tabIndex={-1}
                              >
                                <img
                                  loading="lazy"
                                  decoding="async"
                                  width={450}
                                  height={253}
                                  src={`${IMG}/2025/04/g8-450x253.jpg`}
                                  className="attachment-theroof-project-slider size-theroof-project-slider"
                                  alt=""
                                />
                              </a>
                            </figure>
                            <div className="elementor-image-box-content">
                              <h3 className="elementor-image-box-title">
                                <a href="https://square.karyaninfratech.co.in/">
                                  Karyan Square
                                </a>
                              </h3>
                              <p className="elementor-image-box-description">
                                Karyan Square Wave City NH-24 (Delhi-Meerut
                                Expressway) Ghaziabad
                                <br />
                                Retail Shops & Office Space At Wave City,
                                NH-24(Delhi - Meerut Expressway) Ghaziabad
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule visit */}
      <section className="elementor-section elementor-top-section elementor-element elementor-element-cb27580 darkbg_2 notifer-block elementor-section-content-middle elementor-section-boxed elementor-section-height-default elementor-section-height-default">
        <div className="elementor-container elementor-column-gap-default">
          <div className="elementor-column elementor-col-66 elementor-top-column elementor-element elementor-element-5c80a04">
            <div className="elementor-widget-wrap elementor-element-populated">
              <div className="elementor-element elementor-element-3887eb85 elementor-widget elementor-widget-section_title">
                <div className="elementor-widget-container">
                  <div className="section-title st-left st-st7">
                    <h2 className="sec-title">
                      <span>Schedule A Free Site Visit</span>
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-7a5f8d0d">
            <div className="elementor-widget-wrap elementor-element-populated">
              <div className="elementor-element elementor-element-cc2c781 ml-auto ms-auto elementor-widget__width-auto elementor-widget-mobile__width-inherit elementor-widget elementor-widget-cthbutton">
                <div className="elementor-widget-container">
                  <Link
                    href="/contact"
                    className="tbtn tbtn color-dark normal-btn normal normalw-btn icon-left btn-no-text-no"
                  >
                    <span>Enquire Now</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="elementor-section elementor-top-section elementor-element elementor-element-c9a8bd5 paralax-section elementor-section-boxed elementor-section-height-default elementor-section-height-default">
        <div className="elementor-background-overlay" />
        <div className="elementor-container elementor-column-gap-default">
          <div className="elementor-column elementor-col-25 elementor-top-column elementor-element elementor-element-3a6c35d">
            <div className="elementor-widget-wrap elementor-element-populated">
              <div className="elementor-element elementor-element-afa07ab elementor-widget elementor-widget-counter">
                <div className="elementor-widget-container">
                  <div className="main-facts single-facts_2 hide-decor-">
                    <div className="inline-facts-wrap">
                      <div className="inline-facts">
                        <div className="milestone-counter">
                          <div className="stats animaper">
                            <div className="num" data-content="0" data-num="15">
                              15
                            </div>
                          </div>
                        </div>
                        <h6>
                          years of experience in developing residential,
                          commercial, and township projects
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="elementor-column elementor-col-25 elementor-top-column elementor-element elementor-element-c8909ab">
            <div className="elementor-widget-wrap elementor-element-populated">
              <div className="elementor-element elementor-element-78427e3 elementor-widget elementor-widget-counter">
                <div className="elementor-widget-container">
                  <div className="main-facts single-facts_2 hide-decor-no">
                    <div className="inline-facts-wrap">
                      <div className="inline-facts">
                        <div className="milestone-counter">
                          <div className="stats animaper">
                            <div className="num" data-content="0" data-num="280">
                              280
                            </div>
                          </div>
                        </div>
                        <h6>
                          Acre of land bank being transformed into the largest
                          township in Delhi- NCR
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="elementor-column elementor-col-25 elementor-top-column elementor-element elementor-element-0f7bfd7">
            <div className="elementor-widget-wrap elementor-element-populated">
              <div className="elementor-element elementor-element-14735cc elementor-widget elementor-widget-counter">
                <div className="elementor-widget-container">
                  <div className="main-facts single-facts_2 hide-decor-no">
                    <div className="inline-facts-wrap">
                      <div className="inline-facts">
                        <div className="milestone-counter">
                          <div className="stats animaper">
                            <div
                              className="num"
                              data-content="0"
                              data-num="23000"
                            >
                              23000
                            </div>
                          </div>
                        </div>
                        <h6>
                          Sq mtr of commercial space including retail, office,
                          restaurant and banquets
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="elementor-column elementor-col-25 elementor-top-column elementor-element elementor-element-10a76c1">
            <div className="elementor-widget-wrap elementor-element-populated">
              <div className="elementor-element elementor-element-7efc54f elementor-widget elementor-widget-counter">
                <div className="elementor-widget-container">
                  <div className="main-facts single-facts_2 hide-decor-yes">
                    <div className="inline-facts-wrap">
                      <div className="inline-facts">
                        <div className="milestone-counter">
                          <div className="stats animaper">
                            <div className="num" data-content="0" data-num="8">
                              8
                            </div>
                          </div>
                        </div>
                        <h6>Plus Projects delivered to satisfied customers</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick inquiry + form */}
      <section className="elementor-section elementor-top-section elementor-element elementor-element-e230e3b habout-bot elementor-section-boxed elementor-section-height-default elementor-section-height-default">
        <div className="elementor-container elementor-column-gap-default">
          <div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-7a2028a">
            <div className="elementor-widget-wrap elementor-element-populated">
              <section className="elementor-section elementor-inner-section elementor-element elementor-element-5f623b8 boxed-container overflow-visible elementor-section-boxed elementor-section-height-default elementor-section-height-default">
                <div className="elementor-container elementor-column-gap-no">
                  <div className="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-c976c3d boxed-container-title">
                    <div className="elementor-widget-wrap elementor-element-populated">
                      <div className="elementor-element elementor-element-ad800e7 elementor-widget elementor-widget-section_title">
                        <div className="elementor-widget-container">
                          <div className="section-title st-left st-st1">
                            <h4 className="sec-subtitle">
                              <span>QUICK INQUIRY</span>
                            </h4>
                            <h2 className="sec-title">
                              <span>
                                To stay updated with our projects and more
                              </span>
                            </h2>
                          </div>
                        </div>
                      </div>
                      <div className="elementor-element elementor-element-0223be6 elementor-widget elementor-widget-contact_form7">
                        <div className="elementor-widget-container">
                          <div className="contact-form7">
                            <div
                              className="wpcf7 no-js"
                              id="wpcf7-f8484-p9961-o1"
                              lang="en-US"
                              dir="ltr"
                            >
                              <form
                                className="wpcf7-form init"
                                aria-label="Contact form"
                                action="/thank-you"
                                method="get"
                              >
                                <div className="contact-form-holder custom-form">
                                  <div className="hasIcon">
                                    <p>
                                      <label>Your name*</label>
                                      <span className="wpcf7-form-control-wrap">
                                        <input
                                          size={40}
                                          maxLength={400}
                                          className="wpcf7-form-control wpcf7-text wpcf7-validates-as-required has-icon"
                                          aria-required="true"
                                          placeholder="Your Name *"
                                          type="text"
                                          name="your-name"
                                        />
                                      </span>
                                    </p>
                                  </div>
                                  <div className="hasIcon">
                                    <p>
                                      <label>Your email*</label>
                                      <span className="wpcf7-form-control-wrap">
                                        <input
                                          size={40}
                                          maxLength={400}
                                          className="wpcf7-form-control wpcf7-email wpcf7-validates-as-required wpcf7-text wpcf7-validates-as-email has-icon"
                                          aria-required="true"
                                          placeholder="Email Address *"
                                          type="email"
                                          name="your-email"
                                        />
                                      </span>
                                    </p>
                                  </div>
                                  <div id="formmobile" className="hasIcon">
                                    <p>
                                      <label>Your Mobile*</label>
                                      <span className="wpcf7-form-control-wrap">
                                        <input
                                          size={40}
                                          maxLength={400}
                                          className="wpcf7-form-control wpcf7-tel wpcf7-validates-as-required wpcf7-text wpcf7-validates-as-tel has-icon"
                                          aria-required="true"
                                          placeholder="Mobile Number *"
                                          type="tel"
                                          name="tel-154"
                                        />
                                      </span>
                                    </p>
                                  </div>
                                  <p>
                                    <input
                                      className="wpcf7-form-control wpcf7-submit has-spinner tbtn hvcolor"
                                      type="submit"
                                      value="Submit Enquiry"
                                    />
                                  </p>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-8bf98e1 boxed-container-wrap">
                    <div className="elementor-widget-wrap" />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
