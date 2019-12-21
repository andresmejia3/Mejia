import React from 'react'

let count = 1;
const Slide = ({ image }) => {
    const styles = {
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '50% 60%'
    };
    console.log('Slide #' + count++);
    return <div className="slide" style={styles}/>
};

export default Slide