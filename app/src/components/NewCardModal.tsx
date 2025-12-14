import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface NewCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export const NewCardModal: React.FC<NewCardModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    onSubmit(name);
    setName('');
    setError('');
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
        onClose();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <DialogHeader className="bg-primary-blue p-4 text-white">
          <DialogTitle className="text-lg font-bold">Add New Card</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name" className="text-gray-700">Cardholder Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
          </div>
          <DialogFooter className="mt-6 flex gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="green" type="submit">
              Add Card
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};