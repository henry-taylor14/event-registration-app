import React, { useState, useEffect, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useParams, useNavigate } from 'react-router-dom';
import { registerGroup, getGroups, getEventInfo } from '../api/userApi.ts';
import { GroupFormData, Group } from '../types/Group';
import RegistrationLayout from './RegistrationLayout.tsx'
import Spinner from './Spinner.tsx';
import {containerClasses, typographyClasses, formClasses, buttonClasses} from '../styles.ts'

const GroupRegisterForm: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [eventName, setEventName] = useState('');
  const [waiverURL, setWaiverURL] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [groupName, setGroupName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [numAttendees, setNumAttendees] = useState(1);
  const [validated, setValidated] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true)
  const { eventId } = useParams()
  const navigate = useNavigate()
  const captchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    if (!eventId) return;

    const fetchGroups = async () => {
      setLoading(true);
      try {
        const groupData = await getGroups(eventId)
        setGroups(groupData);
      } catch (error) {
        console.error('Error fetching groups', error)
      }
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    if (!eventId) return;
    let isMounted = true;
    setLoading(true)

    const fetchEvent = async () => {
      const eventData = await getEventInfo(eventId)
      if (isMounted) {
        setEventName(`${eventData.eventName}`)
        setWaiverURL(`${eventData.waiverURL}`)
        setLoading(false)
      }
    }

    fetchEvent();

    return () => {
      isMounted = false;
    }
  }, []);

  useEffect(() => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
  
    const isValid =
      groupName.trim() &&
      leaderName.trim() &&
      emailPattern.test(email) &&
      phonePattern.test(phone) &&
      numAttendees >= 1 &&
      numAttendees <= 100;
  
    setValidated(Boolean(isValid));
  }, [groupName, leaderName, email, phone, numAttendees]);
  

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token || '');
  };

  const handleGroupSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedGroupId(selectedId);
    setSuccess(false);
    setError('');

    if (selectedId === 'new') {
      setGroupName('');
      setLeaderName('');
      setEmail('');
      setPhone('');
    } else {
      const selected = groups.find(g => g.groupId === selectedId);
      if (selected) {
        setGroupName(selected.groupName || '');
        // setLeaderName(selected.leaderName || '');
        // setEmail(selected.email || '');
        // setPhone(selected.phone || '');
      }
    }
  };

  const validateForm = () => {
    if (!groupName || !leaderName || !email || !phone || !numAttendees) {
      setError('All fields are required.');
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('Invalid email format.');
      return false;
    }

    const phonePattern = /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
    if (!phonePattern.test(phone)) {
      setError('Invalid phone number.');
      return false;
    }

    if (isNaN(numAttendees) || numAttendees < 1 || numAttendees > 100) {
      setError('Attendee count must be between 1 and 100.');
      return false;
    }

    setValidated(true)

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
  
    if (!captchaToken) {
      alert('Please complete CAPTCHA');
      setLoading(false);
      return;
    }
  
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    let currentTxnGroupData:GroupFormData = {
      groupName,
      leaderName,
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      groupSize: Number(numAttendees),
    }

    let groupId: string | undefined = selectedGroupId !== '' && selectedGroupId !== 'new' ? selectedGroupId : undefined

    try {
      const responseData = await registerGroup(
        eventId!,
        currentTxnGroupData,
        groupId,
        captchaToken,
      )

      captchaRef.current?.reset();

      navigate('/checkout', {
        state: {
          eventId,
          eventName,
          waiverURL,
          receiptId: responseData.receiptId,
          groupId: responseData.groupId,
          groupName,
          leaderName,
          email,
          phone,
          numAttendees,
        }
      });
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred while saving the group.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={containerClasses.pageContainer}>
        <div className={containerClasses.contentContainer}>
          <Spinner/>
        </div>
      </div>
    );
  }

  return (
    <RegistrationLayout eventTitle={eventName}>
      <form className={formClasses.formContainer} onSubmit={handleSubmit}>
        <div className={containerClasses.sectionContainer}>
          <h2 className={typographyClasses.sectionTitle}>Group Registration</h2>

          <div className={formClasses.formGroup}>
            <label className={typographyClasses.formLabel}>
              Select Group:
            </label>
            <select className={formClasses.select} value={selectedGroupId} onChange={handleGroupSelection} required>
              <option value="">-- Choose a group --</option>
              <option value="new">Add New Group</option>
              {groups.map((group, index) => (
                <option key={group.groupId || index} value={group.groupId}>
                  {group.groupName}
                </option>
              ))}
            </select>
          </div>

          <div className={formClasses.formGroup}>
            <label className={typographyClasses.formLabel}>
              Group Name:
            </label>
            <input
              className={formClasses.input}
              type="text"
              value={groupName ?? ''}
              onChange={e => setGroupName(e.target.value)}
              maxLength={100}
              required
            />
          </div>
          
          <div className={formClasses.formGroup}>
            <label className={typographyClasses.formLabel}>
              Group Leader Name:
            </label>
            <input
              className={formClasses.input}
              type="text"
              value={leaderName ?? ''}
              onChange={e => setLeaderName(e.target.value)}
              maxLength={100}
              required
            />
          </div>

          <div className={formClasses.formGroup}>
            <label className={typographyClasses.formLabel}>
              Leader Email:
            </label>
            <input
              className={formClasses.input}
              type="email"
              value={email ?? ''}
              onChange={e => setEmail(e.target.value)}
              maxLength={100}
              required
            />
          </div>

          <div className={formClasses.formGroup}>
            <label className={typographyClasses.formLabel}>
              Leader Phone:
            </label>
            <input
              className={formClasses.input}
              type="tel"
              value={phone ?? ''}
              onChange={e => setPhone(e.target.value)}
              required
            />
          </div>

          <div className={formClasses.formGroup}>
            <label className={typographyClasses.formLabel}>
              Number of Attendees:
            </label>
            <input
              className={formClasses.input}
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              value={numAttendees ?? 1}
              onChange={e => setNumAttendees(Number(e.target.value))}
              min={1}
              max={100}
              required
            />
          </div>

          <ReCAPTCHA
            ref={captchaRef}
            sitekey={import.meta.env.VITE_RECAPTCHA_DEVELOPMENT_SITE_KEY}
            onChange={handleCaptchaChange}
          />

          <button
            className={
              validated && !error && !loading
                ? buttonClasses.primaryButton
                : buttonClasses.disabledButton
            }
            type="submit"
            disabled={!validated || !!error || loading}
          >
            {loading ? <Spinner/> : 'Proceed to Checkout'}
          </button>


        </div>     
      </form>
      {error && <p className={formClasses.errorText}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Group registered successfully!</p>}
    </RegistrationLayout>
  );
};

export default GroupRegisterForm;
