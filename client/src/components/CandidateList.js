import React, { useState } from "react";
import "./CandidateList.css";
import AAP from "../images/aap.png";
import Congress from "../images/Congress.jpg";
import Nota from "../images/Nota.jpg";

function CandidateList() {
  return (
    <>
      <section id="facilities">
        <div className="title">
          <h1>Candidate's List</h1>
        </div>

        <div className="containers">
          <div
            className="row gy-3"
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "1.3rem",
              paddingBottom: "1.3rem",
            }}
          >
            <div className="col-sm-12 col-md-6 col-lg-4 py-3">
              <div className="card" style={{ width: "18rem" }}>
                <div className="inner">
                  <img className="card-img-top" src={Congress} alt="Card"></img>
                </div>
                <div className="card-body text-center">
                  <h5 className="card-title">CONGRESS</h5>
                  <p className="card-text">
                    Rahul Gandhi is an Indian politician and a member of the
                    Indian Parliament,constituency of Wayanad, Kerala in 17th
                    Lok Sabha.
                  </p>
                  <button className="btn btn-primary">Click to Vote</button>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4 py-3">
              <div className="card" style={{ width: "18rem" }}>
                <div className="inner">
                  <img className="card-img-top" src={AAP} alt="Card"></img>
                </div>
                <div className="card-body text-center">
                  <h5 className="card-title">AAP</h5>
                  <p className="card-text">
                    Arvind Kejriwal is an Indian politician and a former
                    bureaucrat who is the current and 7th Chief Minister of
                    Delhi since February 2015.
                  </p>
                  <button className="btn btn-primary">Click to Vote</button>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4 py-3">
              <div className="card" style={{ width: "18rem" }}>
                <div className="inner">
                  <img
                    className="card-img-top"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/1200px-Bharatiya_Janata_Party_logo.svg.png"
                    alt="Card"
                  ></img>
                </div>
                <div className="card-body text-center">
                  <h5 className="card-title">BJP</h5>
                  <p className="card-text">
                    Narendra Damodardas Modi is an Indian politician serving as
                    the 14th and current prime minister of India since 2014.
                  </p>
                  <button className="btn btn-primary">Click to Vote</button>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4 py-3">
              <div className="card" style={{ width: "18rem" }}>
                <div className="inner">
                  <img
                    className="card-img-top"
                    src="https://timesofindia.indiatimes.com/thumb/msid-80876920,imgsize-57317,width-400,resizemode-4/80876920.jpg"
                    alt="Card"
                  ></img>
                </div>
                <div className="card-body text-center">
                  <h5 className="card-title">A.I.M.I.M</h5>
                  <p className="card-text">
                    Asaduddin Owaisi is an Indian politician, who is the
                    President of the All India Majlis-e-Ittehadul Muslimeen.
                  </p>
                  <button className="btn btn-primary">Click to Vote</button>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4 py-3">
              <div className="card" style={{ width: "18rem" }}>
                <div className="inner">
                  <img className="card-img-top" src={Nota} alt="Card"></img>
                </div>
                <div className="card-body text-center">
                  <h5 className="card-title">NOTA</h5>
                  <p className="card-text">
                    "None of the above", or NOTA for short, also known as
                    "against all" or a "scratch" vote.
                  </p>
                  <button className="btn btn-primary">Click to Vote</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default CandidateList;
