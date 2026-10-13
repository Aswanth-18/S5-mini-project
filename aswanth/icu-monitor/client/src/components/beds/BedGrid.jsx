// BedGrid.jsx
import { useEffect } from 'react';
import { getBeds } from '../../services/bedApi';
import { getSocket } from '../../services/socket';
import BedCard from './BedCard';
import { useState } from 'react';

export default function BedGrid() {
  const [beds, setBeds] = useState([]);

  const load = () => getBeds().then(setBeds).catch(() => {});
  useEffect(() => {
    load();
    const s = getSocket();
    s.on('vitals:new', load);   // refresh occupancy visuals periodically
    return () => s.off('vitals:new', load);
  }, []);

  return (
    <div>
      <h2 className="font-semibold mb-3">🛏️ Bed Occupancy</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {beds.map((b) => <BedCard key={b._id} bed={b} />)}
      </div>
    </div>
  );
}