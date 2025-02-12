import AudioWave from './audio-wave';

const statusOptions = {
  analyzing: 'Analyzing...',
  processing: 'Processing...',
  done: 'Done!',
};
export function StatusSpinner({ status }: { status: string }) {
  const statusText = statusOptions[status as keyof typeof statusOptions];
  if (status === 'done' || !status) return null;
  return (
    <div className='absolute bottom-16 left-0 right-0 flex items-center justify-center animate-fade-in-up'>
      <AudioWave className='w-12 h-12 text-white' />
      <p className='text-white/80 text-sm'>{statusText}</p>
    </div>
  );
}
