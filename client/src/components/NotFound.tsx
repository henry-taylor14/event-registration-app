// src/components/NotFound.tsx
import React from 'react'
import { buttonClasses, containerClasses, typographyClasses } from '../styles';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className={containerClasses.pageContainer}>
          <div className={containerClasses.contentContainer}>
            <h2 className={typographyClasses.sectionTitle}>Page not found.</h2> 
            <button className={buttonClasses.primaryButton} onClick={() => navigate(`/`)}>Return Home</button>
          </div>
        </div>
    )
}

export default NotFound
