import AppNavbar from './Navbar';
import React, { useState } from "react";
import ImageCarousel from "./ImageCarousel";
import { useNavigate } from 'react-router-dom';


function HomePage() {

    const images = [
        "https://h3xagn.com/wp-content/uploads/2022/04/part3-1.png",
        "https://www.xoriant.com/cdn/ff/04leSwSrl9_aP3tMbXTWbLGvpemOAlv_NGUN5L0hBwM/1654778613/public/Bodhi-Images/ETL-Data-Pipeline-Benefits-for-Enterprises-Xoriant.svg",
       "https://mixpanel.com/wp-content/uploads/2022/02/MXP-Blog-CensusReverseETL-1920x1080-1.png",
        "https://www.singular.net/wp-content/uploads/2020/02/how_singular_works_hor_03@2x-1024x548-1.png",
      
      ];

    const [loggedIn, setLoggedIn] = useState(true);

    const navigate = useNavigate();


    function handleLogin() {
        navigate('/extract');
        // handle user login logic here
       // setLoggedIn(true);
    }

    const buttonStyle = {
        backgroundColor: loggedIn ? '#28a745' : '#dc3545',
        color: '#fff',
        fontSize: '1rem',
        borderRadius: '0.25rem',
        border: 'none',
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        opacity: loggedIn ? 1 : 0.5
      };

    return (
        <div>
                <AppNavbar />
                <div>
                    <ImageCarousel images={images} interval={5000} />
                </div>
                <div style={{ textAlign: 'center', marginTop: '47rem' }}>
                     <button  style={buttonStyle} disabled={!loggedIn} onClick={handleLogin}>
                        {loggedIn ? 'Lets See the ETL In Action' : 'Login to See the pipiline in Action'}
                    </button>
                    
                </div>
            </div>

    );
}

export default HomePage;












