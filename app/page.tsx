import { redirect } from 'next/navigation';

export default function HomePage() {
  // Rediriger vers une page avec génération du token de table
  redirect('/generate-table');
}