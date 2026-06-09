'use client';

import { useState } from 'react';
import Menulist from '@/components/menulist/menu_list';

export default function MenulistClient() {
  const [open, setOpen] = useState(true);

  return <Menulist open={open} setOpen={setOpen} />;
}
