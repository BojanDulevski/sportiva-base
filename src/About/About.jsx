import { forwardRef } from 'react';

const About = forwardRef((props, ref) => {
    return (
        <div ref={ref}>
            <h1>About</h1>
            <p>About content goes here</p>
        </div>
    );
});

About.displayName = 'About';

export default About;