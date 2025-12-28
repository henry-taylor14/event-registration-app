import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { sendCustomEmailToRegistrants } from '../../api/emailAllRegistrants';

interface Props {
  open: boolean;
  onClose: () => void;
  eventId: string;
  eventName: string;
}

const EmailRegistrantsModal: React.FC<Props> = ({ open, onClose, eventId, eventName }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    setSending(true);
    try {
      await sendCustomEmailToRegistrants(eventId, subject, message);
      alert('Emails sent successfully!');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to send emails.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Message All Registrants – {eventName}</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Subject"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          className="mb-4"
        />
        <Textarea
          placeholder="Write your message..."
          rows={6}
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <Button onClick={handleSend} disabled={sending} className="mt-4">
          {sending ? 'Sending...' : 'Send Message'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default EmailRegistrantsModal;
