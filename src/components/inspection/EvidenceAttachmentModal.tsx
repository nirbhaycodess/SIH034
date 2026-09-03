import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Camera, Image as ImageIcon, Plus, Trash2, ShieldCheck, Tag } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface EvidencePhoto {
  id: string;
  title: string;
  tag: string;
  timestamp: string;
  url: string;
}

export function EvidenceAttachmentModal({
  open,
  onClose,
  productName,
}: {
  open: boolean;
  onClose: () => void;
  productName: string;
}) {
  const { success } = useToast();
  const [evidenceList, setEvidenceList] = useState<EvidencePhoto[]>([
    {
      id: 'EV-01',
      title: 'Primary Package Front (PDP)',
      tag: 'Principal Display Panel',
      timestamp: 'Today, 10:14 IST',
      url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'EV-02',
      title: 'Back Nutrition & Declaration Panel',
      tag: 'Mandatory Information Panel',
      timestamp: 'Today, 10:16 IST',
      url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'EV-03',
      title: 'Barcode & Batch Stamp Close-up',
      tag: 'Batch & Date Evidence',
      timestamp: 'Today, 10:18 IST',
      url: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&auto=format&fit=crop&q=80',
    },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newTag, setNewTag] = useState('Seizure Exhibit');

  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEv: EvidencePhoto = {
      id: `EV-0${evidenceList.length + 1}`,
      title: newTitle,
      tag: newTag,
      timestamp: 'Just now',
      url: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?w=600&auto=format&fit=crop&q=80',
    };

    setEvidenceList([...evidenceList, newEv]);
    setNewTitle('');
    success('Evidence Attached', `Added ${newEv.title} to inspection legal dossier.`);
  };

  const handleRemove = (id: string) => {
    setEvidenceList(evidenceList.filter((e) => e.id !== id));
    success('Removed', 'Evidence photo removed from case record.');
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Legal Evidence & Photographs"
      subtitle={`Photographic exhibit attached to compliance audit for ${productName}`}
    >
      <div className="space-y-5">
        {/* Existing Evidence Gallery */}
        <div className="grid gap-3 sm:grid-cols-3">
          {evidenceList.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col justify-between"
            >
              <div className="h-32 w-full overflow-hidden bg-slate-900">
                <img
                  src={item.url}
                  alt={item.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="p-3">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{item.id}</span>
                  <span>{item.timestamp}</span>
                </div>
                <p className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{item.title}</p>
                <span className="inline-block mt-1 text-[10px] font-semibold bg-brand-50 text-brand-700 px-2 py-0.5 rounded border border-brand-200/50">
                  {item.tag}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-rose-600 transition"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>

        {/* Add Supplemental Evidence Form */}
        <form onSubmit={handleAddEvidence} className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Camera size={15} className="text-brand-600" />
            <span>Attach Supplemental Exhibit / Photograph</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="field-label">Exhibit Title / Description</label>
              <input
                required
                placeholder="e.g. Dual-MRP Sticker Overwrite"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="field text-xs py-1.5"
              />
            </div>

            <div>
              <label className="field-label">Legal Evidence Category</label>
              <select
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="field text-xs py-1.5 cursor-pointer"
              >
                <option value="Seizure Exhibit">Seizure Exhibit (Rule 29)</option>
                <option value="Price Sticker Violation">Price Sticker Overwrite</option>
                <option value="Illegible Font Close-up">Illegible Font Close-up</option>
                <option value="Back Panel Information">Back Panel Information</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <Button type="submit" size="sm" className="bg-brand-600 hover:bg-brand-700">
              <Plus size={14} /> Attach Evidence Photo
            </Button>
          </div>
        </form>

        <div className="pt-2 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Done Reviewing Exhibits
          </Button>
        </div>
      </div>
    </Modal>
  );
}

