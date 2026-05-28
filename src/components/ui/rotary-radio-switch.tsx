import React from 'react';
import styled from 'styled-components';

interface RadioProps {
  currentFloor: number;
  onFloorChange: (floor: number) => void;
}

const Radio: React.FC<RadioProps> = ({ currentFloor, onFloorChange }) => {
  return (
    <StyledWrapper>
      <div className="container">
        <div className="de">
          <div className="den">
            <hr className="line" />
            <hr className="line" />
            <hr className="line" />
            <div className="switch">
              <label htmlFor="switch_off"><span>G</span></label>
              <label htmlFor="switch_1"><span>1</span></label>
              <label htmlFor="switch_2"><span>2</span></label>
              <label htmlFor="switch_3"><span>3</span></label>
              <label htmlFor="switch_4"><span>4</span></label>
              <label htmlFor="switch_5"><span>5</span></label>
              
              <input 
                type="radio" 
                name="switch" 
                id="switch_off" 
                checked={currentFloor === 0}
                onChange={() => onFloorChange(0)}
              />
              <input 
                type="radio" 
                name="switch" 
                id="switch_1" 
                checked={currentFloor === 1}
                onChange={() => onFloorChange(1)}
              />
              <input 
                type="radio" 
                name="switch" 
                id="switch_2" 
                checked={currentFloor === 2}
                onChange={() => onFloorChange(2)}
              />
              <input 
                type="radio" 
                name="switch" 
                id="switch_3" 
                checked={currentFloor === 3}
                onChange={() => onFloorChange(3)}
              />
              <input 
                type="radio" 
                name="switch" 
                id="switch_4" 
                checked={currentFloor === 4}
                onChange={() => onFloorChange(4)}
              />
              <input 
                type="radio" 
                name="switch" 
                id="switch_5" 
                checked={currentFloor === 5}
                onChange={() => onFloorChange(5)}
              />
              
              <div className="light"><span /></div>
              <div className="dot"><span /></div>
              <div className="dene">
                <div className="denem">
                  <div className="deneme">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  /* SCALE DOWN FOR BETTER UI FIT */
  transform: scale(0.6);
  transform-origin: right bottom;

  .container .origin {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 111;
    width: 2px;
    height: 2px;
    margin: -1px 0 0 -1px;
    background-color: #f50;
  }

  .de {
    user-select: none;
    position: relative;
    width: 230px;
    height: 230px;
    border-radius: 100%;
    box-shadow: 0 0 25px rgba(0, 0, 0, .5);
    background-color: transparent;
  }

  .de .den, .de .dene, .de .denem, .de .deneme, .de .light, .de .dot {
    position: absolute;
    left: 50%;
    top: 50%;
  }

  .den {
    position: relative;
    width: 220px;
    height: 220px;
    margin: -110px 0 0 -110px;
    border-radius: 100%;
    box-shadow: inset 0 3px 10px rgba(0, 0, 0, .6), 0 2px 20px rgba(255, 255, 255, 0.1);
    background: #333;
    background: -moz-radial-gradient(center, ellipse cover, #666 0%, #111 100%);
    background: -webkit-gradient(radial, center center, 0px, center center, 100%, color-stop(0%, #666), color-stop(100%, #111));
    background: -webkit-radial-gradient(center, ellipse cover, #666 0%, #111 100%);
    background: -o-radial-gradient(center, ellipse cover, #666 0%, #111 100%);
  }

  .dene {
    z-index: 4;
    width: 140px;
    height: 140px;
    margin: -70px 0 0 -70px;
    border-radius: 100%;
    box-shadow: inset 0 2px 2px rgba(255, 255, 255, .2), 0 3px 13px rgba(0, 0, 0, .85);
    background: #222;
    background: -webkit-linear-gradient(top, #444 0%, #222 100%);
  }

  .denem {
    width: 120px;
    height: 120px;
    margin: -60px 0 0 -60px;
    border-radius: 100%;
    background: #222;
    background: -webkit-linear-gradient(top, #222 0%, #444 100%);
  }

  .deneme {
    width: 100px;
    height: 100px;
    margin: -50px 0 0 -50px;
    border-radius: 100%;
    box-shadow: inset 0 2px 3px rgba(255, 255, 255, .1), 0 8px 20px rgba(0, 0, 0, .9);
    background: #333;
    background: -webkit-linear-gradient(top, #444 0%, #111 100%);
  }

  .den .switch {
    z-index: 3;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .den .switch label {
    z-index: 2;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50%;
    height: 70px;
    margin-top: -35px;
    transform-origin: 0% 50%;
    cursor: pointer;
  }

  .den .switch label span {
    z-index: 2;
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 100%;
    font-weight: bold;
    font-size: 18px;
    line-height: 70px;
    text-align: center;
    color: #888;
    text-shadow: 0 1px 0 #000;
    transition: color 0.3s;
  }

  .den .switch label:hover span {
    color: #fff;
  }

  .den .switch label:nth-child(1) { transform: rotate(-90deg); }
  .den .switch label:nth-child(1) span { right: 2px; transform: rotate(90deg); }

  .den .switch label:nth-child(2) { transform: rotate(-30deg); }
  .den .switch label:nth-child(2) span { transform: rotate(30deg); }

  .den .switch label:nth-child(3) { transform: rotate(30deg); }
  .den .switch label:nth-child(3) span { transform: rotate(-30deg); }

  .den .switch label:nth-child(4) { transform: rotate(90deg); }
  .den .switch label:nth-child(4) span { transform: rotate(-90deg); }

  .den .switch label:nth-child(5) { transform: rotate(150deg); }
  .den .switch label:nth-child(5) span { transform: rotate(-150deg); }

  .den .switch label:nth-child(6) { transform: rotate(210deg); }
  .den .switch label:nth-child(6) span { transform: rotate(-210deg); }

  .den .switch input {
    position: absolute;
    opacity: 0;
    visibility: hidden;
  }

  /* SWITCH LIGHT */

  .den .light {
    z-index: 1;
    width: 50%;
    height: 100px;
    margin-top: -50px;
    transform-origin: 0% 50%;
    transition: all .5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .den .light span {
    opacity: .6;
    position: absolute;
    top: 0;
    left: 15px;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle at center, rgba(212, 175, 55, 1) 0%, rgba(212, 175, 55, 0.2) 50%, transparent 70%);
  }

  /* SWITCH LIGHT POSITION */
  .den #switch_off:checked ~ .light { transform: rotate(-90deg); }
  .den #switch_1:checked ~ .light { transform: rotate(-30deg); }
  .den #switch_2:checked ~ .light { transform: rotate(30deg); }
  .den #switch_3:checked ~ .light { transform: rotate(90deg); }
  .den #switch_4:checked ~ .light { transform: rotate(150deg); }
  .den #switch_5:checked ~ .light { transform: rotate(210deg); }

  /* ACTIVE STATE LABEL COLOR */
  .den #switch_off:checked ~ div label:nth-child(1) span { color: #d4af37; text-shadow: 0 0 10px rgba(212, 175, 55, 0.5); }
  .den #switch_1:checked ~ div label:nth-child(2) span { color: #d4af37; }
  .den #switch_2:checked ~ div label:nth-child(3) span { color: #d4af37; }
  .den #switch_3:checked ~ div label:nth-child(4) span { color: #d4af37; }
  .den #switch_4:checked ~ div label:nth-child(5) span { color: #d4af37; }
  .den #switch_5:checked ~ div label:nth-child(6) span { color: #d4af37; }

  /* SWITCH DOT */

  .den .dot {
    z-index: 6;
    width: 50%;
    height: 12px;
    margin-top: -6px;
    transform-origin: 0% 50%;
    transition: all .5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .den .dot span {
    position: absolute;
    top: 0;
    left: 30px;
    width: 12px;
    height: 12px;
    border-radius: 100%;
    background: #d4af37;
    box-shadow: 0 0 10px rgba(212, 175, 55, 0.8), inset 0 2px 2px rgba(255,255,255,0.5);
  }

  .den #switch_off:checked ~ .dot { transform: rotate(-90deg); }
  .den #switch_1:checked ~ .dot { transform: rotate(-30deg); }
  .den #switch_2:checked ~ .dot { transform: rotate(30deg); }
  .den #switch_3:checked ~ .dot { transform: rotate(90deg); }
  .den #switch_4:checked ~ .dot { transform: rotate(150deg); }
  .den #switch_5:checked ~ .dot { transform: rotate(210deg); }

  /* LINE */

  .den hr.line {
    z-index: 1;
    position: absolute;
    top: 50%;
    width: 100%;
    height: 0;
    margin-top: -1px;
    border-width: 1px 0;
    border-style: solid;
    border-top-color: #222;
    border-bottom-color: #444;
  }

  .den hr.line:nth-child(1) { transform: rotate(-60deg); }
  .den hr.line:nth-child(2) { transform: rotate(60deg); }
`;

export default Radio;
