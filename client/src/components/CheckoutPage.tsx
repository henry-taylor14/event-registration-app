import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PayPalButton from './PayPalButton';
import { containerClasses, typographyClasses, buttonClasses } from '../styles.ts'
import { getReceipt } from '../api/userApi.ts';
import { sendConfirmationEmail } from '../api/sendConfirmationEmail';
import RegistrationLayout from './RegistrationLayout.tsx';
import Spinner from './Spinner.tsx';

const CheckoutPage: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState(false);
  const [payment, setPayment] = useState<{
    subtotalPrice: number;
    fees: number;
    paymentTotal: number;
  } | null>(null);
  const [receipt, setReceipt] = useState<any>(null); 
  
  if (!state || !state.groupId || !state.eventId || !state.receiptId) {
    return ( 
        <div className={containerClasses.pageContainer}>
          <div className={containerClasses.contentContainer}>
            <h2 className={typographyClasses.sectionTitle}>Registration data not found.</h2> 
            <button className={buttonClasses.primaryButton} onClick={() => navigate(`/`)}>Return Home</button>
          </div>
        </div>
    )
  }

  const {
    groupId,
    groupName,
    leaderName,
    email,
    phone,
    numAttendees,
    eventId,
    eventName,
    receiptId
  } = state || {};
    
  useEffect(() => {
    if (!eventId || !groupId || !receiptId) return;
  
    let isMounted = true;
    
    const fetchPrice = async () => {
      setLoading(true);
      try {
        const response = await getReceipt(eventId, groupId, receiptId);

        if (isMounted) {
          const receiptData = response?.receiptData;

          setReceipt(receiptData);

          const subtotalPrice = receiptData.subtotalPrice;
          const fees = receiptData.fees;
          const paymentTotal = receiptData?.paymentTotal;

          if (typeof paymentTotal !== 'number')
            console.error('Invalid paymentTotal in receipt data');
            
          setPayment({ subtotalPrice, fees, paymentTotal });
          setLoading(false)
        }
      } catch (err) {
        console.error("Error fetching receipt data:", err);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    };
  
    fetchPrice();
  
    return () => {
      isMounted = false;
    };
  }, [eventId, groupId, receiptId]);

  const handleSuccess = async () => {
    setSubmitting(true); 

    try {
      const res = await sendConfirmationEmail({
        email,
        leaderName,
        groupName,
        transactionId: receiptId,
        groupSize: numAttendees,
        total: payment!.paymentTotal,
      });

      console.log('Email sent:', res);
      setEmailStatus('sent');
    } catch (err) {
      console.error('Failed to send email:', err);
      setEmailStatus('error');
    }
  
    navigate('/receipt', {
      state: {
        receipt,
        groupId,
        eventName,
        emailStatus
      }
    });
  };

    if (loading || submitting) {
      return (
        <div className={containerClasses.pageContainer}>
          <div className={containerClasses.contentContainer}>
            <Spinner/>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className={containerClasses.pageContainer}>
          <div className={containerClasses.contentContainer}>
            <h1 className={typographyClasses.pageTitle}>Page not found</h1>
            <button onClick={() => navigate('/')}>Return Home</button>
          </div>
        </div>
      );
    }

  return (
    <RegistrationLayout eventTitle={eventName}>
      <div className={containerClasses.sectionContainer}>
        <h2 className={typographyClasses.sectionTitle}>Review Your Registration</h2>

        <div className={containerClasses.twoColumnContainer}>
          <div className={containerClasses.sectionContainer}>
            <div className={typographyClasses.smallText}>Group:<div className={typographyClasses.formLabel}> {groupName}</div></div>
            <div className={typographyClasses.smallText}>Leader:</div> <div className={typographyClasses.formLabel}> {leaderName}</div>
            <div className={typographyClasses.smallText}>Email:</div><div className={typographyClasses.formLabel}>  {email}</div>
            <div className={typographyClasses.smallText}>Phone:</div> <div className={typographyClasses.formLabel}> {phone}</div>
            <div className={typographyClasses.smallText}>Attendees:</div> <div className={typographyClasses.formLabel}> {numAttendees}</div>
          </div>
          <div className={containerClasses.sectionContainer}>
            <div className={containerClasses.smallCardContainer}>
              <div className={typographyClasses.bodyHeader}>Payment Summary</div>
              <div className={typographyClasses.bodyText}>Subtotal: ${payment?.subtotalPrice.toFixed(2)}</div>
              <div className={typographyClasses.bodyText}>PayPal Fee: ${payment?.fees.toFixed(2)}</div>
              <div className={typographyClasses.bodyHeader}>Total: ${payment?.paymentTotal.toFixed(2)}</div>
            </div>
          </div>
        </div>
        <div className={containerClasses.sectionContainer}>
          <div className={typographyClasses.smallText}>Payments will show a recipient of Southern California Youth for Christ.</div>
        </div>
        
        <div className={containerClasses.contentContainer}>
          <div className={containerClasses.sectionContainer}>
            {!loading && payment?.paymentTotal !== null && (
              <PayPalButton 
                totalAmount={payment?.paymentTotal!}
                payerName={leaderName}
                payerEmail={email}
                onSuccess={handleSuccess}
              />
            )}
          </div>
        </div>
      </div>
    </RegistrationLayout>
  );
};

export default CheckoutPage;
