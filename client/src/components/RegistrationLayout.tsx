import React from "react";
import {containerClasses, typographyClasses} from '../styles.ts'

interface RegistrationLayoutProps {
  eventTitle: string;
  pageName?: string; // Optional if not used for display
  children: React.ReactNode;
}

const RegistrationLayout: React.FC<RegistrationLayoutProps> = ({
  eventTitle,
  children,
}) => {
  return (
    <div className={containerClasses.pageContainer}>
      <div className={containerClasses.banner}>
        <h1 className={typographyClasses.bannerText}>{eventTitle}</h1>
      </div>
      <div className={containerClasses.contentContainer}>

        <div className={containerClasses.cardContainer}>
            {children}
        </div>
      </div>
    </div>
  );
};

export default RegistrationLayout;
