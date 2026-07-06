import React from 'react';
import Artist from '../img/artist.jpg';
import Checkmark from '../img/check.png';
import {FaEllipsisH, FaHeadphones, FaCheck} from 'react-icons/fa';

function Banner() {
  return (
    <div className='banner'>
        <img src={Artist} alt="" className='bannerImg' />
        <div className="content">
            <div className="breadCrumb">
                <p>Home <span>/ Popular Artists</span></p>
                <i><FaEllipsisH/></i>
            </div>
            <div className="artist">
                <div className="left">
                    <div className="name">
                        <h2>A-HA</h2>
                        <img src={Checkmark} alt="" />
                    </div>
                    <p><i><FaHeadphones/></i> 11,113,334 <span>Monthly Listeners</span></p>

                </div>
                <div className="right">
                    <a href="#">Play</a>
                    <a href="#"><i><FaCheck/></i> Following</a>
                </div>
            </div>
        </div>

        <div className="bottomLayer">

        </div>
    </div>
  )
}

export {Banner}