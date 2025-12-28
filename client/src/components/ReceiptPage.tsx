// src/components/ReceiptPage.tsx
import React from 'react';
import { buttonClasses, containerClasses, typographyClasses } from '../styles';
import RegistrationLayout from './RegistrationLayout';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const ReceiptPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) return ( 
    <div className={containerClasses.pageContainer}>
      <div className={containerClasses.contentContainer}>
        <h2 className={typographyClasses.sectionTitle}>Registration data not found.</h2> 
        <button className={buttonClasses.primaryButton} onClick={() => navigate(`/`)}>Return Home</button>
      </div>
    </div>
  )

  const {
    receipt,
    eventName,
    groupId,
    emailStatus
  } = state;

  const {
    groupName,
    leaderName,
    email,
    groupSize,
    receiptId,
  } = receipt;

  const handleClick  = () => {
    return (
      console.log('Waiver logic')
    )
  }

  return (
    <RegistrationLayout eventTitle={eventName}>
      <div className={containerClasses.sectionContainer}>
        <div className={typographyClasses.sectionTitle}>Payment Receipt</div>
        { emailStatus == 'sent' ? <div className={typographyClasses.bodyText}>Success! Receipt sent to {email}</div> : 
          <div className={typographyClasses.messageText}>Email unable to send to {email}</div>}
        <div className={containerClasses.twoColumnContainer}>
          <div className={containerClasses.sectionContainer}>
            <div className={typographyClasses.bodyHeader}>Event:<div className={typographyClasses.formLabel}>{eventName}</div></div>
            <div className={typographyClasses.smallText}>Transaction ID: <div className={typographyClasses.formLabel}>{receiptId}</div></div>
            <div className={typographyClasses.smallText}>Group ID: <div className={typographyClasses.formLabel}>{groupId}</div></div>
            <div className={typographyClasses.smallText}>Group:<div className={typographyClasses.formLabel}> {groupName}</div></div>
            <div className={typographyClasses.smallText}>Leader:</div> <div className={typographyClasses.formLabel}> {leaderName}</div>
            <div className={typographyClasses.smallText}>Email:</div><div className={typographyClasses.formLabel}>  {email}</div>
            <div className={typographyClasses.smallText}>Attendees:</div> <div className={typographyClasses.formLabel}> {groupSize}</div>
            <div className={typographyClasses.bodyText}>Total Paid: ${receipt.paymentTotal.toFixed(2)}</div>
          </div>
          <div className={containerClasses.sectionContainer}>
            <div className={typographyClasses.messageText}>** A waiver is required for each attendee. Please check your email for instructions on filing waivers or click the button below. **</div>
          </div>
        </div>

        <button className={buttonClasses.secondaryButton} onClick={() => window.print()}>Print Receipt</button>
        <button className={buttonClasses.accentButton} onClick={handleClick}>Submit Waivers</button>

      </div>
    </RegistrationLayout>
  );
};

export default ReceiptPage;
