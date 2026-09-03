import {
  Search,
  Plus,
  Package,
  Calendar,
  ShieldAlert,
  ArrowRight,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { mockProducts } from '../data/mockProducts';
import { useToast } from '../context/ToastContext';

const categoryImages: Record<string, string> = {
  'Personal Care':
    'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&auto=format&fit=crop&q=80',
  'Food & Beverages':
    'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&auto=format&fit=crop&q=80',
  Household:
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80',
  Electronics:
    'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?w=400&auto=format&fit=crop&q=80',
};

export function ProductRepository() {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newCategory, setNewCategory] = useState('Personal Care');
  const [newMfr, setNewMfr] = useState('');
  const { success } = useToast();

  const [productsList, setProductsList] = useState(mockProducts);

  const items = useMemo(() => {
    return productsList.filter((x) => {
      const matchesCategory = category === 'All' || x.category === category;
      const matchesStatus = status === 'All' || x.status === status;
      const matchesQ = `${x.name} ${x.brand} ${x.manufacturer}`
        .toLowerCase()
        .includes(q.toLowerCase());
      return matchesCategory && matchesStatus && matchesQ;
    });
  }, [productsList, q, category, status]);

  const handleAddCommodity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    const newProd = {
      id: `PRD-${productsList.length + 1}`,
      name: newProductName,
      brand: newBrand || newProductName.split(' ')[0],
      manufacturer: newMfr || 'Registered Domestic Packer',
      category: newCategory,
      lastInspection: 'Just registered',
      status: 'DRAFT' as const,
      violations: 0,
    };

    setProductsList([newProd, ...productsList]);
    setShowAddModal(false);
    setNewProductName('');
    setNewBrand('');
    setNewMfr('');
    success('Commodity Registered', `Registered ${newProd.name} into National Product Repository.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200/60">
              National SKU Database
            </span>
            <span className="text-xs text-slate-400">• Legal Metrology Act Registered</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
            Product Repository
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Database of registered packaged commodities, label history, and recurring compliance status.
          </p>
        </div>

        <Button onClick={() => setShowAddModal(true)} className="bg-brand-600 hover:bg-brand-700">
          <Plus size={16} />
          Register Commodity
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="card p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12 items-center">
          <div className="relative lg:col-span-6">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
            <input
              className="field pl-9 py-2 text-xs"
              placeholder="Search by commodity name, brand, or manufacturer…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className="lg:col-span-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="field py-2 text-xs cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Food & Beverages">Food & Beverages</option>
              <option value="Personal Care">Personal Care</option>
              <option value="Household">Household</option>
              <option value="Electronics">Electronics</option>
            </select>
          </div>

          <div className="lg:col-span-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="field py-2 text-xs cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="COMPLIANT">Compliant</option>
              <option value="NEEDS REVIEW">Needs Review</option>
              <option value="VIOLATION">Violation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((x) => {
          const imageSrc =
            categoryImages[x.category] ||
            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80';

          return (
            <div
              key={x.id}
              className="card overflow-hidden card-hover flex flex-col justify-between group"
            >
              <div>
                {/* Product Image Header */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <img
                    src={imageSrc}
                    alt={x.name}
                    className="h-full w-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  <div className="absolute top-3 left-3">
                    <span className="rounded-lg bg-white/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-slate-800 shadow-xs">
                      {x.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <Badge status={x.status} size="sm" />
                  </div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="font-mono text-[10px] uppercase font-bold text-cyan-300">
                      {x.id} • {x.brand}
                    </p>
                    <h3 className="font-bold text-white text-base truncate leading-snug">
                      {x.name}
                    </h3>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-5">
                  <p className="text-xs text-slate-500 line-clamp-1">
                    Manufacturer: <b className="text-slate-700 font-semibold">{x.manufacturer}</b>
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-xs border border-slate-100">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Last Inspection
                      </p>
                      <p className="font-medium text-slate-800 mt-0.5">{x.lastInspection}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Recorded Flags
                      </p>
                      <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                        {x.violations > 0 ? (
                          <span className="text-rose-600 flex items-center gap-1">
                            <ShieldAlert size={13} /> {x.violations} violations
                          </span>
                        ) : (
                          <span className="text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 size={13} /> 0 violations
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 pb-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                <Link
                  to="/inspection/new"
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800 transition"
                >
                  Inspect Again <ArrowRight size={13} />
                </Link>
                <Link
                  to="/inspections"
                  className="rounded-lg bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 transition"
                >
                  View Records
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Commodity Modal */}
      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Register New Packaged Commodity SKU"
        subtitle="Add product profile into the Legal Metrology Compliance Grid"
      >
        <form onSubmit={handleAddCommodity} className="space-y-4">
          <div>
            <label className="field-label">Commodity / Product Name</label>
            <input
              required
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              placeholder="e.g. PurePulse Organic Green Tea (250g)"
              className="field"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Brand Name</label>
              <input
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                placeholder="e.g. PurePulse"
                className="field"
              />
            </div>
            <div>
              <label className="field-label">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="field"
              >
                <option value="Food & Beverages">Food & Beverages</option>
                <option value="Personal Care">Personal Care</option>
                <option value="Household">Household</option>
                <option value="Electronics">Electronics</option>
              </select>
            </div>
          </div>

          <div>
            <label className="field-label">Registered Manufacturer / Packer</label>
            <input
              value={newMfr}
              onChange={(e) => setNewMfr(e.target.value)}
              placeholder="e.g. PurePulse Beverages India Pvt Ltd"
              className="field"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
            <Button variant="secondary" type="button" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-brand-600 hover:bg-brand-700">
              Register Commodity
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
