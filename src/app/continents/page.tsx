import { redirect } from 'next/navigation';

/** Legacy route — continent selection lives on /play */
export default function ContinentsPage() {
	redirect('/play');
}
