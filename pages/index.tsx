import Link from 'next/link';
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-r from-blue-50 to-green-50">
      <img 
        src="./images/timi.png" 
        alt="Logo de Timi" 
        className="w-100 h-auto mb-6"
      />
      <div className="flex gap-4">
        <Link href="/categories">
          <button className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold">
            Ver Categorías
          </button>
        </Link>
        <Link href="/tasks">
          <button className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 font-semibold">
            Ver Tareas
          </button>
        </Link>
      </div>
    </div>
  );
}
