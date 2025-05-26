'use client';

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import UserManagement from './userManagent/page';
import EmployeeManagement from './EmployeeManagement/page';
import CarManagement from './carManagement/page';
import PartManagement from './partManagement/page';

export default function Dashboard() {
  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Panel de Control</h1>
      <Tabs defaultValue='users'>
        <TabsList className='mb-6'>
          <TabsTrigger value='users'>Gestionar Usuarios</TabsTrigger>
          <TabsTrigger value='employees'>Gestionar Trabajadores</TabsTrigger>
          <TabsTrigger value='cars'>Gestionar Vehículos</TabsTrigger>
          <TabsTrigger value='parts'>Gestionar Piezas</TabsTrigger>
        </TabsList>

        <TabsContent value='users'>
          <UserManagement />
        </TabsContent>
        <TabsContent value='employees'>
          <EmployeeManagement />
        </TabsContent>
        <TabsContent value='cars'>
          <CarManagement />
        </TabsContent>
        <TabsContent value='parts'>
          <PartManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
