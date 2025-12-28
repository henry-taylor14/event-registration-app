import React from 'react';

export interface WaiverData {
  name: string;
  completed: boolean;
}

interface WaiverFormProps {
  index: number;
  waiver: WaiverData;
  onChange: (index: number, updated: WaiverData) => void;
  onRemove: (index: number) => void;
}

const WaiverForm: React.FC<WaiverFormProps> = ({ index, waiver, onChange, onRemove }) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(index, { ...waiver, name: e.target.value });
  };

  const handleCompletedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(index, { ...waiver, completed: e.target.checked });
  };

  return (
    <div className="waiver-form">
      <input
        type="text"
        placeholder="Participant Name"
        value={waiver.name}
        onChange={handleNameChange}
      />
      <label>
        <input
          type="checkbox"
          checked={waiver.completed}
          onChange={handleCompletedChange}
        /> Waiver Completed
      </label>
      <button type="button" onClick={() => onRemove(index)}>Remove</button>
    </div>
  );
};

export default WaiverForm;
