import React from 'react';
import portraitPicture from '../../assets/images/portrait.jpg';
import './About.css';
import about from './About.json';

export default class About extends React.Component {
    render() {

        return (
            <div className='am-about'>
                <div className='am-about-main-title'>
                    <p className='am-about-title'>About Me</p>
                </div>

                <div className='am-about-profile-container'>
                    <div className='am-about-portrait-picture-container'>
                        <img className='am-about-portrait-picture' src={portraitPicture} alt={'Andres Mejia'}/>
                    </div>

                    <div className='am-about-profile-header'>
                        <p className='am-about-profile-name'>Andres Mejia</p>
                        <p className='am-about-profile-sub-headers'>{about.profileBio}</p>
                    </div>
                </div>


                <table className='am-about-table'>
                    <tr className='am-about-table-row'>

                        <td className='am-about-description'>
                            <h1 className='am-about-center'>About Me</h1>
                            <p style={{color: 'black'}}>{about.profileDescription}</p>
                        </td>

                        <td className='am-about-sidebar'>
                            <h1 className='am-about-center'>Hobbies</h1>

                            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center'}}>

                                <ul>
                                    <li className='am-about-hobby-list-item'>Boxing</li>
                                    <li className='am-about-hobby-list-item'>Basketball</li>
                                    <li className='am-about-hobby-list-item'>Mobile Development</li>
                                    <li className='am-about-hobby-list-item'>Machine Learning</li>
                                </ul>
                            </div>

                        </td>
                    </tr>
                </table>


            </div>
        );
    }
}