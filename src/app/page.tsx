import QRCodeGenerator from '@/components/QRCodeGenerator';
import InstallPrompt from '@/components/InstallPrompt';
import PushSubscription from '@/components/PushSubscription';
import ServiceWorkerUpdatePrompt from "@/components/ServiceWorkerUpdatePrompt";

function Home() {
  return (
      <div className="min-h-screen flex flex-col items-center p-4">
        <h1 className="text-2xl font-bold mb-4">QR Code Generator PWA</h1>

        <div className="grid md:grid-cols-2 gap-10">
            <div className="flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-2">Generate QR Code</h2>
                <QRCodeGenerator />
            </div>

            <div className="flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-2">Push Notifications</h2>
                <PushSubscription />
            </div>
        </div>

        <InstallPrompt />
        <ServiceWorkerUpdatePrompt />
      </div>
  );
}

export default Home;
