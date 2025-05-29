import EditCar from '@/components/cars/EditCar';

export default function EditCarPage({ params }: { params: { id: string } }) {
  return (
    <EditCar carId={params.id} />
  );
}
