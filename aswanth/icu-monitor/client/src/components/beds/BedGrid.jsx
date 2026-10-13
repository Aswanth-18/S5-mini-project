import { useEffect, useState } from 'react';
import { getBeds } from '../../services/bedApi';
import { getSocket } from '../../services/socket';
import BedCard from './BedCard';

export default function BedGrid() {
  const [beds, setBeds] = useState([]);

  const load = () => getBeds().then(setBeds).catch(() => {});

  useEffect(() => {
    load();
    const s = getSocket();
    s.on('vitals:new', load);
    return () => s.off('vitals:new', load);
  }, []);

  return (
    <div>
      <h2 className="section-heading">Bed occupancy</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {beds.map((b) => <BedCard key={b._id} bed={b} />)}
      </div>
    </div>
  );
}