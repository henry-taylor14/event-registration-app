import React, { useState } from 'react';
import WaiverForm, { WaiverData } from '../WaiverForm';
import { collection, doc, addDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebaseConfig';

interface Props {
  eventId: string;
  groupId: string;
}

const WaiverListForm: React.FC<Props> = ({ eventId, groupId }) => {
  const [waivers, setWaivers] = useState<WaiverData[]>([]);
  

  const addWaiver = () => {
    setWaivers([...waivers, { name: '', completed: false }]);
  };

  const updateWaiver = (index: number, updated: WaiverData) => {
    const newWaivers = [...waivers];
    newWaivers[index] = updated;
    setWaivers(newWaivers);
  };

  const removeWaiver = (index: number) => {
    const newWaivers = waivers.filter((_, i) => i !== index);
    setWaivers(newWaivers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const waiversCollectionRef = collection(
        doc(collection(doc(collection(db, 'events'), eventId), 'groups'), groupId),
        'waivers'
      );
      for (const waiver of waivers) {
        await addDoc(waiversCollectionRef, waiver);
      }
      alert('All waivers submitted!');
      setWaivers([]); // reset form
    } catch (err) {
      console.error(err);
      alert('Error submitting waivers.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {waivers.map((waiver, index) => (
        <WaiverForm
          key={index}
          index={index}
          waiver={waiver}
          onChange={updateWaiver}
          onRemove={removeWaiver}
        />
      ))}
      <button type="button" onClick={addWaiver}>Add Waiver</button>
      <button type="submit">Submit All</button>
    </form>
  );
};

export default WaiverListForm;
