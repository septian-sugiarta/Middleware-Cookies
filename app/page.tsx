
import { Button } from "@/components/ui/button"
import Link from 'next/link';

export default function Home() {
	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
				<p className="font-sans text-2xl text-center">Selamat Datang di Website Kami <br /> <br /> Silahkan Login untuk Mengakses Lebih Lanjut</p><br />
				<Link href="/login">
      		<Button variant="secondary">Login</Button>
    		</Link>
		</section>
	);
}
